import { IJWK } from "@sovra/kms-core";
import { ModenaDocumentModel } from "@sovra/modena-sdk";

export interface CreateDIDResponse {
    recoveryKeys: IJWK[];
    updateKeys: IJWK[];
    document: ModenaDocumentModel;
    longDid: string;
    didUniqueSuffix: string;
}