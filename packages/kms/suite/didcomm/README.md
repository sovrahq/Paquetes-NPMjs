# @quarkid/kms-suite-didcomm

## Descripción

`@quarkid/kms-suite-didcomm` implementa la **suite criptográfica DIDComm v1** para el KMS de QuarkID. Provee funcionalidad para empaquetar y desempaquetar mensajes DIDComm, incluyendo cifrado autenticado (authcrypt) y cifrado anónimo (anoncrypt) utilizando curvas X25519 para key agreement.

Esta suite es utilizada por `@quarkid/kms-client` cuando se realizan operaciones con `Suite.DIDComm`.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@hearro/didcomm** (^0.6.0) - Implementación DIDComm
- **libsodium** / **libsodium-wrappers** (^0.7.9) - Operaciones criptográficas
- **did-jwt** (^6.8.0) - JWTs para DIDs
- **jsonld** (^5.2.0) - Procesamiento JSON-LD

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-didcomm
```

### yarn
```bash
yarn add @quarkid/kms-suite-didcomm
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-didcomm
```

⚠️ **Nota**: Suite interna usada por `@quarkid/kms-client`. No suele instalarse directamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DIDCommSuite` | Clase de suite DIDComm v1 |

**Métodos (implementa interfaz de suite KMS):**
- `generateKeyPair()` - Genera par de claves X25519
- `pack(message, recipients)` - Empaqueta mensaje DIDComm
- `unpack(packedMessage)` - Desempaqueta mensaje DIDComm
- `sign(content)` - Firma contenido con clave asociada
- `verify(content, signature)` - Verifica firma

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es consumida internamente por KMSClient.

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

⚠️ **Nota**: Requiere libsodium nativo. Puede necesitar compilación en algunos entornos.

## Versionado y Publicación

- **Versión actual**: `1.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

