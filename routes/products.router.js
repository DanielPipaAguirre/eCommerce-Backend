const express = require("express");
const router = express.Router();

const api = require("../api/products.api");
const administrador = require("../utils/adminsitrador")

router.get("/listar/:id?", async (req, res) => {
    const id = req.params.id;
    if (!id) return res.json(await api.obtenerTodosLosProductos());

    try {
        const producto = await api.obtenerProductoPorId(id);
        if (producto) return res.json(producto);
        throw new Error("producto no encontrado");
    } catch (e) {
        return res.json({
            mensaje: e.message,
        });
    }
});

router.post("/agregar", (req, res) => {

    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    const producto = req.body;
    try {
        if (!(Object.keys(producto).length || Object.values(producto).join("")))
            throw new Error("No hay productos para guardar");
        const guardarProducto = api.guardarProductos(producto);
        if (guardarProducto)
            return res.json({ estado: "GUARDADO", producto: producto });
        throw new Error("Hubo un error al guardar el producto");
    } catch (e) {
        return res.json({ mensaje: e.message });
    }
});

router.put("/actualizar/:id", async (req, res) => {
    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    const nuevoProducto = req.body;
    const id = req.params.id;
    try {
        const actualizarProducto = await api.actualizarProductoPorId(
            nuevoProducto,
            id
        );
        if (!actualizarProducto)
            throw new Error("No se puede actualizar el producto");

        if (!Object.keys(nuevoProducto).length)
            throw new Error("Por favor, indica que campos quieres actualizar");
        return res.json({ estado: "ACTUALIZADO", producto: nuevoProducto });
    } catch (e) {
        return res.json({
            mensaje: e.message,
        });
    }
});

router.delete("/borrar/:id", async (req, res) => {
    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    const id = req.params.id;
    try {
        const producto = await api.borrarProductoPorId(id);
        if (!Object.keys(producto).length)
            throw new Error("No se pudo eliminar el producto");
        return res.json({ estado: "BORRADO", producto });
    } catch (e) {
        return res.json({
            mensaje: e.message,
        });
    }
});

module.exports = router;
