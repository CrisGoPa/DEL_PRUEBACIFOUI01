# PROGRESO — Catálogo de productos tecnológicos

## Estado actual
- **Fase:** 1 (frontend + localStorage), en curso
- **Último paso hecho:** Fase 1 · paso 3 (listado desde localStorage)
- **Siguiente:** Fase 1 · paso 4 (Crear desde el formulario), propuesto, sin aprobar
- **En paralelo:** configuración de Git y GitHub (ver sesión 20/11/2026)

## Plan Fase 1
| # | Paso | Estado | Cómo se comprueba |
|---|---|---|---|
| 1 | `index.html`: formulario + tabla vacía | ✅ | Doble clic en `frontend/index.html` |
| 2 | `styles.css` enlazado | ✅ | Recargar y ver los estilos |
| 3 | `app.js`: leer/guardar localStorage y pintar listado | ✅ | DevTools → Application → Local Storage |
| 4 | Crear producto desde el formulario | ⏸️ | Añadir, recargar y sigue ahí |
| 5 | Ver detalle (panel `#detalle`) | ⏳ | Pulsar "Ver" |
| 6 | Editar (mismo formulario) | ⏳ | Cambiar precio, recargar y se mantiene |
| 7 | Borrar con confirmación | ⏳ | Borrar, recargar y no vuelve |
| 8 | Repaso final del CRUD | ⏳ | Lista de comprobación |

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
- Pendiente: `.gitignore`, `git init -b main`, commit `Fase1`, remoto, token y primer push.

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

## Pendientes / notas
- Retomar la Fase 1 en el paso 4.
- Python no está disponible en el sistema; para scripts se usa Node.
- Nunca pegar el token de GitHub en el chat.

## Cómo probar
- Frontend: doble clic en `frontend/index.html`.
- Ver datos: DevTools → Application → Local Storage → `productos`.
- Vaciar datos: en la consola, `localStorage.removeItem('productos')`.
