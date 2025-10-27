# @quarkid/kms-suite-didcomm-v2

## Descripción

`@quarkid/kms-suite-didcomm-v2` implementa la **suite criptográfica DIDComm v2** para el KMS de QuarkID. Provee soporte para el protocolo DIDComm v2 con mejoras sobre v1, incluyendo mejor manejo de rotación de claves, forward secrecy y mensajería más robusta.

Utiliza librerías de Veramo y DIDComm estándar para compatibilidad con el ecosistema DIDComm más amplio.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@hearro/didcomm** (^0.6.0) - Implementación DIDComm
- **@veramo/core** (^4.0.0) - Framework Veramo
- **@veramo/did-comm** (^4.0.2) - Plugin DIDComm de Veramo
- **@stablelib/ed25519** (^1.0.3) - Firmas Ed25519
- **@ethersproject/bytes** (^5.7.0) - Utilidades bytes
- **libsodium** / **libsodium-wrappers** (^0.7.9) - Criptografía
- **jsonld** (^5.2.0) - Procesamiento JSON-LD

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-didcomm-v2
```

### yarn
```bash
yarn add @quarkid/kms-suite-didcomm-v2
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-didcomm-v2
```

⚠️ **Nota**: Suite interna usada por `@quarkid/kms-client`. No suele instalarse directamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DIDCommV2Suite` | Clase de suite DIDComm v2 |

**Métodos (implementa interfaz de suite KMS):**
- `generateKeyPair()` - Genera par de claves para DIDComm v2
- `pack(message, recipients, packing)` - Empaqueta mensaje con opciones de packing
- `unpack(packedMessage)` - Desempaqueta mensaje DIDComm v2
- `sign(content)` - Firma contenido
- `verify(content, signature)` - Verifica firma

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es consumida internamente por KMSClient.

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

⚠️ **Nota**: Puede requerir dependencias nativas (libsodium).

## Versionado y Publicación

- **Versión actual**: `1.3.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

