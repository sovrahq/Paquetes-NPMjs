import { Purpose } from "@sovrahq/did-core";

export interface Proof {
    type: string;
    created: string;
    proofPurpose: Purpose;
    verificationMethod: string;
}