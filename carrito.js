const articulos = [
  {
    producto: "Iphone 13 pro",
    sku: "0K3QOSOV4V",
    unidad: 938.99,
  },
  {
    producto: "Cargador",
    sku: "TGD5XORY1L",
    unidad: 49.99,
  },
  {
    producto: "Funda de piel",
    sku: "IOKW98Q9F3",
    unidad: 79.99,
  },
];

class Articulo {
  #producto;
  #sku;
  #unidad;
  #cantidad;

  constructor(info) {
    this.#producto = info.producto;
    this.#sku = info.sku;
    this.#unidad = info.unidad;
    this.#cantidad = 0;
  }

  getProducto() {
    return this.#producto;
  }

  getSku() {
    return this.#sku;
  }

  getUnidad() {
    return this.#unidad;
  }

  getCantidad() {
    return this.#cantidad;
  }

  actualizarUnidades(cantidad) {
    this.#cantidad = cantidad;
  }

  obtenerInformacionProducto() {
    return {
      sku: this.#sku,
      quantity: this.#cantidad,
    };
  }
}

class Carrito {
  #articulos;

  constructor() {
    this.#articulos = [];
  }

  añadirProducto(producto) {
    this.#articulos.push(producto);
  }

  tamaño() {
    return this.#articulos.length;
  }

  actualizarUnidades(sku, unidades) {
    const articulo = this.#articulos.find(
      (articulo) => articulo.getSku() === sku
    );
    if (articulo) {
      articulo.actualizarUnidades(unidades);
    }
  }

  obtenerInformacionProducto(sku) {
    const articulo = this.#articulos.find(
      (articulo) => articulo.getSku() === sku
    );
    if (articulo) {
      return articulo.obtenerInformacionProducto();
    }
    return null;
  }

  obtenerCarrito() {
    let total = 0;
    const currency = "€";
    const products = [];

    this.#articulos.forEach((articulo) => {
      const cantidad = articulo.getCantidad();
      const precio = articulo.getUnidad();
      const subtotal = cantidad * precio;

      total += subtotal;

      products.push({
        sku: articulo.getSku(),
        cantidad,
        subtotal,
      });
    });

    return {
      total: total.toFixed(2),
      currency,
      products,
    };
  }
}

const carrito = new Carrito();

articulos.forEach((infoArticulo) => {
  const nuevoArticulo = new Articulo(infoArticulo);
  carrito.añadirProducto(nuevoArticulo);
});

function obtenerTotalPorProducto() {
  const carritoInfo = carrito.obtenerCarrito();

  carritoInfo.products.forEach((producto) => {
    const articulo = carrito.obtenerInformacionProducto(producto.sku);

    if (articulo) {
      const nombreProducto = articulo.sku;
      const totalPrecio = producto.subtotal.toFixed(2);

      console.log(`${nombreProducto}: ${totalPrecio}`);
    }
  });
}

obtenerTotalPorProducto();
