# PROGRESO — Catálogo de productos tecnológicos

## Estado actual
- **Fase:** 1 (frontend + localStorage) ✅ **completada** (20/11/2026)
- **Último paso hecho:** Fase 1 · paso 8 (cierre de fase)
- **Siguiente:** Fase 2 · paso 1 (instalar/usar Nest CLI). Plan propuesto abajo, pendiente de respuestas de Cristina

## Plan Fase 2 (propuesto, pendiente de aprobación)
| # | Paso | Estado | Cómo se comprueba |
|---|---|---|---|
| 1 | Nest CLI vía `npx @nestjs/cli` (sin instalación global ni sudo) | ⏳ | `npx @nestjs/cli --version` |
| 2 | Crear proyecto: `npx @nestjs/cli new backend --skip-git --package-manager npm` (`--skip-git` porque el repo ya está en la raíz) | ⏳ | `npm run start:dev` → http://localhost:3000 muestra "Hello World!" |
| 3 | Generar módulo, controlador y servicio `products` (sin tests: `--no-spec`) | ⏳ | El servidor arranca sin errores |
| 4 | Servicio con array en memoria + CRUD; id generado por el servidor | ⏳ | — |
| 5 | Controlador con los 5 endpoints del CLAUDE.md | ⏳ | `curl` a cada endpoint |
| 6 | Validación de datos en el servidor (precio ≥ 0, obligatorios, categoría válida) | ⏳ | POST con datos malos → error 400 |
| 7 | CORS en `main.ts` (`app.enableCors()`) | ⏳ | El frontend puede llamar a la API |
| 8 | Frontend: cambiar localStorage por `fetch` contra `http://localhost:3000/products` | ⏳ | CRUD en el navegador; los datos viven en el servidor |
| 9 | Repaso final Fase 2 | ⏳ | Checklist |

### Preguntas abiertas Fase 2
1. Nest CLI: ¿`npx` (recomendado, no instala nada global) o `npm install -g @nestjs/cli`?
2. Validación en el servidor: ¿`class-validator` + `ValidationPipe` (lo estándar en Nest, 2 paquetes más) o comprobaciones a mano en el servicio?
3. id: ¿texto con `crypto.randomUUID()` (recomendado: en Fase 3 Mongo también usa ids de texto) o número incremental?
4. Puerto: ¿3000 (por defecto)?
5. Frontend: ¿seguimos abriéndolo con doble clic (`file://`)? Con CORS abierto funciona.
- **Git/GitHub:** configurado. Repo https://github.com/CrisGoPa/DEL_PRUEBACIFOUI01 (rama `main`). Último commit subido: `489069c Fase1`

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
| 8 | Repaso final del CRUD | ✅ | Lista de comprobación |

## Registro de sesiones
### 19/11/2026
- Propuesta del plan de la Fase 1 (8 pasos) y decisiones (ver tabla).
- Pasos 1, 2 y 3 hechos.
- Paso 4 propuesto, pero no llegó a aprobarse.

### 20/11/2026
- Revisión del estado real: la Fase 1 está a medias (3 de 8).
- Instaladas las Command Line Tools de Apple → Git 2.39.5.
- Git configurado: nombre `Cristina`, email `cpgonell@gmail.com`, credenciales en el Llavero (`osxkeychain`).
- CLAUDE.md actualizado: reglas de Git/GitHub y referencia a este archivo.
- Creado este `PROGRESO.md`.
- Creado `.gitignore` (`.DS_Store`) y `git init -b main`.
- Comprobado que el repo de GitHub estaba vacío.
- Commit `489069c Fase1` (6 archivos: `.gitignore`, `CLAUDE.md`, `PROGRESO.md`, `frontend/*`).
- Remoto `origin` añadido; token fine-grained `actividad01-mac` guardado en el Llavero.
- Primer push a `origin/main` hecho.
- Nota: el token se pegó en el chat; Cristina decidió no regenerarlo (entorno de clase).
- Fase 1 · paso 4 hecho: `app.js` con el envío del formulario (validación, crear producto, guardar en localStorage, repintar) y botón Cancelar (`form.reset()`).
- Fase 1 · paso 5 hecho: `mostrarDetalle(id)` rellena `#detalle` (con botón Cerrar) y un único escuchador de clics en la tabla (delegación de eventos).
- Fase 1 · paso 6 hecho: variable `idEditando`, funciones `empezarEdicion(id)` y `salirDeEdicion()`; el submit crea o sustituye según `idEditando`; Cancelar sale del modo edición.
- Fase 1 · paso 7 hecho: `borrarProducto(id)` con `confirm()`, `filter` para quitarlo; sale de edición y cierra el detalle si afectaba a ese producto.
- Fase 1 · paso 8 (durante la pausa, a petición de Cristina: "asegúrate de que esté cerrada"):
  - Revisión completa de `app.js`: flujos crear/ver/editar/cancelar/borrar coherentes, sin errores encontrados. Sintaxis OK (`node --check`).
  - Limpiados los 3 comentarios desfasados (`index.html` y `app.js`); ya no hay referencias a "paso N".
  - Intento de prueba automática con `jsdom`: **bloqueado** (no se permite instalar paquetes sin Cristina presente).
  - Pendiente: pasar la checklist de pruebas en el navegador (ver abajo).
  - **Fase 1 completada** (código cerrado; falta solo la prueba manual).
