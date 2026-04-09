import { DIDCommMessage, DIDDocumentUtils, VerificationMethodJwk, VerificationMethodTypes } from "@sovrahq/did-core";
import { Base, BaseConverter, DIDCommMessagePacking, DIDCommPackedMessage, IDIDCommMessage, IJWK, IKMS, Suite } from "@sovrahq/kms-core";
import { AgentIdentity } from "../models/agent-identity";
import { IAgentRegistry } from "../models/agent-registry";
import { IAgentResolver } from "../models/agent-resolver";
import { DID } from "../models/did";
import { AgentTransport  } from "../transport/transport";
import { ITransport, } from "../models/transports/transport";

export class Messaging {
    private kms: IKMS;
    private resolver: IAgentResolver;
    private registry: IAgentRegistry;
    private identity: AgentIdentity;
    private transport: AgentTransport;

    constructor(args: {
        kms: IKMS,
        resolver: IAgentResolver;
        registry: IAgentRegistry;
        identity: AgentIdentity,
        transport: AgentTransport,
    }) {
        this.kms = args.kms;
        this.resolver = args.resolver;
        this.registry = args.registry;
        this.identity = args.identity;
        this.transport = args.transport;
    }

    async packMessage(params: {
        to: DID[] | DID,
        from?: DID,
        message: IDIDCommMessage,
        messageManagerCompatible?: boolean,
    }): Promise<{ packedMessage: DIDCommPackedMessage }> {

        if (!Array.isArray(params.to)) {
            params.to = [params.to];
        }
        const myDID = params.from?.value || this.identity.getDIDs().find(x => params.message.from == x) || this.identity.getOperationalDID().value;

        if (!myDID) {
            throw new Error(`Message from ${params.message?.from} is not a DID managed by this agent. Please check message.from`);
        }

        const myDIDDocument = await this.resolver.resolve(DID.from(myDID));

        const myKeyAgreements = DIDDocumentUtils.getVerificationMethodsByType(myDIDDocument, VerificationMethodTypes.X25519KeyAgreementKey2019) as VerificationMethodJwk[];
        const didCommV2Keys = await this.kms.getPublicKeysBySuiteType(Suite.DIDCommV2);
        const _b64 = (s: string) => { let p = s.replace(/-/g,'+').replace(/_/g,'/'); while(p.length%4) p+='='; return Buffer.from(p,'base64'); };
        const keyToSign = myKeyAgreements.find(x => didCommV2Keys.some(y => {
            // Same format: both have y (EC) or both lack y (OKP)
            if (!!x.publicKeyJwk.y === !!y.y) {
                if (!x.publicKeyJwk.y) return y.x == x.publicKeyJwk.x;
                return y.x == x.publicKeyJwk.x && y.y == x.publicKeyJwk.y;
            }
            // Cross-format: EC (x+y, 16+16 bytes) vs OKP (x, 32 bytes = concat of EC x+y)
            try {
                const ecJwk = x.publicKeyJwk.y ? x.publicKeyJwk : y;
                const okpJwk = x.publicKeyJwk.y ? y : x.publicKeyJwk;
                return Buffer.concat([_b64(ecJwk.x), _b64(ecJwk.y)]).equals(_b64(okpJwk.x));
            } catch(e) { return false; }
        }));

        if (!keyToSign) {
            throw new Error(`No DIDCommV2 key found in KMS matching DID Document. myKeyAgreements: ${myKeyAgreements.length}, KMS DIDCommV2 keys: ${didCommV2Keys.length}. Try recreating the DID.`);
        }

        const receiptVerificationMethods = await Promise.all(params.to.map(async did => {
            const targetDIDDocument = await this.resolver.resolve(did);
            const targetKeyAgreements = DIDDocumentUtils.getVerificationMethodsByType(targetDIDDocument, VerificationMethodTypes.X25519KeyAgreementKey2019) as VerificationMethodJwk[];
            if (!targetKeyAgreements || targetKeyAgreements.length === 0) {
                throw new Error(`No X25519KeyAgreementKey2019 found in target DID Document for ${did.value || did}`);
            }
            return targetKeyAgreements;
            // return `${this.getFullVerificationMethodId(targetKeyAgreements[0].id, did)}`;
        }));

        const result = await this.kms.packDIDCommV2({
            senderVerificationMethodId: this.getFullVerificationMethodId(keyToSign.id, DID.from(myDID)),
            recipientVerificationMethodIds: receiptVerificationMethods.map(vm => `${this.getFullVerificationMethodId(vm[0].id, DID.from(vm[0].controller))}`),
            message: params.message,
            packing: "authcrypt"
        });

        return result;
    }

    async unpackMessage(params: {
        message: DIDCommPackedMessage | string,
    }): Promise<DIDCommMessage> {
        if (typeof params.message === "string") {
            params.message = JSON.parse(params.message) as DIDCommPackedMessage;
        }
        const myKid = params.message.recipients.find(x => this.identity.getDIDs().some(did => did == DID.from(x.header.kid).value));

        if (!myKid) {
            const didDocument = await this.resolver.resolve(this.identity.getOperationalDID());

            const myKeyAgreements = DIDDocumentUtils.getVerificationMethodsByType(didDocument, VerificationMethodTypes.X25519KeyAgreementKey2019) as VerificationMethodJwk[];

            const key = myKeyAgreements[0];

            const packedMessage = await this.kms.unpackv2(key.publicKeyJwk as IJWK, { message: params.message }) as any;

            return packedMessage.message as DIDCommMessage;
            //TODO Arrojar excepción cuando se implemente el Backend Agent y sacar esto.
        }

        const unpackedMessage = await this.kms.unpackvDIDCommV2(DID.from(myKid.header.kid).value, params.message);

        return unpackedMessage.message as any;
    }

    async sendMessage(params: {
        to: DID,
        from?: DID,
        message: any,
        packing?: DIDCommMessagePacking,
        preferredTransport?: ITransport
    }) {
        if (!params.packing) {
            params.packing = "authcrypt"
        }

        if (params.packing != "none") {
            params.message = (await this.packMessage({
                to: params.to,
                from: params.from,
                message: params.message
            })).packedMessage
        }

        await this.transport.sendMessage({
            message: params.message,
            from: params.from,
            to: params.to,
            preferredTransport: params.preferredTransport
        });
    }

    private getFullVerificationMethodId(verificationMethodId: string, did: DID) {
        if (verificationMethodId.indexOf(did.value) > -1) {
            return verificationMethodId;
        }
        return `${did.value}#${verificationMethodId.replace("#", "")}`;
    }
}