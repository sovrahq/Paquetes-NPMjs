export class VCAttachment {
    title: string;
    description: string;
    url: string;
    hash?: string;
    contentType?: string;
}

export class LocalAttachment {
    title: string;
    description: string;
    mimeType: string;
    extension: string;
    localDownloadPath: string;
    hash: string;

    constructor(obj: Partial<LocalAttachment>) {
        Object.assign(this, obj);
    }
}

export class AttachmentFile {
    filename: string;
    data: ArrayBuffer;
}
