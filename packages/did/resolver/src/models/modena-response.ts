import { DIDDocument } from "@sovrahq/did-core";
import { DIDDocumentMetadata } from "./did-doc-metadata";

export class ModenaResponse {
    "@context": string;
    didDocument: DIDDocument;
    didDocumentMetadata: DIDDocumentMetadata;
}