# @quarkid/oneclick-sdk

## Descripción

`@quarkid/oneclick-sdk` implementa el **protocolo One-Click** para autenticación y autorización simplificada usando identidad descentralizada. Permite flujos de autenticación sin contraseña utilizando DIDs y credenciales verificables, con soporte para mensajes out-of-band (OOB) y múltiples goal codes.

Este SDK gestiona el ciclo de vida completo de sesiones One-Click, incluyendo creación de invitaciones, procesamiento de mensajes y validación de credenciales.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-registry** (1.5.2) - Registry de DIDs
- **@quarkid/did-resolver** (1.4.6) - Resolver DIDs
- **axios** (^1.3.5) - Cliente HTTP
- **class-transformer** (^0.5.1) - Transformación de objetos
- **class-validator** (^0.14.0) - Validación de clases
- **dotenv** (^16.0.3) - Variables de entorno

### PeerDependencies
- **@quarkid/did-core** (1.1.2)
- **@quarkid/kms-client** (1.4.0-4)
- **@quarkid/kms-core** (1.4.0-4)

### DevDependencies
- **@quarkid/agent** (^0.10.0-7) - Testing
- **Jest** (^28.0.3) - Testing

## Instalación

### npm
```bash
npm install @quarkid/oneclick-sdk @quarkid/did-core @quarkid/kms-client @quarkid/kms-core
```

### yarn
```bash
yarn add @quarkid/oneclick-sdk @quarkid/did-core @quarkid/kms-client @quarkid/kms-core
```

### pnpm
```bash
pnpm add @quarkid/oneclick-sdk @quarkid/did-core @quarkid/kms-client @quarkid/kms-core
```

⚠️ **Nota**: Requiere instalar peerDependencies explícitamente.

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `OneClickSDK` | Clase principal del SDK One-Click |
| `OneClickMessage` | Modelo de mensaje One-Click |
| `OobMessage` | Mensaje Out-of-Band |
| `OobGoalCode` | Enum de goal codes (authenticate, issue-vc, etc.) |
| `MessageTypes` | Enum de tipos de mensajes |

**Métodos principales de `OneClickSDK`:**
- `createInvitation(goalCode)` - Crea invitación One-Click
- `processMessage(message)` - Procesa mensaje recibido
- `authenticate(params)` - Ejecuta flujo de autenticación
- `validateCredentials(credentials)` - Valida credenciales presentadas

## Configuración / Variables de Entorno

**Configuración requerida:**

```typescript
const oneClick = new OneClickSDK({
  did: "did:quarkid:...",
  kms: kmsClientInstance,
  resolver: resolverInstance,
  // ... opciones adicionales
});
```

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede funcionar en Frontend

## Versionado y Publicación

- **Versión actual**: `0.3.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache2.0**

⚠️ **Nota**: Verificar si es Apache-2.0 (estándar) o Apache2.0 (sin guión).

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

