# @quarkid/agent

## Descripción

`@quarkid/agent` es el **SDK principal del ecosistema QuarkID** que resuelve problemas de identidad autosoberana (SSI - Self-Sovereign Identity). Permite crear y gestionar DIDs (Decentralized Identifiers), configurar protocolos de intercambio de credenciales verificables (WACI), automatizar flujos de emisión/verificación de VCs y gestionar comunicación entre agentes mediante diferentes transportes (DWN, WebSocket).

Este agente orquesta todos los componentes del stack QuarkID: KMS para llaves criptográficas, registros y resolvers de DIDs, almacenamiento de credenciales y protocolos de comunicación.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/did-core** (1.1.2) - Modelos de DID Documents
- **@quarkid/did-registry** (^1.5.2) - Creación de DIDs
- **@quarkid/did-resolver** (^1.4.6) - Resolución de DIDs
- **@quarkid/kms-client** (1.4.0-4) - Gestión de claves
- **@quarkid/vc-core** (1.1.0-2) - Credenciales verificables
- **@quarkid/waci** (~3.2.2) - Protocolo WACI
- **@quarkid/dwn-client** (^1.2.2) - Decentralized Web Node
- **@quarkid/modena-sdk** (1.3.4) - SDK de Modena
- **axios** (^1.4.0) - HTTP client
- **socket.io** / **socket.io-client** (4.6.1) - WebSocket transport

### DevDependencies
- **Jest** (^28.0.3) - Testing framework

## Instalación

### npm
```bash
npm install @quarkid/agent
```

### yarn
```bash
yarn add @quarkid/agent
```

### pnpm
```bash
pnpm add @quarkid/agent
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `Agent` | Clase principal del agente SSI |
| `IAgentStorage` / `IStorage` | Interfaces para almacenamiento de datos |
| `AgentSecureStorage` | Storage seguro para claves privadas |
| `IAgentResolver` / `AgentModenaResolver` | Resolvers de DID Documents |
| `AgentModenaUniversalResolver` | Universal resolver para múltiples métodos DID |
| `IAgentRegistry` | Interfaz para registrar DIDs |
| `DID` | Modelo de Decentralized Identifier |
| `ITransport` | Interfaz base para transportes |
| `DWNTransport` / `DWNAmiTransport` | Transportes basados en DWN |
| `WebsocketClientTransport` / `WebsocketServerTransport` | Transportes WebSocket |
| `IVCStorage` | Interfaz para almacenar credenciales verificables |
| `IAgentPlugin` / `IAgentPluginMessage` | Sistema de plugins |
| `IStatusListAgentPlugin` | Plugin para gestión de status lists |
| `VCProtocol` / `WACIProtocol` / `OpenIDProtocol` | Protocolos de intercambio de VCs |
| `CredentialFlow` | Enum de flujos (Issuance, Presentation) |
| `VerifiableCredential` | Re-export de @quarkid/vc-core |
| `DataShareBehavior` / `IdentityDataShareBehavior` | Comportamientos de exportación de identidad |

## Configuración / Variables de Entorno

⚠️ **No requiere variables de entorno obligatorias**, pero depende de configuración runtime:

- **Modena URLs**: URLs de nodos Modena para registry/resolver
- **DWN URLs**: Endpoints de Decentralized Web Nodes
- **Storages**: Implementaciones custom de `IAgentStorage` y `AgentSecureStorage`

Consultar el README original del paquete para ejemplos completos de configuración.

## Compatibilidad

- **Node.js**: >= 17.x (inferido de `@types/node": "^17.0.27"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js), puede funcionar en entornos con soporte WebSocket

⚠️ **Nota**: Requiere implementaciones de storage (filesystem, Vault, etc.) según el entorno de ejecución.

## Versionado y Publicación

- **Versión actual**: `0.10.0-7`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/index.js` (CommonJS)
- **Hook de prepublish**: `prepublishOnly` ejecuta automáticamente el build

## Licencia

**Apache-2.0**

Ver archivo [LICENSE](../../../LICENSE) en la raíz del monorepo.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

