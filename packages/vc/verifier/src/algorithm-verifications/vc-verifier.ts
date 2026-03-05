import { DIDDocument, Purpose } from "@sovra/did-core";
import { VerifiableCredential } from "@sovra/vc-core";

export interface VCVerifier {
    verify(signedData: VerifiableCredential, purpose: Purpose, didDocumentResolver: (did: string) => Promise<DIDDocument>): Promise<{ result: boolean, errors?: string[] }>;
}