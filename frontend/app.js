// Clave con la que guardamos los productos en localStorage
const CLAVE = 'productos';

// Referencias a elementos del HTML
const lista = document.getElementById('lista-productos');

// Lee los productos de localStorage (array vacío si no hay nada)
function leerProductos() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}

// Guarda el array de productos en localStorage (se usará desde el paso 4)
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

    // Celda de acciones (los botones funcionarán en los pasos 5, 6 y 7)
    const acciones = document.createElement('td');
    acciones.innerHTML = `
      <button data-accion="ver" data-id="${p.id}">Ver</button>
      <button data-accion="editar" data-id="${p.id}">Editar</button>
      <button data-accion="borrar" data-id="${p.id}">Borrar</button>`;
    fila.appendChild(acciones);

    lista.appendChild(fila);
  });
}

// Al cargar la página, pintamos el listado
pintarLista();
