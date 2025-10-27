# @quarkid/ami-core

## Descripción

`@quarkid/ami-core` provee la **infraestructura base para AMI** (Advanced Messaging Interface), un sistema de mensajería avanzado sobre DIDComm. Define modelos de mensajes, eventos, storage y utilidades core que son utilizadas por `@quarkid/ami-sdk` y otros componentes AMI.

Implementa tipos de mensajes estándar, ACKs, problem reports y gestión de threads de conversación, siguiendo especificaciones DIDComm.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID y DIDComm

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/ami-core
```

### yarn
```bash
yarn add @quarkid/ami-core
```

### pnpm
```bash
pnpm add @quarkid/ami-core
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `AMICore` | Clase principal de AMI Core |
| `Message` / `StandardMessage` / `AckMessage` / `ProblemReportMessage` | Modelos de mensajes |
| `MessageBodyModel` / `StandardMessageBodyModel` / `ProblemReportBodyModel` | Modelos de cuerpos de mensaje |
| `MessageTypes` | Enum de tipos de mensaje |
| `ContentType` | Enum de tipos de contenido (text, image, video, audio, file) |
| `ACKStatus` | Enum de estados de ACK (sent, delivered, read) |
| `PlsACKOnValues` | Enum de valores de solicitud de ACK |
| `IMessageStorage` / `IMessageThreadStorage` | Interfaces de storage |
| `StandardMessageEvent` / `ACKMessageEvent` / `ProblemReportMessageEvent` | Eventos de mensajes |
| `Guid` | Utilidad de generación de GUIDs |
| `DIDCommMessage` | Re-export de @quarkid/did-core |

## Configuración / Variables de Entorno

⚠️ **No requiere configuración externa.** Es un paquete de modelos e infraestructura base.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), Frontend compatible

## Versionado y Publicación

- **Versión actual**: `0.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

