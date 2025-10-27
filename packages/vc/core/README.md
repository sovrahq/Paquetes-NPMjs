# @quarkid/vc-core

## Descripción

`@quarkid/vc-core` define los **modelos y servicios base** para trabajar con Verifiable Credentials (VCs) según el estándar W3C. Provee interfaces TypeScript para credenciales verificables, pruebas criptográficas (proofs), emisores (issuers), estados de credenciales y servicios para crear VCs con mapeo de datos.

Este paquete es utilizado por `@quarkid/agent`, `@quarkid/kms-client` y `@quarkid/vc-verifier` para gestionar el ciclo de vida de credenciales verificables.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **jsonld** (^5.2.0) - Procesamiento JSON-LD para VCs

### DevDependencies
- **Jest** (^28.0.3) - Testing
- **ts-node** (^10.4.0) - Ejecución TypeScript

## Instalación

### npm
```bash
npm install @quarkid/vc-core
```

### yarn
```bash
yarn add @quarkid/vc-core
```

### pnpm
```bash
pnpm add @quarkid/vc-core
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `VerifiableCredential` | Modelo de credencial verificable W3C |
| `UnsignedCredential` | Modelo de VC sin firma |
| `Proof` | Interfaz de prueba criptográfica |
| `JwkProof` | Prueba basada en JWK |
| `Issuer` | Modelo de emisor de credencial (DID o entidad) |
| `CredentialStatus` | Estado de revocación/suspensión de VC |
| `CredentialStatusType` | Enum de tipos de status (RevocationList2020, StatusList2021) |
| `IdType` | Tipo de identificador (string o objeto) |
| `VerifiableCredentialService` | Servicio para crear VCs con mapeo de datos |

**Métodos principales de `VerifiableCredentialService`:**
- `createCredential(params)` - Crea una VC con datos mapeados
- `mapDataWithRules(data, rules)` - Aplica reglas de mapeo a datos

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es un paquete de modelos y servicios puros.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), Frontend (compatible con bundlers)

## Versionado y Publicación

- **Versión actual**: `1.1.0-2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

