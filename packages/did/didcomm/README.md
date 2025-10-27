# @quarkid/did-comm

## Descripción

`@quarkid/did-comm` provee funcionalidad para **comunicación segura basada en DIDComm** (DID Communication). Implementa servicios para empaquetar, desempaquetar y procesar mensajes cifrados entre DIDs utilizando protocolos DIDComm v1 y v2.

Este paquete actúa como capa de abstracción sobre las operaciones criptográficas del KMS, permitiendo comunicación autenticada y cifrada punto a punto entre agentes.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/core** (1.0.7) - Infraestructura base
- **@quarkid/did-core** (1.1.2) - Modelos de DID
- **@quarkid/did-resolver** (1.4.6) - Resolución de DIDs
- **@quarkid/kms-client** (1.4.0-4) - Gestión de claves
- **@quarkid/kms-core** (1.4.0-4) - Core KMS

### DevDependencies
- **Inversify** (^6.0.1) - Inyección de dependencias
- **reflect-metadata** (^0.1.13) - Decoradores

## Instalación

### npm
```bash
npm install @quarkid/did-comm
```

### yarn
```bash
yarn add @quarkid/did-comm
```

### pnpm
```bash
pnpm add @quarkid/did-comm
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `DIDCommService` | Servicio principal para operaciones DIDComm |

**Métodos principales:**
- `pack()` - Empaqueta y cifra un mensaje DIDComm
- `unpack()` - Desempaqueta y descifra un mensaje DIDComm
- `send()` - Envía un mensaje DIDComm a un DID receptor
- `receive()` - Recibe y procesa mensajes DIDComm

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno**, pero depende de:
- `@quarkid/kms-client` configurado con storage
- `@quarkid/did-resolver` con acceso a resolver DIDs

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

## Versionado y Publicación

- **Versión actual**: `1.1.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

