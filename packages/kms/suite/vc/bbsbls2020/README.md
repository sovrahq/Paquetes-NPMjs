# @quarkid/kms-suite-bbsbls2020

## Descripción

`@quarkid/kms-suite-bbsbls2020` implementa la **suite criptográfica BBS+ (Bbsbls2020)** para el KMS de QuarkID. Provee funcionalidad para firmar VCs con BBS+ Signatures, permitiendo **selective disclosure** (revelación selectiva) y **Zero-Knowledge Proofs** (ZKP).

BBS+ permite a los holders presentar solo atributos específicos de una credencial sin revelar toda la información, manteniendo la verificabilidad criptográfica.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-suite-jsonld** (^1.1.3) - Suite JSON-LD base
- **@quarkid/vc-core** (1.1.0-2) - Modelos de VCs
- **@mattrglobal/jsonld-signatures-bbs** (0.12.0) - Implementación BBS+ de Mattr

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-bbsbls2020
```

### yarn
```bash
yarn add @quarkid/kms-suite-bbsbls2020
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-bbsbls2020
```

⚠️ **Nota**: Suite interna usada por `@quarkid/kms-client`. No suele instalarse directamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `Bbsbls2020Suite` | Clase de suite BBS+ Signatures |

**Métodos (implementa interfaz de suite KMS):**
- `generateKeyPair()` - Genera par de claves BLS12-381
- `signVC(vc, did, vmId, purpose)` - Firma VC con BBS+
- `deriveVC(vc, frame)` - Deriva VC selectiva (ZKP)
- `verifyVC(vc)` - Verifica VC con firma BBS+

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es consumida internamente por KMSClient.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

⚠️ **Nota**: Requiere dependencias nativas para operaciones BLS12-381. Puede necesitar compilación.

## Versionado y Publicación

- **Versión actual**: `1.2.0-2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

