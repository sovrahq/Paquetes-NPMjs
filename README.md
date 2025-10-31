# QuarkID SDK - Monorepo

<div align="center">

[![npm version](https://img.shields.io/npm/v/@quarkid/core?label=@quarkid/core)](https://www.npmjs.com/package/@quarkid/core)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5%2B-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)

**Ecosistema completo de SDKs para Identidad Autosoberana (SSI) y Credenciales Verificables**

</div>

---

## TL;DR

- **31 paquetes** publicados bajo el scope [`@quarkid/*`](https://www.npmjs.com/org/quarkid)
- Implementación completa del **ecosistema SSI**: DIDs, VCs, WACI, DIDComm, DWN
- **Monorepo TypeScript** gestionado con Yarn Workspaces
- Arquitectura modular: Core, DID, KMS, VC, Agente, Plugins y SDKs especializados
- Compatible con **Node.js**, **React Native** y **navegadores modernos**
- Licencia **Apache-2.0** - 100% Open Source

## Arquitectura y Componentes

Este monorepo implementa la **pila completa de tecnologías SSI** organizadas en capas:

### Capa de Infraestructura
- **Core** - Patrones CQRS, DI, eventos y utilidades base
- **DID Core** - Modelos y abstracciones W3C DID
- **KMS Core** - Interfaces criptográficas y gestión de claves

### Capa de Protocolos y Comunicación
- **DIDComm** - Mensajería segura entre DIDs (v1 y v2)
- **DWN** - Decentralized Web Nodes para almacenamiento
- **WACI** - Wallet and Credential Interactions

### Capa de Gestión de Identidad
- **DID Registry** - Creación y publicación de DIDs (Sidetree/ION)
- **DID Resolver** - Resolución universal de DID Documents
- **Modena SDK** - SDK para nodos Modena (método DID:quarkid)

### Capa Criptográfica (KMS Suites)
- **ES256K** - ECDSA secp256k1 (blockchain-compatible)
- **BBS+ 2020** - Zero-Knowledge Proofs y selective disclosure
- **RSA Signature 2018** - Firmas RSA para interoperabilidad
- **DIDComm v1/v2** - Cifrado autenticado para mensajería
- **JSON-LD** - Firmas Linked Data

### Capa de Credenciales Verificables
- **VC Core** - Modelos W3C Verifiable Credentials
- **VC Verifier** - Verificación de firmas y credenciales
- **Status Lists** - Revocación y suspensión de VCs

### Capa de Aplicación
- **Agent** - SDK orquestador del ecosistema completo
- **AMI SDK** - Mensajería avanzada descentralizada
- **OneClick SDK** - Autenticación sin contraseña
- **Plugins** - Extensiones para el agente (AMI, OneClick, Status Lists)

Todas las librerías se versionan independientemente pero mantienen compatibilidad mediante dependencias semánticas.

## Tabla de Paquetes

### Core & Infrastructure

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/core`](packages/core) | ![npm](https://img.shields.io/badge/v1.0.7-blue) | Infraestructura base: CQRS, DI, eventos y utilidades |

### Agent & Plugins

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/agent`](packages/agent/core) | ![npm](https://img.shields.io/badge/v0.10.0--7-orange) | SDK principal del ecosistema - Orquestador SSI completo |
| [`@quarkid/ami-agent-plugin`](packages/agent/plugins/ami) | ![npm](https://img.shields.io/badge/v0.1.3-orange) | Plugin de mensajería avanzada (AMI) para el agente |
| [`@quarkid/one-click-agent-plugin`](packages/agent/plugins/one-click) | ![npm](https://img.shields.io/badge/v0.3.2-orange) | Plugin de autenticación One-Click para el agente |
| [`@quarkid/status-list-agent-plugin`](packages/agent/plugins/status-list) | ![npm](https://img.shields.io/badge/v0.1.3-orange) | Plugin de Status Lists para verificación de VCs |

### DID (Decentralized Identifiers)

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/did-core`](packages/did/core) | ![npm](https://img.shields.io/badge/v1.1.2-blue) | Modelos e interfaces W3C DID Document |
| [`@quarkid/did-resolver`](packages/did/resolver) | ![npm](https://img.shields.io/badge/v1.4.6-blue) | Resolver universal de DIDs mediante nodos Modena |
| [`@quarkid/did-registry`](packages/did/registry) | ![npm](https://img.shields.io/badge/v1.5.2-blue) | Creación y publicación de DIDs (Sidetree/ION) |
| [`@quarkid/did-comm`](packages/did/didcomm) | ![npm](https://img.shields.io/badge/v1.1.2-blue) | Comunicación segura DIDComm entre agentes |

### KMS (Key Management System)

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/kms-core`](packages/kms/core) | ![npm](https://img.shields.io/badge/v1.4.0--4-orange) | Interfaces y abstracciones criptográficas base |
| [`@quarkid/kms-client`](packages/kms/client) | ![npm](https://img.shields.io/badge/v1.4.0--4-orange) | Cliente KMS con múltiples suites criptográficas |
| [`@quarkid/kms-client-mobile`](packages/kms/client-mobile) | ![npm](https://img.shields.io/badge/v1.0.2-blue) | Cliente KMS optimizado para React Native |
| [`@quarkid/kms-storage-vault`](packages/kms/storage/vault) | ![npm](https://img.shields.io/badge/v1.6.3-blue) | Storage seguro con HashiCorp Vault |

### KMS Cryptographic Suites

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/kms-suite-es256k`](packages/kms/suite/es256k) | ![npm](https://img.shields.io/badge/v1.2.4-blue) | ECDSA secp256k1 (blockchain-compatible) |
| [`@quarkid/kms-suite-bbsbls2020`](packages/kms/suite/vc/bbsbls2020) | ![npm](https://img.shields.io/badge/v1.2.0--2-orange) | BBS+ Signatures - ZKP y selective disclosure |
| [`@quarkid/kms-suite-rsa-signature-2018`](packages/kms/suite/vc/rsa) | ![npm](https://img.shields.io/badge/v1.1.3-blue) | RSA Signature 2018 para interoperabilidad |
| [`@quarkid/kms-suite-didcomm`](packages/kms/suite/didcomm) | ![npm](https://img.shields.io/badge/v1.1.2-blue) | Suite DIDComm v1 - Cifrado autenticado |
| [`@quarkid/kms-suite-didcomm-v2`](packages/kms/suite/didcomm-v2) | ![npm](https://img.shields.io/badge/v1.3.2-blue) | Suite DIDComm v2 con mejoras de protocolo |
| [`@quarkid/kms-suite-jsonld`](packages/kms/suite/vc/jsonld) | ![npm](https://img.shields.io/badge/v1.1.3-blue) | Base para firmas JSON-LD |

### Verifiable Credentials

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/vc-core`](packages/vc/core) | ![npm](https://img.shields.io/badge/v1.1.0--2-orange) | Modelos y servicios W3C Verifiable Credentials |
| [`@quarkid/vc-verifier`](packages/vc/verifier) | ![npm](https://img.shields.io/badge/v1.2.0--2-orange) | Verificación de VCs (BBS+, RSA, JSON-LD) |
| [`@quarkid/waci`](packages/waci/core) | ![npm](https://img.shields.io/badge/v3.2.2-blue) | Protocolo WACI - Issuance & Presentation flows |

### DWN (Decentralized Web Nodes)

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/dwn-client`](packages/dwn/client) | ![npm](https://img.shields.io/badge/v1.2.2-blue) | Cliente para almacenamiento descentralizado DWN |
| [`@quarkid/dwn-client-scheduler`](packages/dwn/scheduler) | ![npm](https://img.shields.io/badge/v1.1.2-blue) | Sincronización programada de datos DWN |
| [`@quarkid/dwn-client-ami`](packages/dwn-ami/client) | ![npm](https://img.shields.io/badge/v1.0.3-blue) | Cliente DWN optimizado para AMI |
| [`@quarkid/dwn-client-ami-scheduler`](packages/dwn-ami/scheduler) | ![npm](https://img.shields.io/badge/v1.1.2-blue) | Scheduler DWN para proyecto AMI |

### Specialized SDKs

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| [`@quarkid/modena-sdk`](packages/modena/sdk) | ![npm](https://img.shields.io/badge/v1.3.4-blue) | SDK Sidetree/ION para nodos Modena |
| [`@quarkid/oneclick-sdk`](packages/one-click) | ![npm](https://img.shields.io/badge/v0.3.3-orange) | Autenticación sin contraseña con DIDs |
| [`@quarkid/ami-core`](packages/ami/ami-core) | ![npm](https://img.shields.io/badge/v0.1.2-orange) | Core de mensajería avanzada (AMI) |
| [`@quarkid/ami-sdk`](packages/ami/ami-sdk) | ![npm](https://img.shields.io/badge/v0.1.3-orange) | SDK completo de chat descentralizado |

**Leyenda de estados:**
- 🔵 **Estable** - Versión semántica completa (ej: `1.x.x`)
- 🟠 **Pre-release** - Con sufijo de desarrollo (ej: `0.x.x` o `x.x.x-N`)

## Quickstart

### Instalación de Paquetes Individuales

```bash
# Instalar el agente completo
npm install @quarkid/agent

# O paquetes específicos
npm install @quarkid/did-registry @quarkid/kms-client @quarkid/vc-core
```

### Desarrollo en el Monorepo

```bash
# 1. Clonar el repositorio
git clone https://github.com/ssi-quarkid/Paquetes-NPMjs.git
cd Paquetes-NPMjs

# 2. Instalar dependencias
yarn install

# 3. Construir todos los paquetes
yarn workspaces foreach run build

# 4. Ejecutar tests (opcional)
yarn workspaces foreach run test
```

### Ejemplo de Uso Básico

```typescript
import { Agent } from "@quarkid/agent";
import { WACIProtocol } from "@quarkid/waci";
import { KMSClient } from "@quarkid/kms-client";

// Configurar agente SSI
const agent = new Agent({
  didDocumentResolver: resolver,
  didDocumentRegistry: registry,
  vcProtocols: [new WACIProtocol({})],
  secureStorage: secureStorageImpl,
  agentStorage: storageImpl,
  vcStorage: vcStorageImpl
});

await agent.initialize();

// Crear DID
const did = await agent.identity.createNewDID({
  dwnUrl: "https://dwn.example.com"
});
```


## Requisitos

### Para Usar los Paquetes
- **Node.js** ≥ 14.x (algunos paquetes requieren ≥ 17.x)
- **TypeScript** ≥ 4.5 (opcional, pero recomendado)
- Entornos soportados: **Node.js**, **React Native**, **Navegadores modernos**

### Para Desarrollo del Monorepo
- **Node.js** ≥ 16.x
- **Yarn** ≥ 3.x (Yarn Workspaces)
- **Git** ≥ 2.x
- Sistemas operativos: Linux, macOS, Windows (WSL recomendado)

## Guía de Desarrollo

### Scripts Principales

| Comando | Descripción |
|---------|-------------|
| `yarn install` | Instala todas las dependencias del monorepo |
| `yarn workspaces foreach run build` | Compila todos los paquetes |
| `yarn workspaces foreach run test` | Ejecuta tests de todos los paquetes |
| `node scripts/bump_versions.mjs` | Incrementa versiones de todos los paquetes |
| `node scripts/bump_versions.mjs --dry` | Vista previa del bump de versiones |

### Trabajar en un Paquete Específico

```bash
# Compilar un paquete individual
yarn workspace @quarkid/core build

# Ejecutar tests de un paquete
yarn workspace @quarkid/agent test

# Modo watch para desarrollo
yarn workspace @quarkid/did-core build --watch
```

### Estructura de Carpetas

```
packages/
├── agent/           # Agente principal y plugins
│   ├── core/
│   └── plugins/
├── did/             # Paquetes DID
├── kms/             # Key Management System
│   ├── client/
│   ├── core/
│   ├── suite/       # Suites criptográficas
│   └── storage/
├── vc/              # Verifiable Credentials
├── dwn/             # Decentralized Web Nodes
├── waci/            # WACI protocol
└── [otros SDKs]/
```

## Stack Tecnológico

- **Lenguaje**: TypeScript 4.5+
- **Gestión de Dependencias**: Yarn Workspaces (v3+)
- **Build**: TypeScript Compiler (tsc)
- **Testing**: Jest 28+ con ts-jest
- **Linting**: ESLint + Prettier (configurado por paquete)
- **Versionado**: SemVer con script custom de bump
- **Publicación**: npm registry bajo scope `@quarkid/*`
- **Convenciones**: [Conventional Commits](https://www.conventionalcommits.org/)

## Variables de Entorno

Algunas librerías requieren configuración mediante variables de entorno:

| Paquete | Variables | Ejemplo |
|---------|-----------|---------|
| `@quarkid/kms-client` | `KMS_HOST`, `KMS_PORT` | `https://kms.example.com` |
| `@quarkid/dwn-client` | `DWN_URL` | `https://dwn.example.com` |
| `@quarkid/did-registry` | `REGISTRY_URL`, `REGISTRY_API_KEY` | Ver README del paquete |
| `@quarkid/modena-sdk` | `MODENA_NODE_URL` | `https://modena.example.com` |

> ⚠️ **Importante**: Nunca commitees claves privadas o secretos. Usa archivos `.env.example` para documentar variables requeridas.

## Publicación y Versionado

### Estrategia de Versiones

- **SemVer estricto**: `MAJOR.MINOR.PATCH` o `MAJOR.MINOR.PATCH-PRERELEASE`
- **Scope NPM**: Todos bajo `@quarkid/*`
- **Dependencias internas**: Sincronizadas automáticamente con script de bump

## Compatibilidad y Entornos

### Plataformas Soportadas

| Entorno | Soporte | Notas |
|---------|---------|-------|
| **Node.js** | ✅ ≥ 14.x | Recomendado ≥ 16.x |
| **React Native** | ✅ Parcial | Ver `@quarkid/kms-client-mobile` |
| **Navegadores** | ✅ Modernos | Requiere bundler (Webpack, Vite) |
| **Deno** | ⚠️ Experimental | No oficialmente soportado |

### Formatos de Salida

- **CommonJS** (`.js`) - Principal, compatible con Node.js
- **Type Definitions** (`.d.ts`) - Soporte completo TypeScript
- **Source Maps** (`.js.map`) - Para debugging

### Dependencias Nativas

Algunos paquetes requieren dependencias nativas:
- `@quarkid/kms-suite-bbsbls2020` - Operaciones BLS12-381
- `@quarkid/kms-suite-didcomm` - libsodium para cifrado
- `@quarkid/kms-suite-didcomm-v2` - libsodium + Veramo

**Para React Native**: Requiere polyfills de `crypto` y `buffer`.

## 🚦 Estado del Proyecto

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| **Versión Actual** | v1.x / v0.x | 31 paquetes activos |
| **Estabilidad** | Beta / Estable | Ver tabla de paquetes |
| **Cobertura Tests** | Parcial | En expansión continua |
| **Documentación** | ✅ Completa | READMEs por paquete |
| **CI/CD** | 🔄 En progreso | GitHub Actions planeado |
| **Telemetría** | ❌ No recopila | Sin tracking de uso |

## Contribución

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

### Flujo de Trabajo

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrolla** siguiendo las convenciones del código existente
4. **Compila y testea**: 
   ```bash
   yarn workspaces foreach run build
   yarn workspaces foreach run test
   ```
5. **Commit** siguiendo [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(did-registry): añadir soporte para did:key"
   ```
6. **Push** a tu fork y abre un **Pull Request**

## Soporte y Comunidad

| Canal | Uso | Link |
|-------|-----|------|
| 🐛 **GitHub Issues** | Reportar bugs y solicitar features | [Issues](https://github.com/ssi-quarkid/Paquetes-NPMjs/issues) |
| 💭 **GitHub Discussions** | Preguntas, ideas y discusión general | [Discussions](https://github.com/ssi-quarkid/Paquetes-NPMjs/discussions) |

### Documentación Adicional

- 📖 [READMEs por paquete](packages/) - Documentación detallada de cada SDK
- 📝 [CONTRIBUTING_LIBS.md](CONTRIBUTING_LIBS.md) - Guía de contribución
- ⚖️ [LICENSE](LICENSE) - Términos de licencia Apache-2.0

## FAQ y Troubleshooting

<details>
<summary><b>❌ Error: <code>yarn install</code> devuelve 403 o ENOTFOUND</b></summary>

**Causa**: Falta acceso al registry de npm o configuración incorrecta.

**Solución**:
```bash
# Verificar configuración de npm
npm whoami

# Si no estás autenticado
npm login

# Verificar registry
npm config get registry
```
</details>

<details>
<summary><b>❌ Error de compilación en paquetes</b></summary>

**Causa**: Caché corrupta o dependencias desactualizadas.

**Solución**:
```bash
# Limpiar caché de Yarn
yarn cache clean

# Reinstalar dependencias
rm -rf node_modules
yarn install

# Compilar desde cero
yarn workspaces foreach run build
```
</details>

<details>
<summary><b>❌ Tests fallan con errores de import</b></summary>

**Causa**: Paquetes no compilados o dependencias circulares.

**Solución**:
```bash
# Compilar todos los paquetes primero
yarn workspaces foreach run build

# Luego ejecutar tests
yarn workspaces foreach run test
```
</details>

<details>
<summary><b>⚠️ Advertencia: Dependencias nativas en React Native</b></summary>

**Causa**: Algunos paquetes KMS requieren polyfills.

**Solución**:
```bash
# Instalar polyfills necesarios
npm install crypto-browserify buffer
```

Configurar en tu `metro.config.js` o bundler para resolver estos módulos.
</details>

<details>
<summary><b>🔄 ¿Cómo actualizo a la última versión?</b></summary>

```bash
# Actualizar todos los paquetes @quarkid
npm update @quarkid/*

# O actualizar específicos
npm install @quarkid/agent@latest
```
</details>

## Agradecimientos

Este proyecto es posible gracias a:

- **Equipo QuarkID** - Desarrollo y mantenimiento core
- **Comunidad Open Source** - Contribuciones, feedback y testing
- **W3C DID & VC Working Groups** - Especificaciones estándar
- **Decentralized Identity Foundation (DIF)** - Protocolos y mejores prácticas
- **Todos los contribuidores** - Ver [GitHub Contributors](https://github.com/ssi-quarkid/Paquetes-NPMjs/graphs/contributors)

---

<div align="center">

**[⬆ Volver arriba](#quarkid-sdk---monorepo)**

[![GitHub](https://img.shields.io/badge/GitHub-ssi--quarkid-blue?logo=github)](https://github.com/ssi-quarkid)
[![npm](https://img.shields.io/badge/npm-@quarkid-red?logo=npm)](https://www.npmjs.com/org/quarkid)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

</div>