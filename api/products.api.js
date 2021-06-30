const fs = require("fs");

class Productos {
    constructor() {
        this.productos = [];
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await fs.promises.readFile("./persistencia/productos.txt");
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

    async guardarProductos(producto) {
        const productos = await this.obtenerTodosLosProductos();
        productos.push({
            id: productos.length,
            timestamp: Date.now(),
            ...producto,
        });
        try {
            await fs.promises.writeFile(
                "./persistencia/productos.txt",
                JSON.stringify(productos, null, "\t")
            );
            return true;
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
                "./persistencia/productos.txt",
                JSON.stringify(nuevosProductos, null, "\t")
            );
            return producto;
        } catch (e) {
            return {};
        }
    }

    async actualizarProductoPorId(nuevoProducto, id) {
        const productos = await this.obtenerTodosLosProductos();
        const producto = productos.findIndex((producto) => producto.id === +id);
        if (producto === -1) return false;

        productos[producto] = {
            id: +id,
            timestamp: Date.now(),
            ...nuevoProducto,
        };
        try {
            await fs.promises.writeFile(
                "./persistencia/productos.txt",
                JSON.stringify(productos, null, "\t")
            );
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = new Productos();
