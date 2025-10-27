# @quarkid/kms-core

## Descripción

`@quarkid/kms-core` expone las **interfaces y abstracciones base** para el Key Management System (KMS) de QuarkID. Define contratos para operaciones criptográficas como generación de claves, firma, cifrado/descifrado, empaquetado DIDComm y firma de Verifiable Credentials.

Este paquete **no implementa funcionalidad concreta**, sino que provee las interfaces (`IKMS`, `KMSStorage`, `IKeyPair`) y tipos de suites criptográficas que son implementadas por `@quarkid/kms-client` y las suites específicas.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **base64url** (^3.0.1) - Codificación Base64 URL-safe
- **bs58** (^5.0.0) - Codificación Base58
- **multibase** (^4.0.6) - Codificación multibase
- **multiformats** (^9.6.5) - Formatos multi-hash, multi-base
- **did-jwt** (^6.11.0) - JWTs para DIDs
- **jsonld** (^5.2.0) - Procesamiento JSON-LD

### PeerDependencies
- **@quarkid/did-core** (1.1.2)
- **@quarkid/vc-core** (1.1.0-2)

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-core @quarkid/did-core @quarkid/vc-core
```

### yarn
```bash
yarn add @quarkid/kms-core @quarkid/did-core @quarkid/vc-core
```

### pnpm
```bash
pnpm add @quarkid/kms-core @quarkid/did-core @quarkid/vc-core
```

⚠️ **Nota**: Requiere instalar las peerDependencies explícitamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `IKMS` | Interfaz principal del KMS con métodos de operaciones criptográficas |
| `KMSStorage` | Interfaz de almacenamiento seguro de claves |
| `IKeyPair` | Interfaz para pares de claves (pública/privada) |
| `Suite` | Enum de suites criptográficas soportadas |
| `LANG` | Enum de idiomas para mnemonics (en, es, fr, it) |
| `IJWK` | Interfaz de JSON Web Key |
| `BaseConverter` / `Base` | Utilidades de conversión entre encodings |
| `VCSuite` / `BbsBls2020Suite` / `DIDCommSuite` / `ES256kSignerSuite` | Interfaces de suites específicas |
| `DIDCommMessagePacking` / `IDIDCommMessage` / `IPackedDIDCommMessage` | Tipos DIDComm |
| `DIDCommPackedMessage` / `DIDCommSignedMessage` | Modelos de mensajes DIDComm |

**Suites soportadas (enum):**
- `ES256k` - Firma ECDSA secp256k1
- `DIDComm` - Comunicación DIDComm v1
- `DIDCommV2` - Comunicación DIDComm v2
- `Bbsbls2020` - BBS+ Signatures (ZKP)

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es un paquete de interfaces y tipos.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede funcionar en Frontend con polyfills

## Versionado y Publicación

- **Versión actual**: `1.4.0-4`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

