import { VerifiableCredential } from "@sovrahq/agent";
import { VCAttachment } from "./attachment";

export interface AttachmentStorage {
    saveFile(params: { file: ArrayBuffer, attachmentInfo: VCAttachment, vc: VerifiableCredential, fileExtension: string, contentType: string }): Promise<void>;
    getFilePath(params: { attachmentInfo: VCAttachment, vc: VerifiableCredential, fileExtension: string }): Promise<string>;
    deleteAttachment(id: string, contextParams: { vc: VerifiableCredential });
    getFile(filePath: string): Promise<ArrayBuffer>;
}
