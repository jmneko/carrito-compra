document.addEventListener("DOMContentLoaded", () => {
  const carritoLista = document.getElementById("carrito-lista");

  fetch("https://jsonblob.com/api/jsonBlob/1121184302548402176")
    .then((response) => response.json())
    .then((data) => {
      const productos = data.products;

      productos.forEach((producto, indice) => {
        const row = document.createElement("tr");
        row.id = `producto-${indice}`;
        row.innerHTML = `
          <td class="producto__nombre">
            <p class="producto__nombre-modificador">${producto.title}</p>
            <p>ref:${producto.sku}</p>
          </td>
          <td class="producto__cantidad">
            <button onclick="restarCantidad(this)">-</button>
            <input type="number" value="0" min="0" onchange="actualizarCantidad(this)">
            <button onclick="sumarCantidad(this)">+</button>
          </td>
          <td class="producto__unidad">${producto.price} ${data.currency}</td>
          <td class="producto__total">0 ${data.currency}</td>
        `;
        carritoLista.appendChild(row);
      });
    });
});

const actualizarCantidad = (input) => {
  const cantidad = parseInt(input.value);
  const precioUnidad = parseFloat(
    input.parentNode.nextElementSibling.textContent
  );
  const precioTotal = cantidad * precioUnidad;
  input.parentNode.nextElementSibling.nextElementSibling.textContent = `${precioTotal.toFixed(
    2
  )} €`;

  const nombreProducto = input.parentNode.parentNode.querySelector(
    ".producto__nombre-modificador"
  ).textContent;

  const filaTablaUno = document.querySelector(
    `#producto-${obtenerIndiceProducto(input)}`
  );
  const filaTablaDos = document.querySelector(
    `.producto-seleccionado-fila[data-producto="${nombreProducto}"]`
  );

  if (filaTablaDos) {
    const totalTablaUno = parseFloat(
      filaTablaUno.querySelector(".producto__total").textContent
    );
    filaTablaDos.hidden = precioTotal === 0;
  }

  agregarProductoSeleccionado(nombreProducto, precioUnidad, cantidad);
  calcularTotalTablaDos();

  if (cantidad === 0) {
    const nombreProducto = input.parentNode.parentNode.querySelector(
      ".producto__nombre-modificador"
    ).textContent;
    const filaTablaDos = document.querySelector(
      `.producto-seleccionado-fila[data-producto="${nombreProducto}"]`
    );
    if (filaTablaDos) {
      filaTablaDos.remove();
      calcularTotalTablaDos();
    }
  }

  const totalTablaDos = parseFloat(
    document.getElementById("final__total").querySelector("#total-resultado")
      .textContent
  );
  if (precioTotal > 999999) {
    window.alert("¡¡¡¡JODER, NI LAS APPLE VISION PRO!!!!");
  }
};

const obtenerIndiceProducto = (input) => {
  const filaProducto = input.parentNode.parentNode;
  return parseInt(filaProducto.id.split("-")[1]);
};

const sumarCantidad = (button) => {
  const input = button.parentNode.querySelector("input");
  input.value = parseInt(input.value) + 1;
  actualizarCantidad(input);
};

const restarCantidad = (button) => {
  const input = button.parentNode.querySelector("input");
  const cantidad = parseInt(input.value);
  if (cantidad > 0) {
    input.value = cantidad - 1;
    actualizarCantidad(input);
  } else {
    const nombreProducto = input.parentNode.parentNode.querySelector(
      ".producto__nombre-modificador"
    ).textContent;
    eliminarProductoSeleccionado(nombreProducto);
  }
};

const agregarProductoSeleccionado = (nombre, precioUnidad, cantidad) => {
  const tablaSeleccionado = document.getElementById("producto-seleccionado");
  const tbody = tablaSeleccionado.querySelector("tbody");

  const filaExistente = tbody.querySelector(`tr[data-producto="${nombre}"]`);
  if (filaExistente) {
    const precioArt = filaExistente.querySelector("td:nth-child(2)");
    const precioActual = parseFloat(precioArt.getAttribute("data-precio"));
    const nuevoPrecio = precioUnidad * cantidad;
    precioArt.textContent = `${nuevoPrecio.toFixed(2)} €`;
    precioArt.setAttribute("data-precio", nuevoPrecio);

    filaExistente.hidden = nuevoPrecio === 0;
  } else {
    const fila = document.createElement("tr");
    fila.setAttribute("data-producto", nombre);
    fila.className = "producto-seleccionado-fila";
    fila.innerHTML = `
      <td>${nombre}</td>
      <td data-precio="${precioUnidad * cantidad}">${(
      precioUnidad * cantidad
    ).toFixed(2)} €</td>
    `;
    tbody.appendChild(fila);
  }

  calcularTotalTablaDos();
};

const eliminarProductoSeleccionado = (nombre) => {
  const tablaSeleccionado = document.getElementById("producto-seleccionado");
  const filaExistente = tablaSeleccionado.querySelector(
    `tr[data-producto="${nombre}"]`
  );
  if (filaExistente) {
    filaExistente.remove();
    calcularTotalTablaDos();
  }
};

const calcularTotalTablaDos = () => {
  const tablaSeleccionado = document.getElementById("producto-seleccionado");
  const tbody = tablaSeleccionado.querySelector("tbody");
  const filas = tbody.querySelectorAll(".producto-seleccionado-fila");

  let total = 0.0;

  filas.forEach((fila) => {
    const precioArt = fila.querySelector("td:nth-child(2)");
    const precio = parseFloat(precioArt.getAttribute("data-precio"));
    total += precio;
  });

  const final__total = document.getElementById("final__total");
  const totalResultado = final__total.querySelector("#total-resultado");
  totalResultado.textContent = `${total.toFixed(2)} €`;
};

const eliminarProductoCaro = () => {
  const tablaSeleccionado = document.getElementById("producto-seleccionado");
  const filas = tablaSeleccionado.querySelectorAll(
    ".producto-seleccionado-fila"
  );

  let precioMaximo = 0;
  let filaProductoCaro = null;

  filas.forEach((fila) => {
    const precioArt = fila.querySelector("td:nth-child(2)");
    const precio = parseFloat(precioArt.getAttribute("data-precio"));
    if (precio > precioMaximo) {
      precioMaximo = precio;
      filaProductoCaro = fila;
    }
  });
};
