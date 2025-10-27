# @quarkid/did-core

## Descripción

`@quarkid/did-core` define las **interfaces y modelos base** para trabajar con DIDs (Decentralized Identifiers) según el estándar W3C. Este paquete expone tipos TypeScript para DID Documents, Verification Methods, Services, Purposes y mensajes DIDComm.

**No agrega funcionalidad o lógica de negocio**, sino que provee las abstracciones que son consumidas por `@quarkid/did-registry`, `@quarkid/did-resolver` y otros paquetes del ecosistema.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **reflect-metadata** (^0.1.13) - Soporte para decoradores

### DevDependencies
- **Jest** (^28.0.3) - Testing framework
- **ts-node** (^10.4.0) - Ejecutar TypeScript directamente

## Instalación

### npm
```bash
npm install @quarkid/did-core
```

### yarn
```bash
yarn add @quarkid/did-core
```

### pnpm
```bash
pnpm add @quarkid/did-core
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DIDDocument` | Interfaz del documento DID según W3C |
| `DIDMethod` | Tipos y enums de métodos DID (did:quarkid, did:ion, etc.) |
| `VerificationMethod` | Métodos de verificación (claves públicas) |
| `VerificationMethodPublicKey58` | VM con clave en Base58 |
| `VerificationMethodJwk` | VM con clave en formato JWK |
| `VerificationMethodGpg` | VM con clave GPG |
| `VerificationRelationship` | Relaciones de verificación en DID Doc |
| `Service` | Servicios asociados al DID (DWN, messaging, etc.) |
| `Purpose` | Propósitos de claves (authentication, assertionMethod, etc.) |
| `AuthenticationPurpose` / `AssertionMethodPurpose` / `KeyAgreementPurpose` | Clases de propósitos específicos |
| `DIDCommMessage` | Modelo de mensajes DIDComm |
| `IStorage` | Interfaz genérica de almacenamiento |
| `IDIDCommMessageStorage` / `IDIDCommThreadStorage` | Interfaces de storage para DIDComm |
| `DIDCommMessageIStorage` / `DIDCommThreadIStorage` | Implementaciones de storage |

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es un paquete de tipos e interfaces puras.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), Frontend (compatible con bundlers)

## Versionado y Publicación

- **Versión actual**: `1.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

