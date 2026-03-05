import { DIDDocument, Purpose } from "@sovrahq/did-core";
import { VerifiableCredential } from "@sovrahq/vc-core";
import { IKeyPair } from "../keypair";

export interface IVCJsonLDKeyPair extends IKeyPair {
    readonly id?: string;
    readonly controller?: string;
}

export interface IVCSuite {
    loadSuite(params: {
        secrets: IVCJsonLDKeyPair,
        useCache: boolean,
    });
    sign: (documentToSign: string, did: string, verificationMethodId: string, porpuse: Purpose) => Promise<any>;
}