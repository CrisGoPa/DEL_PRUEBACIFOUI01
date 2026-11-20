# PROGRESO — Catálogo de productos tecnológicos

## Estado actual
- **Fase 1** (frontend + localStorage): ✅ completada. Versión guardada en el commit `05dab7b`
- **Fase 2** (backend NestJS en memoria): ✅ completada (20/11/2026). Pendiente: prueba manual en navegador y commit
- **Siguiente:** Fase 3 (MongoDB + Mongoose), pendiente de aprobación para empezar
- **Git/GitHub:** repo https://github.com/CrisGoPa/DEL_PRUEBACIFOUI01 (rama `main`). Último commit subido: `05dab7b Fase 1 completa: CRUD con localStorage`. Cambios de la Fase 2 sin commit

## Plan Fase 1
| # | Paso | Estado | Cómo se comprueba |
|---|---|---|---|
| 1 | `index.html`: formulario + tabla vacía | ✅ | Doble clic en `frontend/index.html` |
| 2 | `styles.css` enlazado | ✅ | Recargar y ver los estilos |
| 3 | `app.js`: leer/guardar localStorage y pintar listado | ✅ | DevTools → Application → Local Storage |
| 4 | Crear producto desde el formulario | ✅ | Añadir, recargar y sigue ahí |
| 5 | Ver detalle (panel `#detalle`) | ✅ | Pulsar "Ver" |
| 6 | Editar (mismo formulario) | ✅ | Cambiar precio, recargar y se mantiene |
| 7 | Borrar con confirmación | ✅ | Borrar, recargar y no vuelve |
| 8 | Repaso final del CRUD | ✅ | Revisión de código (la prueba en navegador no se registró) |

## Plan Fase 2
| # | Paso | Estado | Cómo se comprueba |
|---|---|---|---|
| 1 | Nest CLI vía `npx @nestjs/cli` (sin instalación global) | ✅ | `npx @nestjs/cli --version` → 12.0.15 |
| 2 | Crear proyecto `backend` (`--skip-git --package-manager npm`) + limpieza (ver registro) | ✅ | `GET /` → "Hello World!" |
| 3 | Generar módulo, controlador y servicio `products` (`--no-spec`) | ✅ | Compila (`npm run build`) |
| 4 | Servicio con array en memoria + CRUD; id `randomUUID()` | ✅ | curl |
| 5 | Controlador con los 5 endpoints | ✅ | curl (19 pruebas OK) |
| 6 | Validación con DTOs (`class-validator`) + `ValidationPipe` | ✅ | Datos malos → 400 con mensaje |
| 7 | CORS en `main.ts` (`app.enableCors()`) | ✅ | Cabecera `Access-Control-Allow-Origin: *` + preflight PATCH OK |
| 8 | Frontend: localStorage → `fetch` contra la API | ✅ | `llamarApi` del frontend ejecutada contra el servidor (11 pruebas OK) |
| 9 | Repaso final | ✅ | Tests (`npm test`) y lint OK; falta prueba manual en navegador |

## Registro de sesiones
### 19/11/2026
- Propuesta del plan de la Fase 1 (8 pasos) y decisiones (ver tabla).
- Pasos 1, 2 y 3 hechos. Paso 4 propuesto, pero no llegó a aprobarse.

### 20/11/2026 — Git y GitHub
- Revisión del estado real: la Fase 1 estaba a medias (3 de 8).
- Instaladas las Command Line Tools de Apple → Git 2.39.5.
- Git configurado: nombre `Cristina`, email `cpgonell@gmail.com`, credenciales en el Llavero (`osxkeychain`).
- CLAUDE.md actualizado: reglas de Git/GitHub y referencia a este archivo.
- Creado este `PROGRESO.md`, `.gitignore` y `git init -b main`.
- Commit `489069c Fase1` + remoto `origin` + token fine-grained `actividad01-mac` en el Llavero + primer push.
- Nota: el token se pegó en el chat; Cristina decidió no regenerarlo (entorno de clase).

