import { VerifiableCredential } from "@sovrahq/agent";
import { VCAttachment } from "./attachment";

export class AttachmentVerifiableCredential extends VerifiableCredential<{ attachments: VCAttachment[] }> {

}
