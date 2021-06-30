const express = require("express");
const router = express.Router();

const api = require("../api/cart.api");

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

router.post("/agregar/:id_producto", async (req, res) => {
    const id = req.params.id_producto;
    try {
        const producto = await api.agregarProductoPorId(id);
        if (Object.keys(producto).length)
            return res.json({ estado: "GUARDADO", producto });
        throw new Error("No se pudo agregar el producto al carrito");
    } catch (e) {
        return res.json({
            mensaje: e.message,
        });
    }
});

router.delete("/borrar/:id", async (req, res) => {
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
