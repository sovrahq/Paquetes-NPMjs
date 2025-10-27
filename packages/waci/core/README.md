# @quarkid/waci

## Descripción

`@quarkid/waci` implementa el **protocolo WACI (Wallet and Credential Interactions)** para intercambio de Verifiable Credentials entre issuers, holders y verifiers. Provee una máquina de estados que gestiona flujos completos de emisión y presentación de credenciales mediante mensajes DIDComm.

Soporta out-of-band invitations, propuestas de credenciales, ofertas, solicitudes, emisión y verificación, implementando los flows completos de issuance y presentation según especificaciones DIF.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.2.4)
- **jsonpath** (^1.1.1) - Consultas JSONPath
- **jsonschema** (^1.4.1) - Validación de esquemas
- **lodash** (^4.17.21) - Utilidades JavaScript
- **uuid** (^8.3.2) - Generación de UUIDs

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing
- **ESLint** / **Prettier** - Linting y formato

## Instalación

### npm
```bash
npm install @quarkid/waci
```

### yarn
```bash
yarn add @quarkid/waci
```

### pnpm
```bash
pnpm add @quarkid/waci
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `WACIInterpreter` | Intérprete de máquina de estados WACI |
| `WACIMessage` | Modelo de mensaje WACI |
| `InputCallbacks` | Callbacks para interacciones con usuario |
| `InputDescriptor` | Descriptor de inputs para presentation requests |
| `CredentialManifestStyles` | Estilos visuales para credenciales |
| `validateVcByInputDescriptor` | Validador de VCs contra descriptores |
| Handlers: `Step2OOBInvitationHandler`, `Step3ProposeCredentialHandler`, etc. | Handlers de pasos del protocolo |

**Tipos de mensajes WACI:**
- Out-of-Band Invitation
- Propose Credential
- Offer Credential
- Request Credential
- Issue Credential
- Propose Presentation
- Request Presentation
- Present Proof
- Ack Message
- Problem Report

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno**, pero requiere configuración de callbacks:

```typescript
const callbacks: InputCallbacks = {
  selectCredentialsForPresentation: async (credentials, descriptor) => {
    // Lógica de selección
    return selectedCredentials;
  },
  // ... otros callbacks
};
```

## Compatibilidad

- **Node.js**: Compatible con versiones modernas
- **TypeScript**: >= 4.2.4
- **Entornos**: Backend (Node.js), puede funcionar en Frontend

## Versionado y Publicación

- **Versión actual**: `3.2.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

