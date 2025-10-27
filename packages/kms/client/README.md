# @quarkid/kms-client

## Descripción

`@quarkid/kms-client` es la **implementación concreta del Key Management System** de QuarkID. Provee funcionalidad para generar, almacenar y usar claves criptográficas de múltiples suites (ES256k, DIDComm, BBS+, RSA), firma de Verifiable Credentials, empaquetado/desempaquetado DIDComm y operaciones de derivación de claves.

Implementa la interfaz `IKMS` de `@quarkid/kms-core` y orquesta las diferentes suites criptográficas (`@quarkid/kms-suite-*`) según las operaciones solicitadas.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/kms-core** (^1.4.0-4) - Interfaces base del KMS
- **@quarkid/kms-suite-bbsbls2020** (1.2.0-2) - Suite BBS+ (ZKP)
- **@quarkid/kms-suite-didcomm** (^1.1.2) - Suite DIDComm v1
- **@quarkid/kms-suite-didcomm-v2** (^1.3.2) - Suite DIDComm v2
- **@quarkid/kms-suite-es256k** (^1.2.4) - Suite ECDSA secp256k1
- **@quarkid/kms-suite-rsa-signature-2018** (^1.1.3) - Suite RSA
- **@quarkid/vc-core** (1.1.0-2) - Modelos de VCs

### PeerDependencies
- **@quarkid/did-core** (1.1.2) - Debe instalarse explícitamente

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-client @quarkid/did-core
```

### yarn
```bash
yarn add @quarkid/kms-client @quarkid/did-core
```

### pnpm
```bash
pnpm add @quarkid/kms-client @quarkid/did-core
```

⚠️ **Nota**: Requiere `@quarkid/did-core` como peerDependency.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `KMSClient` | Clase principal del cliente KMS |
| `BaseConverter` / `Base` | Re-export de utilidades de @quarkid/kms-core |

**Métodos principales de `KMSClient`:**
- `create(suite)` - Genera un nuevo par de claves
- `sign(suite, publicKeyJWK, content)` - Firma contenido
- `verifySignature(publicKeyJWK, content, signature)` - Verifica firma
- `signVC(suite, publicKeyJWK, vc, did, vmId, purpose)` - Firma una VC
- `signVCPresentation(params)` - Firma una presentación de VC
- `deriveVC(params)` - Deriva una VC selectiva (BBS+)
- `pack(publicKeyJWK, recipients, content)` - Empaqueta mensaje DIDComm
- `unpack(publicKeyJWK, packedContent)` - Desempaqueta mensaje DIDComm
- `export(publicKeyJWK)` - Exporta clave privada
- `import(key)` - Importa clave privada
- `getPublicKeysBySuiteType(suite)` - Obtiene claves por tipo de suite
- `getAllPublicKeys()` - Obtiene todas las claves públicas

## Configuración / Variables de Entorno

**Configuración requerida al instanciar:**

```typescript
import { KMSClient } from "@quarkid/kms-client";
import { LANG } from "@quarkid/kms-core";

const kms = new KMSClient({
  lang: LANG.es,                    // Idioma para mnemonics
  storage: secureStorageInstance,   // Implementación de KMSStorage
  didResolver: (did) => resolver.resolve(did), // Función resolver
  mobile: false                     // true para entorno móvil
});
```

⚠️ **Nota**: Requiere implementar la interfaz `KMSStorage` para almacenamiento seguro de claves.

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), Mobile (React Native con polyfills)

## Versionado y Publicación

- **Versión actual**: `1.4.0-4`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/src/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

