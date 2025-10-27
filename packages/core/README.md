# @quarkid/core

## Descripción

`@quarkid/core` es un paquete fundamental que provee **infraestructura arquitectónica base** para el ecosistema QuarkID. Implementa patrones CQRS (Command Query Responsibility Segregation), mediadores, inyección de dependencias y un sistema de eventos ligero.

Este paquete **no agrega funcionalidad de negocio**, sino que expone abstracciones e infraestructura que son consumidas por otros paquetes del monorepo QuarkID.

## Tecnologías y Dependencias Clave

- **TypeScript** (~4.5.4)
- **reflect-metadata** (^0.1.13) - Soporte para decoradores y metadatos

### DevDependencies
- **Inversify** (^6.0.1) - Contenedor de inyección de dependencias
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/core
```

### yarn
```bash
yarn add @quarkid/core
```

### pnpm
```bash
pnpm add @quarkid/core
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `ICommand` | Interfaz base para comandos CQRS |
| `ICommandHandler` | Interfaz para handlers de comandos |
| `INotification` | Interfaz base para notificaciones |
| `INotificationHandler` | Interfaz para handlers de notificaciones |
| `IMediator` / `Mediator` | Implementación del patrón Mediator para CQRS |
| `DIService` | Servicio de inyección de dependencias |
| `Injectable` | Decorador para marcar clases inyectables |
| `LiteEvent` | Sistema de eventos ligero y type-safe |

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es un paquete de infraestructura pura.

## Compatibilidad

- **Node.js**: >= 14.x
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede funcionar en bundlers modernos (Webpack, Vite)

⚠️ **Nota**: Requiere soporte para decoradores TypeScript (`experimentalDecorators: true` en `tsconfig.json`).

## Versionado y Publicación

- **Versión actual**: `1.0.7`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

