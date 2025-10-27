# @quarkid/ami-agent-plugin

## Descripción

`@quarkid/ami-agent-plugin` es un **plugin para @quarkid/agent** que integra funcionalidad AMI (Advanced Messaging Interface) directamente en el agente. Permite que el agente QuarkID gestione chats y mensajería avanzada sin necesidad de instanciar `@quarkid/ami-sdk` por separado.

Este plugin extiende las capacidades del agente con soporte para conversaciones DIDComm estructuradas, estados de mensaje y gestión de threads.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/ami-core** (0.1.2) - Core AMI
- **@quarkid/ami-sdk** (0.1.3) - SDK AMI completo

### PeerDependencies
- **@quarkid/agent** (0.10.0-7)
- **@quarkid/one-click-agent-plugin** (0.3.2)

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/ami-agent-plugin @quarkid/agent
```

### yarn
```bash
yarn add @quarkid/ami-agent-plugin @quarkid/agent
```

### pnpm
```bash
pnpm add @quarkid/ami-agent-plugin @quarkid/agent
```

⚠️ **Nota**: Requiere `@quarkid/agent` como peerDependency.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `AMIAgentPlugin` | Clase del plugin AMI para el agente |

**Integración con Agent:**

```typescript
import { Agent } from "@quarkid/agent";
import { AMIAgentPlugin } from "@quarkid/ami-agent-plugin";

const amiPlugin = new AMIAgentPlugin({
  // ... configuración
});

const agent = new Agent({
  // ... configuración del agente
  agentPlugins: [amiPlugin]
});
```

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno propias**, pero depende de la configuración del agente host.

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

