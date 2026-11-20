# Guía de despliegue en Render (con GitHub Actions)

## Cómo queda montado

```
 git push ──► GitHub ──► GitHub Actions ──(si las pruebas pasan)──► Deploy Hook ──► Render
                          lint · build · tests                                        │
                                                                                      ▼
 Navegador ──► https://catalogo-productos.onrender.com ──► Nest (web + API) ──► MongoDB Atlas
```

| Pieza | Dónde | Plan |
|---|---|---|
| Web (`/frontend`) + API (`/backend`) | **Render**, un único Web Service: Nest sirve la web en `/` y la API en `/products` | Free |
| Base de datos | **MongoDB Atlas** (Render no ofrece MongoDB gratis) | M0 Free |
| Pruebas y despliegue | **GitHub Actions** (`.github/workflows/deploy.yml`) | Gratis |

## Archivos del despliegue

| Archivo | Para qué |
|---|---|
| `render.yaml` | Blueprint: describe el servicio (carpeta, comandos, Node 22, variables). Render lo lee al crear el servicio |
| `.github/workflows/deploy.yml` | En cada push a `main`: lint → build → tests → si todo va bien, llama al Deploy Hook de Render |
| `backend/src/main.ts` | Sirve la carpeta `frontend` y usa el puerto de la variable `PORT` |
| `backend/src/app.module.ts` | Lee la base de datos de la variable `MONGODB_URI` |
| `frontend/app.js` | Con doble clic usa `http://localhost:3000`; servido por Nest usa `/products` |

---

## Paso 0 — Dar permiso de *workflows* al token de GitHub

GitHub **no deja subir** archivos de `.github/workflows/` con un token sin ese permiso.

1. https://github.com/settings/personal-access-tokens → token `actividad01-mac` → **Edit**.
2. *Repository permissions* → **Workflows** → **Read and write** → **Update**.

## Paso 1 — Crear la base de datos en MongoDB Atlas

1. Entra en https://www.mongodb.com/cloud/atlas/register (puedes entrar con Google o GitHub).
2. **Create cluster** → elige **M0 (Free)** → proveedor **AWS**, región **Frankfurt (eu-central-1)** → **Create Deployment**.
3. **Usuario de la base de datos** (te lo pide al crear el cluster, o en *Database Access*):
   - Usuario: `catalogo`
   - Contraseña: pulsa **Autogenerate** y **cópiala** (sin símbolos raros es más fácil).
4. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`) → Confirm.
   (Render free no tiene una IP fija, por eso hay que abrirlo a todas.)
5. **Database** → **Connect** → **Drivers** → copia la cadena. Será parecida a:
   ```
   mongodb+srv://catalogo:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Prepárala así (guárdala en una nota privada, **no en el código ni en el chat**):
   - Cambia `<db_password>` por la contraseña.
   - Añade el nombre de la base de datos `catalogo` justo después de `.net/`:
   ```
   mongodb+srv://catalogo:TU_CONTRASEÑA@cluster0.abcde.mongodb.net/catalogo?retryWrites=true&w=majority&appName=Cluster0
   ```

## Paso 2 — Subir el código a GitHub

Commit y push de los archivos de despliegue (lo hace Claude cuando se le pida).
El primer push lanzará GitHub Actions: el job **Compilar y probar** debería salir ✅ y el de **Desplegar** ❌ (todavía no existe el Deploy Hook). Es normal.

## Paso 3 — Crear el servicio en Render (Blueprint)

1. https://dashboard.render.com → **New** → **Blueprint**.
2. Conecta GitHub si te lo pide y elige el repo **CrisGoPa/DEL_PRUEBACIFOUI01**.
3. Render detecta `render.yaml` y muestra el servicio **catalogo-productos** (Free).
4. Te pedirá el valor de **MONGODB_URI** → pega la cadena del paso 1.6.
5. **Apply** / **Deploy Blueprint**. Render hace el primer despliegue (3–5 min).
6. Cuando ponga **Live**, abre la URL del servicio (arriba, tipo `https://catalogo-productos.onrender.com`; puede llevar un sufijo).

## Paso 4 — Conectar GitHub Actions con Render (Deploy Hook)

1. En Render: servicio **catalogo-productos** → **Settings** → **Deploy Hook** → copia la URL
   (`https://api.render.com/deploy/srv-...?key=...`). Es secreta: quien la tenga puede desplegar.
2. En GitHub: repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Secret: la URL copiada → **Add secret**.
3. Pruébalo: repo → **Actions** → **CI y despliegue en Render** → **Run workflow**.
   Los dos jobs deben salir ✅ y en Render aparecerá un despliegue nuevo en **Events**.

## Paso 5 — Comprobar

| Comprobación | Resultado esperado |
|---|---|
| Abrir la URL de Render | La web del catálogo (la primera vez puede tardar ~50 s si estaba dormido) |
| `URL/products` | `[]` (JSON) |
| Crear, ver, editar, borrar y buscar en la web | Funciona igual que en local |
| Atlas → **Browse Collections** → `catalogo` → `products` | Los productos creados desde la web |
| Compass → nueva conexión con la cadena de Atlas | También se ven los datos de producción |

---

## Día a día

```
editar código → commit + push a main → Actions prueba → Render despliega (2–4 min)
```
- Si las pruebas fallan, **no se despliega** (la versión publicada sigue siendo la anterior).
- En local todo sigue igual: `npm run db` + `npm run start:dev`, y la web en http://localhost:3000 o con doble clic.
- Local y producción usan bases de datos distintas (MongoDB local vs Atlas).

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `refusing to allow a Personal Access Token to create or update workflow` al hacer push | Token sin permiso Workflows | Paso 0 |
| Job **Desplegar** falla con "Falta el secreto RENDER_DEPLOY_HOOK_URL" | No está el secreto | Paso 4 |
| Render: `MongooseServerSelectionError` / no conecta | IP no permitida o cadena mal | Atlas → Network Access `0.0.0.0/0`; revisar usuario, contraseña y `/catalogo` en `MONGODB_URI` (Render → Environment) |
| Render: `bad auth : authentication failed` | Contraseña incorrecta o con símbolos sin codificar | Generar una contraseña sin símbolos en Atlas y actualizar `MONGODB_URI` |
| La web tarda ~50 s en cargar | El plan free duerme el servicio tras 15 min sin visitas | Normal en free |
| La web carga pero dice "No se puede conectar con el servidor" | La API falla al arrancar | Render → **Logs** |

## Límites del plan gratuito

| Servicio | Límite |
|---|---|
| Render Free | Se duerme tras 15 min sin tráfico; 750 h/mes; 512 MB RAM |
| MongoDB Atlas M0 | 512 MB de almacenamiento; un cluster gratis por proyecto |
| GitHub Actions | Gratis en repos públicos |
