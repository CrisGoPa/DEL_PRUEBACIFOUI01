# Proyecto: Catálogo de productos tecnológicos (fullstack mínimo)

## Objetivo
Proyecto de aprendizaje. El foco es entender las piezas de una app fullstack
(frontend, backend, base de datos) y cómo se comunican, no la programación avanzada.
Código simple, legible y sin abstracciones innecesarias.

## Alcance
- Web con un formulario y un listado de productos tecnológicos.
- CRUD completo: crear, listar, ver, editar y borrar.
- Sin autenticación.
- Todo en local (macOS).
- Git + GitHub (repo: https://github.com/CrisGoPa/DEL_PRUEBACIFOUI01, rama main).
  - Commit solo cuando yo lo pida, mostrando antes qué archivos se guardan.
  - Push solo cuando yo lo pida.
  - Autenticación por HTTPS con token guardado en el Llavero de macOS.
    Nunca pedir ni mostrar el token en el chat.

## Stack
- Frontend: HTML, CSS3 y JavaScript vanilla (sin frameworks ni bundlers).
- Backend: NestJS (TypeScript), API REST.
- Base de datos: MongoDB 8.0 en local, descargado en ~/mongodb (sin Homebrew ni permisos de
  administrador; se arranca con `npm run db` en /backend) + Mongoose (@nestjs/mongoose).

## Fases (en este orden, sin adelantar piezas de fases posteriores)
- Fase 1 — Frontend solo: formulario + listado con CRUD. Los datos se guardan en
  localStorage del navegador (persisten al recargar). Sin backend.
- Fase 2 — Añadir backend NestJS: API REST con los datos en un array en memoria del
  servidor. El frontend pasa a usar fetch contra la API (configurar CORS).
- Fase 3 — Añadir MongoDB: sustituir el array del servidor por MongoDB con Mongoose.
  El frontend no debería cambiar.
- Fase 4 — Búsqueda y filtros: buscar por texto (nombre o marca, sin distinguir
  mayúsculas) y filtrar por categoría, en la API (query params) y en el frontend
  (buscador + desplegable encima de la tabla, filtra mientras se escribe).

## Modelo Producto
- nombre (string, obligatorio)
- marca (string, obligatorio)
- categoria (string: portátil, móvil, tablet, accesorio, otro)
- precio (number, obligatorio, >= 0)
- stock (number, >= 0)
- descripcion (string, opcional)
- createdAt / updatedAt (automáticos desde la Fase 3)

## Estructura
/frontend  -> index.html, styles.css, app.js   (Fase 1)
/backend   -> proyecto NestJS, módulo products  (Fase 2)
PROGRESO.md -> registro de pasos, decisiones y estado actual (mantener al día)

## Endpoints (Fase 2 en adelante)
GET /products · GET /products/:id · POST /products · PATCH /products/:id · DELETE /products/:id
Filtros opcionales (Fase 4): GET /products?buscar=texto&categoria=móvil

## Forma de trabajar (OBLIGATORIO)
1. Antes de cualquier acción (instalar, crear archivos, escribir código, ejecutar comandos),
   muestra qué vas a hacer y por qué, y ESPERA mi aprobación explícita.
2. Trabaja en pasos pequeños. Un paso = una cosa. No encadenes pasos sin mi OK.
3. No empieces una fase nueva sin mi aprobación.
4. Pregunta siempre que haya dudas o decisiones. No asumas nada.
5. Tómate el tiempo necesario; prioriza claridad sobre velocidad.
6. Al terminar cada paso, di qué se hizo y cómo comprobarlo.
7. Solo tengo Node instalado: guíame en cada instalación cuando llegue su fase
   (Nest CLI vía npx en Fase 2; MongoDB descargado en ~/mongodb en Fase 3).
8. Respuestas directas y estructuradas (listas, tablas). Sin explicaciones teóricas largas.
