# @quarkid/dwn-client

## Descripción

`@quarkid/dwn-client` es un **cliente para Decentralized Web Nodes (DWN)**, permitiendo almacenar y recuperar datos de manera descentralizada. Los DWNs actúan como almacenamiento personal asociado a un DID, donde se pueden guardar mensajes, credenciales y datos privados.

Este cliente implementa operaciones CRUD sobre DWNs compatibles con el estándar, incluyendo almacenamiento IPFS/IPLD para contenido direccionable por contenido.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.2.4)
- **@ipld/dag-pb** (^2.1.17) - Estructuras DAG IPLD
- **axios** (^0.27.2) - Cliente HTTP
- **axios-retry** (^3.3.1) - Reintentos automáticos
- **base-64** (^1.0.0) - Codificación Base64
- **cids** (^1.1.9) - Content Identifiers
- **multiformats** (^9.6.5) - Multi-hash, multi-base
- **uuid** (^8.3.2) - Generación de UUIDs

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing
- **nock** (^13.2.4) - HTTP mocking

## Instalación

### npm
```bash
npm install @quarkid/dwn-client
```

### yarn
```bash
yarn add @quarkid/dwn-client
```

### pnpm
```bash
pnpm add @quarkid/dwn-client
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DWNClient` | Cliente principal para operaciones DWN |
| `MessageStorage` | Enum de tipos de almacenamiento |
| `DWNMessage` | Alias de `Entry` - Modelo de mensaje DWN |
| Utilidades de exports desde `./utils` | Funciones auxiliares |

**Métodos principales de `DWNClient`:**
- `write(params)` - Escribe datos en el DWN
- `read(params)` - Lee datos del DWN
- `query(params)` - Consulta mensajes por filtros
- `delete(params)` - Elimina datos del DWN
- `configure(params)` - Configura el DWN

## Configuración / Variables de Entorno

**Configuración requerida:**

```typescript
const dwnClient = new DWNClient({
  dwnUrl: "https://dwn.example.com",
  did: "did:quarkid:...",
  // ... configuración adicional
});
```

⚠️ **Nota**: Requiere acceso a un servidor DWN compatible.

## Compatibilidad

- **Node.js**: Compatible con versiones modernas
- **TypeScript**: >= 4.2.4
- **Entornos**: Backend (Node.js), Frontend con bundler

## Versionado y Publicación

- **Versión actual**: `1.2.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

⚠️ **No especificada en package.json**. Verificar licencia aplicable.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

