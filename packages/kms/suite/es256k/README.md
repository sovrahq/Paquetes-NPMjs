# @quarkid/kms-suite-es256k

## Descripción

`@quarkid/kms-suite-es256k` implementa la **suite criptográfica ES256K** (ECDSA secp256k1) para el KMS de QuarkID. Provee funcionalidad para generar claves, firmar y verificar usando la curva secp256k1, ampliamente utilizada en blockchain (Bitcoin, Ethereum) y DIDs.

Esta suite es fundamental para firmar VCs con algoritmo ES256K y para operaciones compatibles con ecosistemas blockchain.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@transmute/did-key-secp256k1** (^0.2.1-unstable.35) - DID Key secp256k1
- **@transmute/es256k-jws-ts** (^0.1.3) - JWS con ES256K
- **ethers** (^5.6.8) - Librería Ethereum para secp256k1
- **jsonld** (^5.2.0) - Procesamiento JSON-LD

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-es256k
```

### yarn
```bash
yarn add @quarkid/kms-suite-es256k
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-es256k
```

⚠️ **Nota**: Suite interna usada por `@quarkid/kms-client`. No suele instalarse directamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `ES256KSuite` | Clase de suite ES256K (ECDSA secp256k1) |

**Métodos (implementa interfaz de suite KMS):**
- `generateKeyPair()` - Genera par de claves secp256k1
- `sign(content)` - Firma con ECDSA secp256k1
- `verify(content, signature)` - Verifica firma ECDSA
- `signVC(vc, did, vmId, purpose)` - Firma una Verifiable Credential

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es consumida internamente por KMSClient.

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), Frontend con bundler

## Versionado y Publicación

- **Versión actual**: `1.2.4`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