### 20/11/2026 — Fase 1 (pasos 4–8)
- Paso 4: envío del formulario (validación, crear, guardar, repintar) y botón Cancelar.
- Paso 5: `mostrarDetalle(id)` en `#detalle` (con Cerrar) + un único escuchador de clics en la tabla.
- Paso 6: `idEditando`, `empezarEdicion(id)`, `salirDeEdicion()`; el submit crea o sustituye.
- Paso 7: `borrarProducto(id)` con `confirm()` y `filter`.
- Paso 8: revisión completa de `app.js` sin errores; limpiados 3 comentarios desfasados. Prueba automática con `jsdom` bloqueada (no se permite instalar paquetes de prueba).
- Commit `05dab7b Fase 1 completa: CRUD con localStorage` → push hecho.

### 20/11/2026 — Fase 2
- Paso 1: Nest CLI 12.0.15 vía `npx`.
- Paso 2: `nest new backend --skip-git`. NestJS 12: ESM (imports terminan en `.js`), Vitest, oxlint. El generador añadió cosas no pedidas; Cristina aprobó:
  - Quitar `@nestjs/observe` (servicio externo de monitorización) de `package.json`, `app.module.ts` y `main.ts`. Nunca se ejecutó `observe link`.
  - Añadir al `.gitignore` de la raíz `node_modules/`, `dist/` (el generador no creó `.gitignore`) y luego `*.tsbuildinfo`.
  - Borrar `AGENTS.md`, `.agents/` y `.claude/` de `backend`.
- Paso 3: `nest g module/controller/service products --no-spec` + `npm install class-validator class-transformer`.
- Pasos 4–7: archivos en `backend/src/products/`:
  - `dto/create-product.dto.ts`, `dto/update-product.dto.ts`: reglas de validación.
  - `products.service.ts`: array en memoria, `findAll/findOne/create/update/remove`; 404 si el id no existe.
  - `products.controller.ts`: los 5 endpoints; DELETE responde 204.
  - `main.ts`: `enableCors()` + `ValidationPipe({ whitelist, forbidNonWhitelisted })`.
- Pruebas de la API con curl (19): CRUD, defaults, 6 errores de validación, 404, CORS y preflight → todas OK.
- Paso 8: `frontend/app.js` reescrito con `fetch`:
  - Función `llamarApi(ruta, opciones)`: añade cabecera JSON, lanza `Error` con el mensaje del servidor, 204 → `null`.
  - Ver/Editar/Borrar piden el producto con `GET /products/:id`.
  - Si el servidor está apagado, la tabla muestra "No se puede conectar con el servidor. ¿Está arrancado?".
  - Errores de validación del servidor se muestran con `alert()`.
- Paso 9: prueba del frontend ejecutando su `llamarApi` real contra el servidor (11 comprobaciones OK, incluida la del servidor apagado); `npm test` y `npm run lint` OK. `jsdom` volvió a bloquearse, así que la interfaz (DOM) no se probó de forma automática.

