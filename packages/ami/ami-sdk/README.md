# @quarkid/ami-sdk

## Descripción

`@quarkid/ami-sdk` es el **SDK completo para AMI** (Advanced Messaging Interface), proveyendo funcionalidad de alto nivel para aplicaciones de mensajería descentralizada. Implementa gestión de chats, mensajes con estados (enviado/entregado/leído), soporte para archivos multimedia, chunking de mensajes grandes y encoders personalizados.

Construido sobre `@quarkid/ami-core` y `@quarkid/kms-core`, permite crear aplicaciones de chat seguras y descentralizadas usando DIDs.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/ami-core** (0.1.2) - Core AMI
- **@quarkid/kms-core** (1.4.0-4) - KMS Core

### DevDependencies
- **@quarkid/agent** (0.10.0-7) - Testing
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/ami-sdk
```

### yarn
```bash
yarn add @quarkid/ami-sdk
```

### pnpm
```bash
pnpm add @quarkid/ami-sdk
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `AMISDK` | Clase principal del SDK AMI |
| `Chat` / `IChat` | Modelo e interfaz de chat |
| `ChatStorage` / `IChatStorage` | Storage de chats |
| `MessageStorage` / `MessageThreadStorage` | Storage de mensajes (de ami-core) |
| `ChatMessage` / `IncomingChatMessage` / `OutgoingChatMessage` | Modelos de mensajes de chat |
| `IncomingChatMessageStatus` / `OutgoingChatMessageStatus` | Estados de mensajes |
| `IEncoder` | Interfaz de encoder |
| `ChunkedEncoder` | Encoder para mensajes grandes (chunking) |
| `StandardEncoder` | Encoder estándar |
| `IStorage` | Interfaz genérica de storage |
| `getFileExtension` | Utilidad para detectar extensión de archivos |
| Re-exports de `@quarkid/ami-core` | Message, MessageTypes, ContentType, eventos, etc. |

**Métodos principales de `AMISDK`:**
- `createChat(withDid)` - Crea nuevo chat con un DID
- `sendMessage(chatId, content, contentType)` - Envía mensaje
- `receiveMessage(message)` - Procesa mensaje recibido
- `getChats()` - Obtiene lista de chats
- `getChatMessages(chatId)` - Obtiene mensajes de un chat
- `markAsRead(chatId, messageId)` - Marca mensaje como leído

## Configuración / Variables de Entorno

**Configuración requerida:**

```typescript
const ami = new AMISDK({
  did: "did:quarkid:...",
  kms: kmsInstance,
  chatStorage: chatStorageImpl,
  messageStorage: messageStorageImpl,
  // ... opciones adicionales
});
```

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede adaptarse para Frontend/Mobile

## Versionado y Publicación

- **Versión actual**: `0.1.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

