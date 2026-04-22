import axios from "axios";
import {
  Agent,
  IAgentPlugin,
  IAgentPluginMessage,
  IAgentPluginResponse,
  VerifiableCredential,
} from '@sovrahq/agent';
import { LocalAttachment, VCAttachment } from '../models/attachment';
import { AttachmentStorage } from '../models/attachment-storage';
import { AttachmentVerifiableCredential } from '../models/vc-attachment';
import { LiteEvent } from '../events/lite-event';
const cryptojs = require("crypto-js");
const mime = require('mime-types');

/**
 * Extracts the raw `VerifiableCredential` from either a plain VC or the
 * `VerifiableCredentialWithInfo` wrapper (`{ data, styles, display }`) emitted by
 * the sovrahq agent on `credentialArrived`.
 */
function unwrapCredential(entry: any): VerifiableCredential {
  if (entry && typeof entry === 'object' && 'data' in entry) {
    return entry.data as VerifiableCredential;
  }
  return entry as VerifiableCredential;
}

export class ExtrimianVCAttachmentAgentPlugin implements IAgentPlugin {
  private agent: Agent;

  private fileAttachmentContextName: string;
  attachmentStorage: AttachmentStorage;

  private readonly onError = new LiteEvent<{ title: string, message: string, vcAttachment: VCAttachment, vc: VerifiableCredential }>();
  public get error() { return this.onError.expose(); }

  constructor(opts: {
    attachmentStorage: AttachmentStorage,
    fileAttachmentContextName?: string,
  }) {
    this.fileAttachmentContextName = opts.fileAttachmentContextName;
    this.attachmentStorage = opts.attachmentStorage;
  }

  async canHandle(_input: IAgentPluginMessage): Promise<boolean> {
    return false;
  }

  async handle(_input: IAgentPluginMessage): Promise<IAgentPluginResponse> {
    return undefined;
  }

  async initialize(params: { agent: Agent }): Promise<void> {
    this.agent = params.agent;

    this.agent.agentInitialized.on(() => {
      this.agent.vc.credentialArrived.on(async (args) => {
        if (!args || !Array.isArray(args.credentials)) return;

        for (const credentialEntry of args.credentials) {
          const vc = unwrapCredential(credentialEntry);
          if (!vc || !vc.credentialSubject) continue;

          const attachments = (vc.credentialSubject as any).attachments;
          if (!Array.isArray(attachments)) continue;

          for (const f of attachments as VCAttachment[]) {
            try {
              const content = await axios.get(f.url, { responseType: 'arraybuffer' });

              const data = content.data;
              const contentType = content.headers['content-type'];
              const fileExtension = mime.extension(contentType);

              if (contentType !== f.contentType) {
                this.onError.trigger({
                  title: 'Content Type do not match',
                  message: 'The content type defined in the credential does not match that of the downloaded file.',
                  vcAttachment: f,
                  vc,
                });
              }

              await this.attachmentStorage.saveFile({
                attachmentInfo: f,
                file: data,
                vc,
                contentType,
                fileExtension,
              });

              const hash = await this.hashValue(data);

              if (hash != f.hash) {
                this.onError.trigger({
                  title: 'Unexpected hash',
                  message: 'File hash and expected hash do not match.',
                  vcAttachment: f,
                  vc,
                });
              }
            } catch (error) {
              console.error('Error downloading or processing the file:', error);
            }
          }
        }
      });
    });
  }

  private async hashValue(data: ArrayBuffer): Promise<string> {
    const wordArray = cryptojs.lib.WordArray.create(data);
    const hash = cryptojs.SHA256(wordArray);
    return hash.toString(cryptojs.enc.Hex);
  }


  public async addAttachmentToVC(vc: VerifiableCredential, attachmentFiles: VCAttachment[], secToken?: string) {
    (vc as any)['@context'].push({
      "attachments": {
        "@id": "https://example.com/vocab#attachments",
        "@container": "@list",
        "@context": {
          "title": "https://example.com/vocab#title",
          "description": "https://example.com/vocab#description",
          "url": "https://example.com/vocab#url",
          "hash": "https://example.com/vocab#hash",
          "contentType": "https://example.com/vocab#contentType",
        }
      }
    } as any);

    for (const attachmentFile of attachmentFiles) {
      if (!attachmentFile.hash || !attachmentFile.contentType) {
        const content = await axios.get(attachmentFile.url, { responseType: 'arraybuffer' });

        const contentType = attachmentFile.contentType || content.headers['content-type'];
        attachmentFile.contentType = contentType;

        const data = content.data;
        attachmentFile.hash = attachmentFile.hash || await this.hashValue(data);
      }
    }

    (vc.credentialSubject as any).attachments = {};

    if (secToken) {
      (vc.credentialSubject as any).securityToken = secToken;
    }

    (vc.credentialSubject as any).attachments = attachmentFiles;
  }

  async getFileAttachments(vc: VerifiableCredential): Promise<LocalAttachment[]> {
    const attachmentVc = vc as AttachmentVerifiableCredential;

    const attachments = new Array<LocalAttachment>();

    if (attachmentVc?.credentialSubject?.attachments && Array.isArray(attachmentVc.credentialSubject.attachments)) {
      for (const att of attachmentVc.credentialSubject.attachments) {
        const fileExtension = mime.extension(att.contentType);

        attachments.push(new LocalAttachment({
          description: att.description,
          title: att.title,
          localDownloadPath: await this.attachmentStorage.getFilePath({ attachmentInfo: att, vc, fileExtension }),
          hash: att.hash,
          mimeType: att.contentType,
          extension: fileExtension,
        }));
      }
    }

    return attachments;
  }

  async getHashFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    return await this.hashValue(arrayBuffer);
  }

  async verifyFileAttachment(vc: VerifiableCredential, fileAttachment: LocalAttachment): Promise<{ result: boolean, expectedHash: string, hash: string }> {
    const arrayBuffer = await this.attachmentStorage.getFile(fileAttachment.localDownloadPath);

    const hash = await this.hashValue(arrayBuffer);

    return {
      result: hash === fileAttachment.hash,
      expectedHash: hash,
      hash: fileAttachment.hash,
    };
  }
}
