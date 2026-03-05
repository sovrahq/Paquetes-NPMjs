import * as UUID from 'uuid';
import * as jsonpath from 'jsonpath';
import * as jsonschema from 'jsonschema';
import {
  CredentialApplication,
  CredentialPresentation,
  PresentationDefinition,
  WACIMessage,
} from '../types';
import { Callback } from '../callbacks';
import { InputDescriptorError } from './erros';

/**
 * Extract the claim key from a JSONPath expression.
 * E.g. "$.credentialSubject.name" → "name", "$.type" → "type"
 */
export const extractClaimKeyFromPath = (path: string): string => {
  const segments = path.replace(/^\$\.?/, '').split('.');
  return segments[segments.length - 1];
};

/**
 * Parse an SD-JWT string and extract the disclosed claim names as a Set.
 * SD-JWT format: <JWT>~<disclosure1>~<disclosure2>~...~[<KB-JWT>]
 * Each disclosure is base64url-encoded JSON array: [salt, claimName, claimValue]
 */
export const extractSDJWTClaims = (sdJwtString: string): Set<string> => {
  const claims = new Set<string>();
  try {
    const parts = sdJwtString.split('~');
    // Skip first part (JWT) and filter out empty strings and potential KB-JWT (has dots)
    const disclosures = parts.slice(1).filter(p => p.length > 0);
    for (const disclosure of disclosures) {
      // Skip if it looks like a JWT (KB-JWT)
      if (disclosure.split('.').length === 3) continue;
      try {
        // Base64url decode
        let base64 = disclosure.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) base64 += '=';
        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        const array = JSON.parse(decoded);
        if (Array.isArray(array) && array.length >= 2) {
          claims.add(array[1]); // claimName is second element
        }
      } catch {
        // Skip malformed disclosures
      }
    }
  } catch {
    // Return empty set on any error
  }
  return claims;
};

export const getObjectValues = (object: any): string[] =>
  Object.values<string>(object);

export const createUUID = UUID.v4;

