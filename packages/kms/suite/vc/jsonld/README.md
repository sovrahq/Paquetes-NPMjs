# @quarkid/kms-suite-jsonld

## Descripción

`@quarkid/kms-suite-jsonld` provee **funcionalidad base para suites JSON-LD** del KMS de QuarkID. Actúa como suite abstracta que implementa operaciones comunes de procesamiento JSON-LD, normalización canónica y preparación de documentos para firma según el estándar W3C Linked Data Signatures.

Esta suite es extendida por otras suites específicas como `@quarkid/kms-suite-bbsbls2020` y `@quarkid/kms-suite-rsa-signature-2018`.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **axios** (^0.27.2) - Cliente HTTP
- **jsonld** (^5.2.0) - Procesamiento JSON-LD
- **jsonld-signatures** (5.0.1) - Firmas Linked Data W3C

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-suite-jsonld
```

### yarn
```bash
yarn add @quarkid/kms-suite-jsonld
```

### pnpm
```bash
pnpm add @quarkid/kms-suite-jsonld
```

⚠️ **Nota**: Suite base interna. Otras suites la usan como dependencia.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `JsonLdSuite` | Clase base para suites JSON-LD |

**Métodos principales:**
- `canonize(document)` - Normaliza documento JSON-LD canónicamente
- `createProof(document, options)` - Crea prueba criptográfica
- `verifyProof(document, proof)` - Verifica prueba
- `compact(document, context)` - Compacta JSON-LD

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es una suite base abstracta.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.1.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

