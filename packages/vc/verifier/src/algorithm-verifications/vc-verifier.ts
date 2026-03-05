import { DIDDocument, Purpose } from "@sovrahq/did-core";
import { VerifiableCredential } from "@sovrahq/vc-core";

export interface VCVerifier {
    verify(signedData: VerifiableCredential, purpose: Purpose, didDocumentResolver: (did: string) => Promise<DIDDocument>): Promise<{ result: boolean, errors?: string[] }>;
}