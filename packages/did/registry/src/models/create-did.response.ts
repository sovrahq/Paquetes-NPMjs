import { IJWK } from "@sovrahq/kms-core";
import { ModenaDocumentModel } from "@sovrahq/modena-sdk";

export interface CreateDIDResponse {
    recoveryKeys: IJWK[];
    updateKeys: IJWK[];
    document: ModenaDocumentModel;
    longDid: string;
    didUniqueSuffix: string;
}