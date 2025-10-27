# @quarkid/dwn-client-ami

## Descripción

`@quarkid/dwn-client-ami` es una **variante del cliente DWN** optimizada para el proyecto AMI (Advanced Messaging Interface). Provee las mismas capacidades que `@quarkid/dwn-client` pero con configuraciones y optimizaciones específicas para casos de uso de mensajería avanzada.

Mantiene compatibilidad con el protocolo DWN estándar pero con extensiones para manejo de threads de mensajes y almacenamiento optimizado de conversaciones.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.2.4)
- **@ipld/dag-pb** (^2.1.17) - Estructuras DAG IPLD
- **axios** (^0.27.2) - Cliente HTTP
- **axios-retry** (^3.3.1) - Reintentos
- **base-64** (^1.0.0) - Codificación
- **cids** (^1.1.9) - Content IDs
- **multiformats** (^9.6.5) - Multi-formatos
- **uuid** (^8.3.2) - UUIDs

### DevDependencies
- **Jest** (^28.0.3) - Testing
- **nock** (^13.2.4) - HTTP mocking

## Instalación

### npm
```bash
npm install @quarkid/dwn-client-ami
```

### yarn
```bash
yarn add @quarkid/dwn-client-ami
```

### pnpm
```bash
pnpm add @quarkid/dwn-client-ami
```

## API / Exports Principales

API compatible con `@quarkid/dwn-client` con extensiones para AMI:

| Export | Descripción |
|--------|-------------|
| `DWNClientAMI` | Cliente DWN optimizado para AMI |
| Exports estándar de DWN | Write, read, query, delete |

## Configuración / Variables de Entorno

Configuración similar a `@quarkid/dwn-client` con opciones adicionales para AMI.

## Compatibilidad

- **Node.js**: Compatible con versiones modernas
- **TypeScript**: >= 4.2.4
- **Entornos**: Backend (Node.js), Frontend con bundler

## Versionado y Publicación

- **Versión actual**: `1.0.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

⚠️ **No especificada en package.json**. Verificar licencia aplicable.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

