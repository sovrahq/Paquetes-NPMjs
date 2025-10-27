# @quarkid/did-registry

## Descripción

`@quarkid/did-registry` expone funcionalidad para **crear y publicar DIDs** (Decentralized Identifiers) utilizando el protocolo Sidetree/ION a través de nodos Modena. Permite generar nuevos DIDs con claves criptográficas, servicios y métodos de verificación configurables.

Este paquete maneja la construcción de long-form DIDs y su anclaje en la blockchain mediante operaciones Sidetree. Se integra con `@quarkid/kms-client` para la gestión de claves criptográficas.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/kms-client** (1.4.0-4) - Gestión de claves
- **@quarkid/kms-core** (1.4.0-4) - Core KMS
- **@quarkid/core** (1.0.7) - Infraestructura base
- **@quarkid/modena-sdk** (^1.3.4) - SDK de Modena
- **@decentralized-identity/ion-sdk** (0.5.0) - SDK ION de DIF
- **bs58** (^5.0.0) - Codificación Base58
- **multibase** (^4.0.6) - Codificación multibase

### DevDependencies
- **Inversify** (^6.0.1) - Inyección de dependencias
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/did-registry
```

### yarn
```bash
yarn add @quarkid/did-registry
```

### pnpm
```bash
pnpm add @quarkid/did-registry
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `Did` (servicio) | Servicio principal para crear y publicar DIDs |
| `ModenaUniversalRegistryService` | Registry universal que soporta múltiples métodos DID |
| `CreateDIDResponse` | Modelo de respuesta al crear un DID (incluye long-form, update/recovery keys) |

**Métodos principales del servicio `Did`:**
- `createDID()` - Crea un nuevo DID con claves y servicios
- `publishDID()` - Publica el DID en un nodo Modena
- `updateDID()` - Actualiza un DID existente
- `deactivateDID()` - Desactiva un DID

## Configuración / Variables de Entorno

**Configuración requerida**: URL del nodo Modena

```typescript
const registry = new Did();
await registry.publishDID({
  modenaApiURL: "https://modena.example.com:8080",
  createDIDResponse: didResponse
});
```

⚠️ **Nota**: Requiere `@quarkid/kms-client` configurado para generar las claves criptográficas.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.5.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

