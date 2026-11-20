// Clave con la que guardamos los productos en localStorage
const CLAVE = 'productos';

// Referencias a elementos del HTML
const lista = document.getElementById('lista-productos');
const form = document.getElementById('form-producto');
const detalle = document.getElementById('detalle');
const botonGuardar = form.querySelector('button[type="submit"]');

// id del producto que se está editando (null = estamos creando)
let idEditando = null;

// Lee los productos de localStorage (array vacío si no hay nada)
function leerProductos() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}

// Guarda el array de productos en localStorage
function guardarProductos(productos) {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

// Pinta la tabla con los productos guardados
function pintarLista() {
  const productos = leerProductos();

  if (productos.length === 0) {
    lista.innerHTML = '<tr><td colspan="6">No hay productos</td></tr>';
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

// Al enviar el formulario: validar, crear o editar el producto y guardarlo
form.addEventListener('submit', evento => {
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

  const productos = leerProductos();

  if (idEditando) {
    // Editar: sustituimos el producto conservando su id
    // ({ id, ...datos } = un objeto con el id + todos los campos de "datos")
    const i = productos.findIndex(p => p.id === idEditando);
    productos[i] = { id: idEditando, ...datos };
  } else {
    // Crear: producto nuevo con id propio
    productos.push({ id: Date.now().toString(), ...datos });
  }

  guardarProductos(productos);

  detalle.innerHTML = ''; // cierra el detalle por si mostraba datos antiguos
  salirDeEdicion();       // limpia el formulario y vuelve a modo "crear"
  pintarLista();          // actualiza la tabla
});

// Botón Cancelar: limpia el formulario y sale del modo edición
document.getElementById('btn-cancelar').addEventListener('click', salirDeEdicion);

// Muestra los datos de un producto en el panel de detalle
function mostrarDetalle(id) {
  const p = leerProductos().find(prod => prod.id === id);
  if (!p) return;

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
function empezarEdicion(id) {
  const p = leerProductos().find(prod => prod.id === id);
  if (!p) return;

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
function borrarProducto(id) {
  const productos = leerProductos();
  const p = productos.find(prod => prod.id === id);
  if (!p) return;

  if (!confirm(`¿Borrar "${p.nombre}"?`)) return; // si cancela, no hacemos nada

  // filter crea un array nuevo sin el producto con ese id
  guardarProductos(productos.filter(prod => prod.id !== id));

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

// Al cargar la página, pintamos el listado
pintarLista();
