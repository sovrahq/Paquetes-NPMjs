import { DIDDocument } from "@sovra/did-core";
import { VerifiableCredential } from "@sovra/vc-core";
import { IVCSuite } from "./vc.suite";

export interface SelectiveDisclosureZKPSuite extends IVCSuite {
    deriveVC(signedDocument: VerifiableCredential, deriveProofFrame: string, didDocumentResolver: (did: string) => Promise<DIDDocument>): Promise<VerifiableCredential>;
}