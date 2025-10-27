# @quarkid/one-click-agent-plugin

## Descripción

`@quarkid/one-click-agent-plugin` es un **plugin para @quarkid/agent** que integra funcionalidad One-Click directamente en el agente. Permite que el agente QuarkID maneje flujos de autenticación y autorización One-Click sin necesidad de instanciar `@quarkid/oneclick-sdk` por separado.

Este plugin facilita la implementación de autenticación sin contraseña y flujos de autorización simplificados en aplicaciones que ya usan el agente QuarkID.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/oneclick-sdk** (0.3.3) - SDK One-Click completo

### PeerDependencies
- **@quarkid/agent** (0.10.0-7)

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/one-click-agent-plugin @quarkid/agent
```

### yarn
```bash
yarn add @quarkid/one-click-agent-plugin @quarkid/agent
```

### pnpm
```bash
pnpm add @quarkid/one-click-agent-plugin @quarkid/agent
```

⚠️ **Nota**: Requiere `@quarkid/agent` como peerDependency.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `OneClickAgentPlugin` | Clase del plugin One-Click para el agente |

**Integración con Agent:**

```typescript
import { Agent } from "@quarkid/agent";
import { OneClickAgentPlugin } from "@quarkid/one-click-agent-plugin";

const oneClickPlugin = new OneClickAgentPlugin({
  // ... configuración
});

const agent = new Agent({
  // ... configuración del agente
  agentPlugins: [oneClickPlugin]
});
```

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno propias**, pero depende de la configuración del agente host.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `0.3.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

