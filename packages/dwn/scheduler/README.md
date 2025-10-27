# @quarkid/dwn-client-scheduler

## Descripción

`@quarkid/dwn-client-scheduler` provee funcionalidad de **sincronización programada** para Decentralized Web Nodes. Permite configurar tareas cron que sincronizan automáticamente datos entre DWNs locales y remotos, manteniendo réplicas actualizadas.

Útil para aplicaciones que requieren mantener datos DWN sincronizados en múltiples nodos o dispositivos.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.2.4)
- **@quarkid/dwn-client** (^1.2.2) - Cliente DWN base
- **node-cron** (^3.0.0) - Programación de tareas cron

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing
- **ESLint** / **Prettier** - Linting

## Instalación

### npm
```bash
npm install @quarkid/dwn-client-scheduler
```

### yarn
```bash
yarn add @quarkid/dwn-client-scheduler
```

### pnpm
```bash
pnpm add @quarkid/dwn-client-scheduler
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DWNScheduler` | Servicio de sincronización programada |

**Métodos principales:**
- `schedule(cronExpression, syncTask)` - Programa tarea de sincronización
- `stop()` - Detiene todas las tareas programadas
- `addSyncJob(job)` - Agrega trabajo de sincronización

## Configuración / Variables de Entorno

**Ejemplo de configuración:**

```typescript
const scheduler = new DWNScheduler();

// Sincronizar cada hora
scheduler.schedule('0 * * * *', async () => {
  await dwnClient.sync();
});
```

## Compatibilidad

- **Node.js**: Compatible con versiones modernas
- **TypeScript**: >= 4.2.4
- **Entornos**: Backend (Node.js) - Requiere proceso long-running

## Versionado y Publicación

- **Versión actual**: `1.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

⚠️ **No especificada en package.json**. Verificar licencia aplicable.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

