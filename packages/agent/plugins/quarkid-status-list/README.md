# @quarkid/status-list-agent-plugin (QuarkID variant)

## Descripción

⚠️ **ADVERTENCIA**: Este paquete tiene el **mismo nombre** (`@quarkid/status-list-agent-plugin`) que otro paquete en `packages/agent/plugins/status-list/`. Esto puede causar conflictos en NPM.

Esta es una **variante del plugin Status List** con configuraciones o implementaciones específicas para QuarkID. Provee funcionalidad similar de verificación de estado de credenciales pero puede tener integraciones adicionales con servicios QuarkID.

**Recomendación**: Consolidar ambos paquetes o renombrar uno de ellos para evitar colisiones.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **axios** (^1.7.2) - Cliente HTTP

### PeerDependencies
- **@quarkid/agent** (0.10.0-7)

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/status-list-agent-plugin @quarkid/agent
```

### yarn
```bash
yarn add @quarkid/status-list-agent-plugin @quarkid/agent
```

### pnpm
```bash
pnpm add @quarkid/status-list-agent-plugin @quarkid/agent
```

⚠️ **Nota**: Conflicto de nombres con `packages/agent/plugins/status-list/`. Verificar cuál es la versión correcta a usar.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `StatusListAgentPlugin` | Clase del plugin Status List (variante QuarkID) |

API similar al paquete gemelo en `packages/agent/plugins/status-list/`.

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno propias**.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `0.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)
- **Private**: `false` (explícitamente público)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

---

## ⚠️ Nota Importante sobre Duplicación

Este paquete y `packages/agent/plugins/status-list/` tienen el mismo nombre en NPM. Se recomienda:
1. Consolidar ambos en un solo paquete
2. Renombrar uno de ellos (ej: `@quarkid/status-list-agent-plugin-v2`)
3. Marcar uno como `"private": true` si es solo para uso interno

