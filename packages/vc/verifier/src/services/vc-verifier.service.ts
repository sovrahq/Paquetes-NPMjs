import { DIDDocument, Purpose } from "@sovrahq/did-core";
import { verifiers } from "../decorators/inject-verifier-decorator";
import { VerifiableCredential } from "@sovrahq/vc-core";
import axios, { AxiosError, AxiosResponse } from "axios";
import { CredentialStatusType } from "@sovrahq/vc-core";
import {
  CredentialStatusServiceError,
  DIDDocumentResolutionError,
  InvalidSignatureError,
  UnexpectedChallengeError,
  UnhandledVCSuiteError,
  VCSuiteError,
  VCUnexpectedError,
  VerifiableCredentialExpired,
  VerifiableCredentialRevoked,
  VerifiableCredentialSuspended,
  VerificationRelationshipError,
} from "../errors/error-code";

export class VCVerifierService {
  constructor(
    private params: {
      didDocumentResolver: (did: string) => Promise<DIDDocument>;
    }
  ) {}

  /**
   * Check credential status (revoked/suspended) for any credential format.
   * Supports BitstringStatusListEntry (VC v2) and CredentialStatusList2017 (legacy).
   * Can be used standalone for SD-JWT or other formats that handle signature verification separately.
   */
  static async checkCredentialStatus(
    credentialStatus: any,
  ): Promise<{ result: boolean; error?: VCSuiteError }> {
    if (!credentialStatus) return { result: true };

    const statusEntries = Array.isArray(credentialStatus)
      ? credentialStatus
      : [credentialStatus];

    for (const statusEntry of statusEntries) {
      // BitstringStatusListEntry (VC v2)
      if (statusEntry.type === CredentialStatusType.BitstringStatusListEntry) {
        try {
          const statusListUrl = statusEntry.statusListCredential;
          if (!statusListUrl) {
            return {
              result: false,
              error: new CredentialStatusServiceError(
                "missing-statusListCredential", 0, "statusListCredential URL is missing"
              ),
            };
          }

          let response: AxiosResponse<any, any>;
          try {
            response = await axios.get(statusListUrl);
          } catch (ex: unknown) {
            if (ex instanceof AxiosError && ex.isAxiosError) {
              return {
                result: false,
                error: new CredentialStatusServiceError(
                  statusListUrl,
                  ex.response?.status || 0,
                  ex.response?.data || "Failed to fetch status list"
                ),
              };
            }
            throw new VCUnexpectedError(ex);
          }

          const encodedList = response.data?.credentialSubject?.encodedList;
          if (!encodedList) {
            return {
              result: false,
              error: new CredentialStatusServiceError(
                statusListUrl, 0, "encodedList not found in status list credential"
              ),
            };
          }

          // Decode: base64 → gunzip → bitstring
          const zlib = require("zlib");
          const compressed = Buffer.from(encodedList, "base64");
          let bitstring: Buffer;
          try {
            bitstring = zlib.gunzipSync(compressed);
          } catch {
            return {
              result: false,
              error: new CredentialStatusServiceError(
                statusListUrl, 0, "Failed to decompress encodedList"
              ),
            };
          }

          const statusIndex = parseInt(statusEntry.statusListIndex, 10);
          const statusSize = statusEntry.statusSize || 1;

          // Read bits at statusIndex
          const bitStart = statusIndex * statusSize;
          let statusValue = 0;
          for (let i = 0; i < statusSize; i++) {
            const currentBit = bitStart + i;
            const byteIndex = Math.floor(currentBit / 8);
            const bitOffset = 7 - (currentBit % 8);
            const bit = (bitstring[byteIndex] >> bitOffset) & 1;
            statusValue = (statusValue << 1) | bit;
          }

          // Check status against statusMessage if present
          if (statusEntry.statusMessage && Array.isArray(statusEntry.statusMessage)) {
            const match = statusEntry.statusMessage.find(
              (m: any) => parseInt(m.status, 16) === statusValue
            );
            if (match) {
              const msg = match.message.toLowerCase();
              if (msg === "revoked") {
                return {
                  result: false,
                  error: new VerifiableCredentialRevoked([`${match.status} - ${match.message}`]),
                };
              }
              if (msg === "suspended") {
                return {
                  result: false,
                  error: new VerifiableCredentialSuspended([`${match.status} - ${match.message}`]),
                };
              }
            }
          } else {
            // Default 1-bit: 0 = active, 1 = revoked/set
            if (statusValue !== 0) {
              const purpose = statusEntry.statusPurpose || "revocation";
              if (purpose === "suspension") {
                return {
                  result: false,
                  error: new VerifiableCredentialSuspended(["suspended"]),
                };
              }
              return {
                result: false,
                error: new VerifiableCredentialRevoked(["revoked"]),
              };
            }
          }
        } catch (ex) {
          throw new VCUnexpectedError(ex);
        }
      }

      // CredentialStatusList2017 (legacy VC v1)
      if (statusEntry.type === CredentialStatusType.CredentialStatusList2017) {
        const errors = new Array<{ status: string; message: string }>();

        try {
          let response: AxiosResponse<any, any>;
          try {
            response = await axios.post(statusEntry.id, null);
          } catch (ex: unknown) {
            if (ex instanceof AxiosError) {
              if (ex.isAxiosError) {
                return {
                  result: false,
                  error: new CredentialStatusServiceError(
                    statusEntry.id,
                    ex.response.status,
                    ex.response.data
                  ),
                };
              }
            }
            throw new VCUnexpectedError(ex);
          }

          if (response.data?.verifiableCredential) {
            for (let i = 0; i < response.data?.verifiableCredential.length; i++) {
              if (
                response.data?.verifiableCredential[i].claim.currentStatus.toLowerCase() == "revoked" ||
                response.data?.verifiableCredential[i].claim.currentStatus.toLowerCase() == "suspend"
              ) {
                errors.push({
                  status: response.data?.verifiableCredential[i].claim.currentStatus,
                  message: response.data?.verifiableCredential[i].claim.statusReason,
                });
              }
            }
            if (errors.length > 0) {
              return {
                result: false,
                error: errors.some((x) => x.status.toLowerCase() == "revoked")
                  ? new VerifiableCredentialRevoked(errors.map((x) => `${x.status} - ${x.message}`))
                  : new VerifiableCredentialSuspended(errors.map((x) => `${x.status} - ${x.message}`)),
              };
            }
          }
        } catch (ex) {
          throw new VCUnexpectedError(ex);
        }
      }
    }

    return { result: true };
  }

