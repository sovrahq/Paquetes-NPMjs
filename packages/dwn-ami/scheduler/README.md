# @quarkid/dwn-client-ami-scheduler

## Descripción

`@quarkid/dwn-client-ami-scheduler` es el **scheduler de sincronización** para DWN Client AMI. Provee las mismas capacidades de `@quarkid/dwn-client-scheduler` pero optimizado para los requerimientos de sincronización del proyecto AMI.

Permite programar tareas de sincronización para mantener conversaciones y mensajes actualizados entre múltiples nodos DWN.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.2.4)
- **@quarkid/dwn-client** (^1.2.2) - Cliente DWN base
- **node-cron** (^3.0.0) - Programación cron

### DevDependencies
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/dwn-client-ami-scheduler
```

### yarn
```bash
yarn add @quarkid/dwn-client-ami-scheduler
```

### pnpm
```bash
pnpm add @quarkid/dwn-client-ami-scheduler
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DWNSchedulerAMI` | Scheduler optimizado para AMI |

**Métodos:** Similares a `@quarkid/dwn-client-scheduler`.

## Configuración / Variables de Entorno

Configuración similar a `@quarkid/dwn-client-scheduler`.

## Compatibilidad

- **Node.js**: Compatible con versiones modernas
- **TypeScript**: >= 4.2.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

⚠️ **No especificada en package.json**. Verificar licencia aplicable.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