export const verifyPresentation = async (
  presentationDefinition: PresentationDefinition,
  credentialApplication: CredentialApplication | CredentialPresentation,
  verificationCallback: Callback<any, { result: boolean, error?: string[] }>,
): Promise<any> => {
  try {
    const vcs: any[] = [];
    for await (const inputDescriptor of presentationDefinition.input_descriptors) {

      const vcInput =
        credentialApplication.data.json.presentation_submission.descriptor_map.find(
          (descriptor) => inputDescriptor.id === descriptor.id,
        );

      if (!vcInput) return new InputDescriptorError();
      const vc = jsonpath.query(
        credentialApplication.data.json,
        vcInput.path,
      )[0];

      vcs.push(vc);

      // SD-JWT: if VC is a string (e.g. SD-JWT compact), verify signature then validate disclosed fields
      if (typeof vc === 'string') {
        const verificationResult = await verificationCallback(vc);
        console.log('---- Verification Result (SD-JWT string) -----', verificationResult);
        if (!verificationResult.result) {
          return {
            result: false,
            error: verificationResult.error || ['Credential verification failed'],
            vcs
          };
        }
        // Validate that required fields from constraints are present in SD-JWT disclosures
        if (inputDescriptor.constraints?.fields) {
          const disclosedClaims = extractSDJWTClaims(vc);
          for (const field of inputDescriptor.constraints.fields) {
            const pathKey = extractClaimKeyFromPath(field.path[0]);
            if (!disclosedClaims.has(pathKey)) {
              return {
                result: false,
                error: [{ name: 'missing-field', description: `SD-JWT missing required disclosure: ${pathKey}` }],
                vcs,
              };
            }
          }
        }
        continue;
      }

      // Verify fields
      for (const field of inputDescriptor.constraints.fields) {
        const fieldValue = jsonpath.query(vc, field.path[0])?.[0];
        if (!fieldValue) {
          return { result: false, error: [{ name: 'missing-field', description: `Missing required field: ${field.path[0]}` }], vcs };
        }
        if (field.filter) {
          const { errors } = jsonschema.validate(fieldValue, field.filter);
          if (errors.length) {
            return { result: false, error: [{ name: 'invalid-field', description: `Field ${field.path[0]} does not match filter` }], vcs };
          }
        }
      }

      // Verify proof
      const verificationResult = await verificationCallback(vc);
      console.log('---- Verification Result -----', verificationResult);

      if (!verificationResult.result) {
        const error = verificationResult.error as any;
        switch (error.name) {
          case 'did-document-resolution-error':
            // DIDDocumentResolutionError
            console.log(`Cannot resolve DID document: ${error.did}`);
            // Handle DID resolution failure
            break;
            
          case 'vc-invalid-signature':
            // InvalidSignatureError
            console.log('Invalid signature detected');
            console.log('Description:', error.description);
            // Handle signature validation failure
            break;
            
          case 'verification-method-not-found':
            // VerificationMethodNotFound
            console.log(`Verification method ${error.verificationMethod} not found in DID Document: ${error.did}`);
            // Handle missing verification method
            break;
            
          case 'verification-relationship-invalid':
            // VerificationRelationshipError
            console.log(`Verification method ${error.verificationMethod} is not configured as ${error.expectedVerificationRelationship}`);
            // Handle incorrect verification relationship
            break;
            
          case 'unexpected-challenge':
            // UnexpectedChallengeError
            console.log('Unexpected challenge error:', error.errorMessage);
            // Handle challenge validation failure
            break;
            
          case 'authentication-purpose-challenge-required':
            // AuthenticationPurposeChallengeRequired
            console.log('Authentication purpose requires a challenge');
            // Handle missing challenge for authentication
            break;
            
          case 'verifiable-credential-revoked':
            // VerifiableCredentialRevoked
            console.log('Credential has been revoked');
            console.log('Revocation details:', error.errors);
            return {
              result: false,
              error: verificationResult.error || ['Credential verification failed'],
              vcs:vcs
            };
            // Handle revoked credential
            break;
            
          case 'verifiable-credential-suspended':
            // VerifiableCredentialSuspended
            console.log('Credential has been suspended');
            console.log('Suspension details:', error.errors); 
            return {
              result: false,
              error: verificationResult.error || ['Credential verification failed'],
              vcs:vcs
            };
            // Handle suspended credential
            break;
            
          case 'credential-status-service-error':
            // CredentialStatusServiceError
            console.log(`Error retrieving credential status from: ${error.endpoint}`);
            console.log(`HTTP Status: ${error.httpStatusResult}`);
            console.log(`Response Data: ${error.dataResult}`);
            // Handle credential status service failure
            break;
            
          case 'verifiable-credential-expired':
            // VerifiableCredentialExpired
            console.log('Credential has expired');
            return {
              result: false,
              error: verificationResult.error || ['Credential verification failed'],
              vcs:vcs
            };
            // Handle expired credential
            break;
            
          case 'unhandled-vc-suite-error':
            // UnhandledVCSuiteError
            console.log('Unhandled VC suite error:', error.messageError);
            // Handle unexpected verification errors
            break;
            
          default:
            console.log('Unknown error type:', error.name);
            console.log('Error description:', error.description);
            console.log('Error code:', error.code);
            // Handle unknown errors
        }
      } 
    }
    return {
      result: true,
      vcs
    };
  } catch (error) {
    console.error(error);
    return {
      result: false, error, vcs: []
    };
  }
};

export const extractExpectedChallenge = (
  presentationDefinitionMessage: WACIMessage,
): string => {
  return presentationDefinitionMessage.attachments.find(
    (attachment) => attachment?.data?.json?.options?.challenge,
  ).data.json.options.challenge;
};

export const validateVcByInputDescriptor = (vc, inputDescriptor): boolean => {
  // SD-JWT: validate disclosed claims against required fields
  if (typeof vc === 'string') {
    if (!inputDescriptor.constraints?.fields) return true;
    const disclosedClaims = extractSDJWTClaims(vc);
    for (const field of inputDescriptor.constraints.fields) {
      const pathKey = extractClaimKeyFromPath(field.path[0]);
      if (!disclosedClaims.has(pathKey)) return false;
    }
    return true;
  }
  for (const field of inputDescriptor.constraints.fields) {
    const fieldValues = field.path?.map((path) => {
      return jsonpath.value(vc, path);
    });

    for (const value of fieldValues) {
      if (!value) return false;
      if (field.filter) {
        const { errors } = jsonschema.validate(value, field.filter);
        if (errors.length) {
          return false;
        }
      }
    }
  }
  return true;
};