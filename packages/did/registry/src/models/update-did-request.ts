import { Service } from "@sovrahq/did-core"
import { IJWK } from "@sovrahq/kms-core"
import { DIDDocumentMetadata } from "@sovrahq/modena-sdk"
import { VerificationMethod } from "./interfaces";

export type UpdateDIDRequest = {
    apiKey?: {
        fieldName?: string,
        value: string,
        type?: "header" | "queryParam"
    };
    didMethod?: string;
    updateApiUrl: string;
    didSuffix: string;
    signer: (content: any) => Promise<string>;
    updatePublicKey: IJWK;
    newUpdateKeys?: IJWK[];
    updateKeysToRemove?: {
        publicKeys?: IJWK[];
        updateCommitment?: string[];
    };
    documentMetadata: DIDDocumentMetadata;
    verificationMethodsToAdd?: VerificationMethod[];
    idsOfVerificationMethodsToRemove?: string[];
    servicesToAdd?: Service[];
    idsOfServiceToRemove?: string[];
}