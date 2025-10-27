# @quarkid/vc-verifier

## Descripción

`@quarkid/vc-verifier` provee funcionalidad para **verificar Verifiable Credentials (VCs)** y Verifiable Presentations. Soporta múltiples algoritmos de verificación incluyendo BBS+ (Bbsbls2020), RSA Signature 2018 y validación de pruebas JSON-LD.

Este paquete valida la integridad criptográfica de las credenciales, verifica que no hayan sido alteradas y que las firmas correspondan a los emisores indicados.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@quarkid/vc-core** (^1.1.0-2) - Modelos de VC
- **@mattrglobal/jsonld-signatures-bbs** (1.1.0) - Verificación BBS+
- **jsonld** (3.1.0) - Procesamiento JSON-LD
- **jsonld-signatures** (5.0.1) - Verificación de firmas JSON-LD
- **jsonld-document-loader** (1.2.1) - Carga de contextos JSON-LD
- **jwk-to-pem** (^2.0.5) - Conversión JWK a PEM
- **axios** (^0.27.2) - Cliente HTTP

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/vc-verifier
```

### yarn
```bash
yarn add @quarkid/vc-verifier
```

### pnpm
```bash
pnpm add @quarkid/vc-verifier
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `VCVerifierService` | Servicio principal de verificación de VCs |
| `Bbsbls2020VCVerifier` | Verificador específico para BBS+ |
| `Bbsbls2020ProofVCVerifier` | Verificador de pruebas derivadas BBS+ |
| `RsaSignature2018VCVerifier` | Verificador para RSA Signature 2018 |
| `ErrorCode` | Enum de códigos de error de verificación |

**Métodos principales de `VCVerifierService`:**
- `verifyVC(vc, options)` - Verifica una credencial verificable
- `verifyPresentation(vp, options)` - Verifica una presentación verificable
- `verifyProof(proof, vc)` - Verifica una prueba específica

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno**, pero puede necesitar:
- Acceso a resolvers de DID para verificar emisores
- Acceso a context loaders para JSON-LD
- Configuración de document loaders personalizados

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

⚠️ **Nota**: Las operaciones criptográficas BBS+ pueden requerir librerías nativas.

## Versionado y Publicación

- **Versión actual**: `1.2.0-2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

