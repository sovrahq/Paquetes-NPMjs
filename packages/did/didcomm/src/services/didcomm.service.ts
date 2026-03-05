import { Base, BaseConverter, IKMS, Suite } from "@sovrahq/kms-core";
import { DIDModenaResolver } from "@sovrahq/did-resolver";
import {
  DIDDocumentUtils,
  VerificationMethodJwk,
  VerificationMethodTypes,
} from "@sovrahq/did-core";

export class DidCommService {
  constructor(
    private kmsClient: IKMS,
    private didResolver: DIDModenaResolver
  ) {}

  async pack(recipientDid: string, content: any): Promise<string> {
    const [senderJwk] = await this.kmsClient.getPublicKeysBySuiteType(
      Suite.DIDComm
    );
    const recipientDidDocument = await this.didResolver.resolveDID(
      recipientDid
    );
    const [recipientJwk] = DIDDocumentUtils.getVerificationMethodsByType(
      recipientDidDocument,
      VerificationMethodTypes.X25519KeyAgreementKey2019
    ) as VerificationMethodJwk[];

    return this.kmsClient.pack(
      senderJwk,
      [
        BaseConverter.convert(recipientJwk, Base.JWK, Base.Hex).replace(
          "0x",
          ""
        ),
      ],
      content
    );
  }

  async unpack(packedContent: string): Promise<string> {
    const [recipientJwk] = await this.kmsClient.getPublicKeysBySuiteType(
      Suite.DIDComm
    );

    return this.kmsClient.unpack(recipientJwk, packedContent);
  }
}
