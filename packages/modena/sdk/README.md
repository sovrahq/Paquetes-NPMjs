# @quarkid/modena-sdk

## Descripción

`@quarkid/modena-sdk` es el **SDK TypeScript para Modena**, la implementación de nodos Sidetree/ION de QuarkID. Provee funcionalidad de bajo nivel para crear, actualizar y desactivar DIDs usando el protocolo Sidetree, gestionar commitment de actualizaciones y construir operaciones DID.

Este SDK es utilizado internamente por `@quarkid/did-registry` y puede ser usado directamente por aplicaciones que requieran control granular sobre operaciones Sidetree.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.7.4)
- **@quarkid/kms-client** (1.4.0-4) - Gestión de claves
- **@quarkid/kms-core** (1.4.0-4) - Core KMS
- **@transmute/did-key-secp256k1** (^0.2.1-unstable.35) - DID Key
- **@waiting/base64** (4.2.9) - Codificación Base64
- **canonicalize** (1.0.1) - Canonicalización JSON
- **multihashes** (0.4.14) - Multi-hash
- **randombytes** (2.1.0) - Generación de bytes aleatorios
- **uri-js** (4.4.0) - Parsing URIs

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing
- **ESLint** - Linting

## Instalación

### npm
```bash
npm install @quarkid/modena-sdk
```

### yarn
```bash
yarn add @quarkid/modena-sdk
```

### pnpm
```bash
pnpm add @quarkid/modena-sdk
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `ModenaDid` | Clase para operaciones DID en Modena |
| `ModenaKey` | Modelo de clave Modena |
| `ModenaRequest` | Constructor de requests Sidetree |
| `ModenaSdkConfig` | Configuración del SDK |
| `ModenaDocumentModel` | Modelo de documento DID |
| `ModenaPublicKeyModel` | Modelo de clave pública |
| `ModenaPublicKeyPurpose` | Enum de propósitos de claves |
| `ModenaServiceModel` | Modelo de servicio DID |
| `ModenaNetwork` | Enum de redes (mainnet, testnet) |
| `JwkEs256k` | Modelo JWK ES256K |
| `LocalSigner` | Firmador local para operaciones |
| `ISigner` | Interfaz de firmador |
| `DIDDocumentMetadata` | Metadatos de documento DID |
| `UpdateCommitmentUtils` | Utilidades para commitments de actualización |

## Configuración / Variables de Entorno

**Configuración del SDK:**

```typescript
const config = new ModenaSdkConfig({
  modenaUrl: "https://modena.example.com:8080",
  network: ModenaNetwork.TESTNET
});
```

## Compatibilidad

- **Node.js**: >= 11.x (inferido de `@types/node": "^11.13.4"`)
- **TypeScript**: >= 4.7.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.3.4`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/src/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

