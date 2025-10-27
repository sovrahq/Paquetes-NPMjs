# @quarkid/kms-storage-vault

## Descripción

`@quarkid/kms-storage-vault` provee una **implementación de KMSStorage** que utiliza HashiCorp Vault como backend de almacenamiento seguro. Permite almacenar claves criptográficas en Vault, aprovechando sus capacidades de cifrado, control de acceso y auditoría.

Este paquete implementa la interfaz `KMSStorage` de `@quarkid/kms-core` y puede ser usado como storage del `@quarkid/kms-client` en entornos donde se requiere un HSM o almacenamiento seguro centralizado.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **hashi-vault-js** (0.4.11) - Cliente JavaScript para HashiCorp Vault

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-storage-vault
```

### yarn
```bash
yarn add @quarkid/kms-storage-vault
```

### pnpm
```bash
pnpm add @quarkid/kms-storage-vault
```

## API / Exports Principales

| Export | Descripción |
|--------|-------------|
| `VaultStorage` | Implementación de KMSStorage con HashiCorp Vault |

**Métodos (implementa `KMSStorage`):**
- `add(key, data)` - Almacena una clave en Vault
- `get(key)` - Recupera una clave de Vault
- `getAll()` - Obtiene todas las claves
- `update(key, data)` - Actualiza una clave
- `remove(key)` - Elimina una clave de Vault

## Configuración / Variables de Entorno

**Configuración de Vault requerida:**

```typescript
const storage = new VaultStorage({
  vaultUrl: process.env.VAULT_URL,      // e.g., "https://vault.example.com:8200"
  vaultToken: process.env.VAULT_TOKEN,  // Token de autenticación
  vaultPath: "secret/kms"               // Path en Vault
});
```

**Variables de entorno recomendadas:**
- `VAULT_URL` - URL del servidor Vault
- `VAULT_TOKEN` - Token de acceso a Vault
- `VAULT_PATH` - Path base para almacenar claves

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: Backend (Node.js)

⚠️ **Nota**: Requiere acceso a un servidor HashiCorp Vault configurado y accesible.

## Versionado y Publicación

- **Versión actual**: `1.6.3`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/src/index.js` (CommonJS)

## Licencia

**Apache2.0**

⚠️ **Nota**: Verificar si es Apache-2.0 (sin guión) o Apache-2.0 (estándar).

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

