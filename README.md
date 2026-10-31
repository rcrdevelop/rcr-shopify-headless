# rcr-shopify-headless

Shopify Headless Store — demo del proyecto **03-shopify-headless-store.md**.

- **Demo**: https://shop.rcrdevelop.com
- **Plan de acción**: [docs/PLAN_ACCION.md](docs/PLAN_ACCION.md)

## Stack

- Quasar v2 (Vue 3, `<script setup>`, Composition API)
- Vite via `@quasar/app-vite`, TypeScript estricto
- Pinia + Vue Router (hash mode, filename-based routing)
- Firebase (Hosting + Firestore + Storage)
- Lint/format: `oxfmt` + `oxlint`

## Comandos

```bash
pnpm install        # instalar dependencias
pnpm dev            # servidor de desarrollo (modo mock sin .env)
pnpm build          # build de producción -> dist/spa
pnpm lint:check     # verificar formato y lint
pnpm lint           # auto-fix formato y lint
pnpm typecheck      # vue-tsc --noEmit
pnpm emulate        # build + Firebase Emulator Suite (hosting :5000, UI :4100)
pnpm emulators      # solo emuladores (sirve el último build de dist/spa)
pnpm deploy         # build + firebase deploy (producción)
pnpm deploy:preview # build + firebase hosting preview channel
```

## Modos de ejecución

La app tiene **3 modos** que se eligen automáticamente según el entorno:

| Modo               | Cómo se activa                         | Backend                                                                                                                                                                                                                                      |
| ------------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mock** (default) | `pnpm dev` o build **sin** `.env`      | Catálogo local + `localStorage`. Firebase no se inicializa.                                                                                                                                                                                  |
| **Emulador**       | `pnpm emulate` → http://localhost:5000 | Auto-detectado al servirse desde el Hosting emulator (`localhost:5000`). Usa credenciales demo `demo-rcr-shop` y conecta con los emuladores Auth (:9098) y Firestore (:8081). También se puede forzar con `QCLI_USE_FIREBASE_EMULATOR=true`. |
| **Producción**     | build **con** `.env` + `pnpm deploy`   | Firebase real con las credenciales `QCLI_FIREBASE_*`.                                                                                                                                                                                        |

> **Nota:** Quasar solo expone al cliente variables con prefijo `QCLI_`
> (no `VITE_*`). Todas las variables de `.env.example` usan ese prefijo.

Los puertos de los emuladores están en `firebase.json` → `emulators`
(puertos no estándar para no chocar con otras suites: auth 9098,
firestore 8081, storage 9198, hosting 5000, UI 4100). Si los cambias,
ajusta también `QCLI_EMULATOR_*` en `.env`.

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com) (un proyecto por app).
2. Edita `.firebaserc` y reemplaza `<project-id>` por el ID del proyecto.
3. Copia `.env.example` a `.env` y rellena las credenciales web del proyecto (`QCLI_FIREBASE_*`).
4. Opcional: `firebase use <project-id>` para fijar el proyecto activo.
5. Despliega con `pnpm deploy` (requiere `firebase login` previo).

Las reglas de `firestore.rules` y `storage.rules` son deny-all por defecto; ajústalas según el plan.

## Estructura

- `src/pages/` — rutas (filename-based routing)
- `src/boot/firebase.ts` — inicialización de Firebase (se omite si no hay credenciales)
- `src/css/quasar.variables.scss` — paleta de marca
- `docs/PLAN_ACCION.md` — plan de acción del proyecto
