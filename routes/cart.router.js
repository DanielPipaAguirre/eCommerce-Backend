const express = require("express");
const router = express.Router();
const config = require("../config/config.json");

const factory = require("../persistencia/factory");
const model = require(`../models/${config.PERSISTENCIA}/carrito`);

let mysql = config.PERSISTENCIA === "mysql";
const productModel = require(`../models/${config.PERSISTENCIA}/productos`);

let Persistencia = factory.getPersistencia(config.PERSISTENCIA);

let instancia = mysql
    ? new Persistencia(model, "carrito")
    : new Persistencia(model);

let instanciaProducto = !mysql ? new Persistencia(productModel) : null;

router.get("/listar", async (req, res) => {
    try {
        const listaProductos = await instancia.findAll();
        return res.json(listaProductos);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.get("/listar/:id", async (req, res) => {
    try {
        const response = await instancia.findById(req.params.id);
        if (!response) throw Error("No se encontró el producto");
        return res.json(response);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.post("/agregar/:id_producto", async (req, res) => {
    try {
        if (!mysql) {
            const producto = await instanciaProducto.findById(
                req.params.id_producto
            );
            if (!producto)
                throw Error("No se encontró el producto que desea guardar");
            const body = {
                timestamp: new Date().toLocaleString(),
                producto,
            };
            await instancia.create(body);
            return res.json({ estado: "GUARDADO", carrito: body });
        }
        const body = {
            timestamp: new Date().toLocaleString(),
            producto_id: req.params.id_producto,
        };
        const response = await instancia.create(req.params.id_producto);
        if (!response.length)
            throw Error("No se encontró el producto que desea guardar");
        return res.json({ estado: "GUARDADO", carrito: body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.delete("/borrar/:id", async (req, res) => {
    try {
        const carrito = await instancia.findById(req.params.id);
        if (!carrito) throw Error("No se encontró el carrito");
        await instancia.remove(req.params.id);
        return res.json({ estado: "BORRADO", carrito });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

module.exports = router;
