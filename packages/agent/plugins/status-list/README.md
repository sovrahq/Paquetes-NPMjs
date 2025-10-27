# @quarkid/status-list-agent-plugin

## Descripción

`@quarkid/status-list-agent-plugin` es un **plugin para @quarkid/agent** que añade soporte para **Status Lists de Verifiable Credentials**. Permite verificar el estado de revocación/suspensión de credenciales consultando Status List 2021 según el estándar W3C.

Este plugin habilita al agente para validar automáticamente que las credenciales presentadas no han sido revocadas o suspendidas por sus emisores.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **axios** (^1.7.2) - Cliente HTTP para consultar status lists

### PeerDependencies
- **@quarkid/agent** (0.10.0-7)

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

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

⚠️ **Nota**: Requiere `@quarkid/agent` como peerDependency.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `StatusListAgentPlugin` | Clase del plugin Status List para el agente |

**Integración con Agent:**

```typescript
import { Agent } from "@quarkid/agent";
import { StatusListAgentPlugin } from "@quarkid/status-list-agent-plugin";

const statusListPlugin = new StatusListAgentPlugin({
  // ... configuración
});

const agent = new Agent({
  // ... configuración del agente
  credentialStatusPlugins: [statusListPlugin]
});
```

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno propias**. Consulta status lists mediante URLs especificadas en las credenciales.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `0.1.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

