const fs = require("fs");
const api = require("./products.api");

class Carrito {
    constructor() {
        this.carrito = [];
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await fs.promises.readFile("./persistencia/carrito.txt");
            return JSON.parse(`${productos}`);
        } catch (e) {
            return [];
        }
    }

    /* Devuelve un objeto con el producto encontrado. Si no lo encuentra devuelve undefined  */
    async obtenerProductoPorId(id) {
        const productos = await this.obtenerTodosLosProductos();
        return productos.find((producto) => producto.id === +id);
    }

    async agregarProductoPorId(id) {
        const productos = await this.obtenerTodosLosProductos();
        const producto = await api.obtenerProductoPorId(id);

        if (!producto) return false;
        productos.push({ id: +id, ...producto });
        try {
            await fs.promises.writeFile(
                "./persistencia/carrito.txt",
                JSON.stringify(productos, null, "\t")
            );
            return producto;
        } catch (e) {
            return false;
        }
    }

    async borrarProductoPorId(id) {
        const producto = await this.obtenerProductoPorId(id);
        const productos = await this.obtenerTodosLosProductos();
        if (!producto) return false;
        const nuevosProductos = productos.filter(
            (producto) => producto.id !== +id
        );
        try {
            await fs.promises.writeFile(
                "./persistencia/carrito.txt",
                JSON.stringify(nuevosProductos, null, "\t")
            );
            return producto;
        } catch (e) {
            return {};
        }
    }
}

module.exports = new Carrito();
