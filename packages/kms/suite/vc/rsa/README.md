# @quarkid/kms-suite-rsa-signature-2018

## Descripción

`@quarkid/kms-suite-rsa-signature-2018` implementa la **suite criptográfica RSA Signature 2018** para el KMS de QuarkID. Provee funcionalidad para firmar y verificar Verifiable Credentials usando RSA con padding PKCS#1 v1.5, según el estándar W3C Linked Data Signatures.

Esta suite es útil para interoperabilidad con sistemas legacy y VCs que requieren firmas RSA.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@quarkid/kms-suite-jsonld** (^1.1.3) - Suite JSON-LD base
- **crypto-ld** (3.8.0) - Linked Data Crypto
- **js-crypto-rsa** (^1.0.4) - Operaciones RSA en JS
- **jsonld** (3.1.0) - Procesamiento JSON-LD
- **jsonld-signatures** (5.2.0) - Firmas Linked Data
- **jwk-to-pem** (^2.0.5) - Conversión JWK a PEM

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-rsa-signature-2018
```

### yarn
```bash
yarn add @quarkid/kms-suite-rsa-signature-2018
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-rsa-signature-2018
```

⚠️ **Nota**: Suite interna usada por `@quarkid/kms-client`. No suele instalarse directamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `RsaSignature2018Suite` | Clase de suite RSA Signature 2018 |

**Métodos (implementa interfaz de suite KMS):**
- `generateKeyPair()` - Genera par de claves RSA (2048 o 4096 bits)
- `signVC(vc, did, vmId, purpose)` - Firma VC con RSA
- `verifyVC(vc)` - Verifica VC con firma RSA

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es consumida internamente por KMSClient.

## Compatibilidad

- **Node.js**: >= 18.x (inferido de `@types/node": "18.8.0"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.1.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**ISC**

⚠️ **Nota**: Licencia diferente al resto del monorepo. Por confirmar si debe ser Apache-2.0.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

