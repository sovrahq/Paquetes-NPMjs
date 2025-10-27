# @quarkid/did-resolver

## Descripción

`@quarkid/did-resolver` expone funcionalidad para **resolver DIDs** (Decentralized Identifiers) utilizando nodos Modena. Permite obtener DID Documents a partir de un DID string, consultando registros distribuidos compatibles con Sidetree/ION.

Soporta resolución mediante `DIDModenaResolver` (para nodos Modena específicos) y resolución universal que puede delegar a múltiples resolvers según el método DID.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID Documents
- **axios** (^0.27.2) - Cliente HTTP para consultar nodos
- **reflect-metadata** (^0.1.13) - Soporte para decoradores

### DevDependencies
- **Jest** (^28.0.3) - Testing framework

## Instalación

### npm
```bash
npm install @quarkid/did-resolver
```

### yarn
```bash
yarn add @quarkid/did-resolver
```

### pnpm
```bash
pnpm add @quarkid/did-resolver
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DIDModenaResolver` | Resolver específico para nodos Modena |
| `UniversalResolver` | Resolver universal que delega según método DID |
| `ModenaResponse` | Modelo de respuesta de API Modena |
| `DIDDocMetadata` | Metadatos del DID Document (created, updated, deactivated) |

## Configuración / Variables de Entorno

**Configuración requerida**: URL del nodo Modena

```typescript
const resolver = new DIDModenaResolver({ 
  modenaURL: "https://modena.example.com:8080" 
});
```

⚠️ **Nota**: Debe apuntar a un nodo Modena válido. Se puede usar nodo propio o público.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede funcionar en Frontend con bundler

## Versionado y Publicación

- **Versión actual**: `1.4.6`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

