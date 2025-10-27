# @quarkid/kms-client-mobile

## Descripción

`@quarkid/kms-client-mobile` es una **versión optimizada del KMS Client** para entornos móviles (React Native, Capacitor, Expo). Provee las mismas capacidades de gestión de claves que `@quarkid/kms-client` pero con un subset de suites criptográficas optimizadas para dispositivos móviles.

Soporta ES256k, DIDComm y BBS+ pero excluye algunas suites que requieren dependencias nativas pesadas o incompatibles con mobile.

## Tecnologías y Dependencias Clave

- **TypeScript** (^4.5.4)
- **@quarkid/kms-core** (^1.4.0-4) - Core KMS
- **@quarkid/kms-suite-bbsbls2020** (^1.2.0-2) - Suite BBS+
- **@quarkid/kms-suite-didcomm** (^1.1.2) - Suite DIDComm v1
- **@quarkid/kms-suite-es256k** (^1.2.4) - Suite ECDSA secp256k1
- **@quarkid/vc-core** (1.1.0-2) - Modelos de VCs

### DevDependencies
- **Jest** (^28.0.3) / **ts-jest** (^28.0.1) - Testing

## Instalación

### npm
```bash
npm install @quarkid/kms-client-mobile
```

### yarn
```bash
yarn add @quarkid/kms-client-mobile
```

### pnpm
```bash
pnpm add @quarkid/kms-client-mobile
```

⚠️ **Nota**: Diseñado para React Native y entornos móviles. Puede requerir polyfills de Node.js.

## API / Exports Principales

La API es similar a `@quarkid/kms-client` pero optimizada para mobile:

| Export | Descripción |
|--------|-------------|
| `KMSClientMobile` | Cliente KMS para entornos móviles |

**Diferencias con `@quarkid/kms-client`:**
- No incluye suite `DIDCommV2` (requiere dependencias pesadas)
- No incluye suite `RSA` (no común en mobile SSI)
- Optimizado para tamaño de bundle

## Configuración / Variables de Entorno

Configuración similar a `@quarkid/kms-client`:

```typescript
const kms = new KMSClientMobile({
  lang: LANG.es,
  storage: secureStorageInstance,  // Usar AsyncStorage o SecureStore
  didResolver: (did) => resolver.resolve(did),
  mobile: true
});
```

## Compatibilidad

- **Node.js**: >= 14.x (inferido de `@types/node": "^14.17.6"`)
- **TypeScript**: >= 4.5.4
- **Entornos**: React Native, Expo, Capacitor, Ionic

⚠️ **Nota**: Requiere polyfills para crypto y buffer en React Native.

## Versionado y Publicación

- **Versión actual**: `1.0.2`
- **Build previo**: Ejecutar `npm run build` antes de publicar
- **Estructura de salida**: `dist/src/index.js` (CommonJS)

## Licencia

**ISC**

⚠️ **Nota**: Licencia diferente al resto del monorepo. Por confirmar si debe ser Apache-2.0.

---

**Mantenido por**: QuarkID Team  
**Repositorio**: https://github.com/ssi-quarkid/Paquetes-NPMjs/tree/main