- Fase 2: no se ha empezado. Plan y preguntas preparados (ver "Plan Fase 2").

## Decisiones
| Fecha | Decisión | Motivo |
|---|---|---|
| 19/11 | Abrir `index.html` con doble clic (`file://`) | Sin instalar nada |
| 19/11 | Detalle en un panel bajo la tabla | Más claro que `alert()`, más simple que un modal |
| 19/11 | ID con `Date.now().toString()` | Simple; en la Fase 2 lo dará el servidor |
| 19/11 | Validación HTML (`required`, `min`) + JS: nombre y marca no solo espacios | Suficiente y fácil |
| 19/11 | `<select>` de categoría con "otro" por defecto | Nunca vacío |
| 19/11 | Stock opcional; vacío = 0 | Según el modelo |
| 19/11 | Interfaz y código en español | Coincide con el modelo |
| 19/11 | Lista vacía al empezar | Sin datos de ejemplo |
| 19/11 | Comentarios breves por bloque | Legibilidad |
| 19/11 | Un único formulario para crear y editar | Menos código |
| 19/11 | Clave de localStorage: `productos` | — |
| 19/11 | Pintar celdas con `textContent` | Evita inyectar HTML |
| 20/11 | Usar Git + GitHub (antes: "sin git") | Petición de Cristina |
| 20/11 | Git vía Command Line Tools de Apple | No hay Homebrew; es lo más directo |
| 20/11 | Rama `main` | Coincide con GitHub |
| 20/11 | Primer commit con el título `Fase1` (aunque la fase está a medias) | Elección de Cristina |
| 20/11 | Sin línea de coautoría en los commits | Elección de Cristina |
| 20/11 | Commit y push solo cuando Cristina lo pida | Control del proceso |
| 20/11 | Autenticación HTTPS + token fine-grained en el Llavero | Sin instalar nada más |
| 20/11 | `PROGRESO.md` como registro de contexto | No perder contexto entre sesiones |
| 20/11 | Mantener el token aunque se pegó en el chat | Elección de Cristina: entorno de clase |
| 20/11 | Botones de la tabla con un solo escuchador en `<tbody>` (delegación) | La tabla se repinta entera; no hay que reasignar eventos |
| 20/11 | Panel de detalle con botón Cerrar; se oculta al vaciarse (`#detalle:empty`) | Simple, sin modal |
| 20/11 | Modo edición con `idEditando` (null = crear); el botón cambia a "Guardar cambios" | Un solo formulario y un solo submit |
| 20/11 | Al guardar se cierra el panel de detalle | Evita mostrar datos antiguos |
| 20/11 | Confirmación de borrado con `confirm()` nativo | Lo más simple |
| 20/11 | Cerrar la Fase 1; luego, en la pausa, se limpiaron los comentarios desfasados | Petición de Cristina: "asegúrate de que esté cerrada" |

## Pendientes / notas
- Pasar la checklist de pruebas de la Fase 1 en el navegador:
  1. Consola: `localStorage.removeItem('productos')` + recargar → "No hay productos"
  2. Crear 3 productos (uno sin stock ni descripción) → recargar → siguen
  3. Ver cada uno (sin descripción → "—")
  4. Editar (precio y categoría) → no se duplica; Editar + Cancelar → no cambia
  5. Borrar con Cancelar → sigue; con Aceptar → desaparece
  6. Nombre solo espacios → aviso; precio negativo → bloqueado
- Instalar paquetes (jsdom, Nest CLI…) requiere que Cristina esté presente y lo apruebe.
- Python no está disponible en el sistema; para scripts se usa Node.
- Nunca pegar el token de GitHub en el chat.
- El token caduca según la fecha elegida al crearlo; al caducar, crear uno nuevo y volver a guardarlo en el Llavero.
- Cambios sin commit: `PROGRESO.md` y `frontend/app.js` (pasos 4 a 8), `frontend/index.html` (comentario) → no subidos a GitHub.

## Cómo probar
- Frontend: doble clic en `frontend/index.html`.
- Ver datos: DevTools → Application → Local Storage → `productos`.
- Vaciar datos: en la consola, `localStorage.removeItem('productos')`.
