// Dirección de la API (backend NestJS)
const API = 'http://localhost:3000/products';

// Referencias a elementos del HTML
const lista = document.getElementById('lista-productos');
const form = document.getElementById('form-producto');
const detalle = document.getElementById('detalle');
const botonGuardar = form.querySelector('button[type="submit"]');
const buscador = document.getElementById('buscar');
const filtroCategoria = document.getElementById('filtro-categoria');

// Número de la última petición del listado (para ignorar respuestas antiguas al escribir rápido)
let ultimaPeticion = 0;

// id del producto que se está editando (null = estamos creando)
let idEditando = null;

// Llama a la API y devuelve el JSON de la respuesta.
// Si el servidor responde con error, lanza un Error con su mensaje.
async function llamarApi(ruta = '', opciones = {}) {
  const respuesta = await fetch(API + ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({})); // por si no viene JSON
    // Nest devuelve "message" como texto o como lista de textos
    const mensaje = [].concat(error.message || respuesta.statusText).join('\n');
    throw new Error(mensaje);
  }

  // 204 = sin contenido (DELETE): no hay JSON que leer
  return respuesta.status === 204 ? null : respuesta.json();
}

// Pinta la tabla con los productos del servidor (aplicando la búsqueda y el filtro)
async function pintarLista() {
  // Filtros como parámetros de la URL: ?buscar=...&categoria=...
  const parametros = new URLSearchParams();
  const texto = buscador.value.trim();
  if (texto) parametros.set('buscar', texto);
  if (filtroCategoria.value) parametros.set('categoria', filtroCategoria.value);
  const consulta = parametros.toString() ? '?' + parametros : '';

  const estaPeticion = ++ultimaPeticion;

  let productos;
  try {
    productos = await llamarApi(consulta); // GET /products?...
  } catch (error) {
    lista.innerHTML = '<tr><td colspan="6">No se puede conectar con el servidor. ¿Está arrancado?</td></tr>';
    return;
  }

  // Si mientras esperábamos se lanzó otra búsqueda, esta respuesta ya no sirve
  if (estaPeticion !== ultimaPeticion) return;

  if (productos.length === 0) {
    const mensaje = consulta ? 'Ningún producto coincide con la búsqueda' : 'No hay productos';
    lista.innerHTML = `<tr><td colspan="6">${mensaje}</td></tr>`;
    return;
  }

  lista.innerHTML = '';
  productos.forEach(p => {
    const fila = document.createElement('tr');

    // Celdas de datos (textContent evita que se interprete HTML escrito por el usuario)
    [p.nombre, p.marca, p.categoria, p.precio.toFixed(2) + ' €', p.stock].forEach(valor => {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    // Celda de acciones (los clics se gestionan en el escuchador de la tabla)
    const acciones = document.createElement('td');
    acciones.innerHTML = `
      <button data-accion="ver" data-id="${p.id}">Ver</button>
      <button data-accion="editar" data-id="${p.id}">Editar</button>
      <button data-accion="borrar" data-id="${p.id}">Borrar</button>`;
    fila.appendChild(acciones);

    lista.appendChild(fila);
  });
}

// Al enviar el formulario: validar, crear o editar el producto en el servidor
form.addEventListener('submit', async evento => {
  evento.preventDefault(); // evita que la página se recargue

  const nombre = document.getElementById('nombre').value.trim();
  const marca = document.getElementById('marca').value.trim();

  // El HTML ya exige rellenarlos; aquí evitamos que sean solo espacios
  if (!nombre || !marca) {
    alert('Nombre y marca no pueden estar vacíos.');
    return;
  }

  const stockTexto = document.getElementById('stock').value;

  const datos = {
    nombre,
    marca,
    categoria: document.getElementById('categoria').value,
    precio: Number(document.getElementById('precio').value),
    stock: stockTexto === '' ? 0 : Number(stockTexto), // vacío = 0
    descripcion: document.getElementById('descripcion').value.trim()
  };

  try {
    if (idEditando) {
      // Editar: PATCH /products/:id
      await llamarApi('/' + idEditando, { method: 'PATCH', body: JSON.stringify(datos) });
    } else {
      // Crear: POST /products (el id lo genera el servidor)
      await llamarApi('', { method: 'POST', body: JSON.stringify(datos) });
    }
  } catch (error) {
    alert('No se pudo guardar:\n' + error.message);
    return;
  }

  detalle.innerHTML = ''; // cierra el detalle por si mostraba datos antiguos
  salirDeEdicion();       // limpia el formulario y vuelve a modo "crear"
  pintarLista();          // actualiza la tabla
});

// Botón Cancelar: limpia el formulario y sale del modo edición
document.getElementById('btn-cancelar').addEventListener('click', salirDeEdicion);

// Muestra los datos de un producto en el panel de detalle
async function mostrarDetalle(id) {
  let p;
  try {
    p = await llamarApi('/' + id); // GET /products/:id
  } catch (error) {
    alert(error.message);
    return;
  }

  detalle.innerHTML = '';

  const titulo = document.createElement('h2');
  titulo.textContent = p.nombre;
  detalle.appendChild(titulo);

  // Una línea por dato (append con texto evita interpretar HTML del usuario)
  [
    ['Marca', p.marca],
    ['Categoría', p.categoria],
    ['Precio', p.precio.toFixed(2) + ' €'],
    ['Stock', p.stock],
    ['Descripción', p.descripcion || '—']
  ].forEach(([etiqueta, valor]) => {
    const linea = document.createElement('p');
    linea.innerHTML = `<strong>${etiqueta}:</strong> `;
    linea.append(valor);
    detalle.appendChild(linea);
  });

  // Botón para cerrar el panel (al vaciarse, el CSS lo oculta)
  const cerrar = document.createElement('button');
  cerrar.textContent = 'Cerrar';
  cerrar.addEventListener('click', () => { detalle.innerHTML = ''; });
  detalle.appendChild(cerrar);
}

// Rellena el formulario con un producto y pasa a modo edición
async function empezarEdicion(id) {
  let p;
  try {
    p = await llamarApi('/' + id); // GET /products/:id
  } catch (error) {
    alert(error.message);
    return;
  }

  document.getElementById('nombre').value = p.nombre;
  document.getElementById('marca').value = p.marca;
  document.getElementById('categoria').value = p.categoria;
  document.getElementById('precio').value = p.precio;
  document.getElementById('stock').value = p.stock;
  document.getElementById('descripcion').value = p.descripcion;

  idEditando = id;
  botonGuardar.textContent = 'Guardar cambios';
  form.scrollIntoView({ behavior: 'smooth' }); // sube hasta el formulario
}

// Limpia el formulario y vuelve a modo "crear"
function salirDeEdicion() {
  form.reset();
  idEditando = null;
  botonGuardar.textContent = 'Guardar';
}

// Borra un producto tras pedir confirmación
async function borrarProducto(id) {
  try {
    const p = await llamarApi('/' + id); // para mostrar el nombre en la pregunta
    if (!confirm(`¿Borrar "${p.nombre}"?`)) return; // si cancela, no hacemos nada

    await llamarApi('/' + id, { method: 'DELETE' }); // DELETE /products/:id
  } catch (error) {
    alert('No se pudo borrar:\n' + error.message);
    return;
  }

  // Si se estaba editando ese producto, salimos del modo edición
  if (idEditando === id) salirDeEdicion();

  detalle.innerHTML = ''; // cierra el detalle por si mostraba el borrado
  pintarLista();
}

// Clics en los botones de la tabla: un solo "escuchador" para todas las filas
lista.addEventListener('click', evento => {
  const boton = evento.target.closest('button');
  if (!boton) return;

  const id = boton.dataset.id;
  if (boton.dataset.accion === 'ver') mostrarDetalle(id);
  if (boton.dataset.accion === 'editar') empezarEdicion(id);
  if (boton.dataset.accion === 'borrar') borrarProducto(id);
});

// Búsqueda y filtro: repintamos la tabla al escribir o al cambiar la categoría
buscador.addEventListener('input', pintarLista);
filtroCategoria.addEventListener('change', pintarLista);

// Botón Limpiar: quita la búsqueda y el filtro
document.getElementById('btn-limpiar').addEventListener('click', () => {
  buscador.value = '';
  filtroCategoria.value = '';
  pintarLista();
});

// Al cargar la página, pintamos el listado
pintarLista();
