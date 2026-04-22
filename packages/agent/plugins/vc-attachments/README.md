# @sovrahq/vc-attachments-agent-plugin

Agent plugin that downloads, stores and verifies file attachments referenced by a Verifiable Credential's `credentialSubject.attachments` array.

Port of the original `@extrimian/vc-attachments-agent-plugin` to the `@sovrahq` stack. The internal hook was adapted from `agent.vc.afterSaveVC` (removed in `@sovrahq/agent`) to `agent.vc.credentialArrived`; the public API (constructor, methods, events) is preserved.

## Install

```bash
yarn add @sovrahq/vc-attachments-agent-plugin
```

Peer dependency: `@sovrahq/agent`.

## Usage

```ts
import {
  ExtrimianVCAttachmentAgentPlugin,
  AttachmentStorage,
} from "@sovrahq/vc-attachments-agent-plugin";

const attachmentPlugin = new ExtrimianVCAttachmentAgentPlugin({
  attachmentStorage: myAttachmentStorage, // your AttachmentStorage impl
  fileAttachmentContextName: "https://example.com/attachments/v1",
});

// Register with agent
new Agent({
  // ...
  agentPlugins: [attachmentPlugin],
});

// Listen for download/hash errors
attachmentPlugin.error.on((err) => {
  console.warn(err.title, err.message, err.vcAttachment);
});
```

### `AttachmentStorage`

Implement this interface to plug in your own storage layer (filesystem, encrypted store, cloud, etc.):

```ts
interface AttachmentStorage {
  saveFile(params: { file: ArrayBuffer; attachmentInfo: VCAttachment; vc: VerifiableCredential; fileExtension: string; contentType: string }): Promise<void>;
  getFilePath(params: { attachmentInfo: VCAttachment; vc: VerifiableCredential; fileExtension: string }): Promise<string>;
  deleteAttachment(id: string, contextParams: { vc: VerifiableCredential }): Promise<void> | void;
  getFile(filePath: string): Promise<ArrayBuffer>;
}
```

## API

- `addAttachmentToVC(vc, attachmentFiles, secToken?)` — mutates `vc` to include the attachments JSON-LD context and adds the attachment descriptors to `credentialSubject.attachments`. Computes missing `hash` / `contentType` by fetching the URL.
- `getFileAttachments(vc)` — returns `LocalAttachment[]` by looking up paths in the storage.
- `verifyFileAttachment(vc, fileAttachment)` — re-reads the file from storage and checks its SHA-256 against the expected hash.
- `error` event — fires on content-type mismatch or hash mismatch during auto-download.