## Decisiones
| Fecha | Decisión | Motivo |
|---|---|---|
| 19/11 | Abrir `index.html` con doble clic (`file://`) | Sin instalar nada |
| 19/11 | Detalle en un panel bajo la tabla | Más claro que `alert()`, más simple que un modal |
| 19/11 | ID con `Date.now().toString()` (solo Fase 1) | Simple; en la Fase 2 lo da el servidor |
| 19/11 | Validación HTML (`required`, `min`) + JS: nombre y marca no solo espacios | Suficiente y fácil |
| 19/11 | `<select>` de categoría con "otro" por defecto | Nunca vacío |
| 19/11 | Stock opcional; vacío = 0 | Según el modelo |
| 19/11 | Interfaz y código en español | Coincide con el modelo |
| 19/11 | Lista vacía al empezar | Sin datos de ejemplo |
| 19/11 | Comentarios breves por bloque | Legibilidad |
| 19/11 | Un único formulario para crear y editar | Menos código |
| 19/11 | Pintar celdas con `textContent` | Evita inyectar HTML |
| 20/11 | Usar Git + GitHub (antes: "sin git") | Petición de Cristina |
| 20/11 | Git vía Command Line Tools de Apple | No hay Homebrew; es lo más directo |
| 20/11 | Rama `main` | Coincide con GitHub |
| 20/11 | Sin línea de coautoría en los commits | Elección de Cristina |
| 20/11 | Commit y push solo cuando Cristina lo pida | Control del proceso |
| 20/11 | Autenticación HTTPS + token fine-grained en el Llavero | Sin instalar nada más |
| 20/11 | Mantener el token aunque se pegó en el chat | Elección de Cristina: entorno de clase |
| 20/11 | `PROGRESO.md` como registro de contexto | No perder contexto entre sesiones |
| 20/11 | Botones de la tabla con un solo escuchador en `<tbody>` | La tabla se repinta entera |
| 20/11 | Modo edición con `idEditando` (null = crear) | Un solo formulario y un solo submit |
| 20/11 | Confirmación de borrado con `confirm()` nativo | Lo más simple |
| 20/11 | Nest CLI con `npx` (sin instalación global) | Sin sudo ni instalaciones globales |
| 20/11 | Quitar `@nestjs/observe` y archivos de agentes de IA del backend | Proyecto local de aprendizaje; menos ruido |
| 20/11 | Validación con `class-validator` + `ValidationPipe` | Lo estándar en Nest |
| 20/11 | `UpdateProductDto` escrito a mano (no `PartialType`) | Evita instalar `@nestjs/mapped-types`; más explícito |
| 20/11 | Rechazar campos desconocidos (`forbidNonWhitelisted`) | Errores claros |
| 20/11 | id de texto con `crypto.randomUUID()` | En Fase 3 Mongo también usa ids de texto |
| 20/11 | Categoría opcional en la API (por defecto "otro"); stock entero ≥ 0 | Coincide con el frontend |
| 20/11 | DELETE responde 204 sin contenido | Convención REST |
| 20/11 | Ver/Editar/Borrar consultan `GET /products/:id` | Usa el endpoint y siempre muestra datos actuales |
| 20/11 | Se mantiene el ejemplo `AppController` ("Hello World!") | Sirve para comprobar que el servidor está vivo |
| 20/11 | Puerto 3000; frontend con doble clic (`file://`) | Por defecto; con CORS abierto funciona |

## Pendientes / notas
- **Probar la Fase 2 en el navegador** (ver "Cómo probar").
- **Commit de la Fase 2** cuando Cristina lo pida (`.gitignore`, `PROGRESO.md`, `frontend/app.js`, `backend/`).
- Los datos de la Fase 2 se pierden al reiniciar el servidor (es lo esperado: array en memoria). Los productos guardados en localStorage en la Fase 1 ya no se usan.
- Fase 3: hará falta Homebrew + MongoDB (guiar la instalación) y `@nestjs/mongoose`. Mongo usa `_id`: habrá que devolver `id` para que el frontend no cambie.
- Las pruebas automáticas de interfaz con `jsdom` se bloquean; para probar sin navegador se usa Node + curl.
- Python no está disponible en el sistema; para scripts se usa Node.
- Nunca pegar el token de GitHub en el chat. Al caducar, crear uno nuevo y guardarlo en el Llavero.

## Cómo probar
### Fase 2 (actual)
1. Arrancar el backend: `cd backend` → `npm run start:dev` (se queda escuchando en http://localhost:3000; se para con Ctrl+C).
2. Comprobar la API: abrir http://localhost:3000/products → `[]`.
3. Abrir `frontend/index.html` con doble clic.
4. Checklist:
   - Crear 2–3 productos (uno sin stock ni descripción) → aparecen en la tabla.
   - Recargar la página → siguen (vienen del servidor).
   - Ver / Editar / Editar + Cancelar / Borrar (Cancelar y Aceptar) → igual que en la Fase 1.
   - Parar el servidor (Ctrl+C) y recargar → "No se puede conectar con el servidor".
   - Volver a arrancarlo → lista vacía (datos en memoria).
- Probar la API a mano: `curl localhost:3000/products`, o en el navegador.