  async verify(
    vc: VerifiableCredential | string,
    purpose: Purpose
  ): Promise<{ result: boolean; error?: VCSuiteError }> {
    if (typeof vc === "string") {
      vc = JSON.parse(vc);
    }

    const vcObj = vc as VerifiableCredential;

    // Check credential status (revoked/suspended)
    const statusResult = await VCVerifierService.checkCredentialStatus(vcObj.credentialStatus);
    if (!statusResult.result) return statusResult;

    // check expiration date
    if (vcObj.expirationDate && new Date(vcObj.expirationDate) < new Date()) {

      throw new VerifiableCredentialExpired();
    }

    const verifierInstance = verifiers.get(vcObj.proof.type);

    const verifier = new verifierInstance();

    try {
      const result = await verifier.verify(
        vcObj,
        purpose,
        this.params.didDocumentResolver
      );
      if (
        result.errors?.find(
          (x) =>
            x
              .toLowerCase()
              .indexOf("no proofs matched the required suite and purpose") > -1
        )
      ) {
        return {
          result: false,
          error: new VerificationRelationshipError(
            vcObj.proof.verificationMethod,
            purpose.name
          ),
        };
      
      } else if (
        result.errors?.find(
          (x) =>
            x
              .toLowerCase()
              .indexOf("the challenge is not as expected") > -1
        )
      ) {
        return {
          result: false,
          error: new UnexpectedChallengeError(
            result.errors[0]
          ),
        };
      } else if (
        result.errors?.find(
          (x) => x.toLowerCase().indexOf("invalid signature") > -1
        )
      ) {
        return {
          result: false,
          error: new InvalidSignatureError(),
        };
      } else if (
        result.errors?.find(
          (x) => x.toLowerCase().indexOf("did document can't be resolved") > -1
        )
      ) {
        return {
          result: false,
          error: new DIDDocumentResolutionError(
            vcObj.proof.verificationMethod.substring(
              0,
              vcObj.proof.verificationMethod.indexOf("#")
            )
          ),
        };
      } else if (
        result.errors?.length > 0
      ){
        return {
        result: false,
        error: new UnhandledVCSuiteError(result.errors[0])
      }
    }
     return result
    } catch (ex) {
      if (ex.name) {
        return {
          result: false,
          error: ex,
        };
      } else throw new VCUnexpectedError(ex);
    }
  }
}
