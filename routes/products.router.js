const express = require("express");
const router = express.Router();
const config = require("../config/config.json");

const factory = require("../persistencia/factory");
const model = require(`../models/${config.PERSISTENCIA}/productos`);
let Persistencia = factory.getPersistencia(config.PERSISTENCIA);
let mysql = config.PERSISTENCIA === "mysql";
let instancia = mysql
    ? new Persistencia(model, "productos")
    : new Persistencia(model);

const administrador = config.ADMINISTRADOR;

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

router.post("/agregar", async (req, res) => {
    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    try {
        if (
            !Object.keys(req.body).length ||
            !Object.values(req.body).join("")
        ) {
            throw new Error("No hay productos para guardar");
        }
        await instancia.create(req.body);
        return res.json({ estado: "GUARDADO", producto: req.body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.put("/actualizar/:id", async (req, res) => {
    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Por favor, indica que campos quieres actualizar");
        }
        await instancia.update(req.params.id, req.body);
        return res.json({ estado: "ACTUALIZADO", producto: req.body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.delete("/borrar/:id", async (req, res) => {
    if (!administrador)
        return res.json({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`,
        });
    try {
        const producto = await instancia.findById(req.params.id);
        if (!producto) throw Error("No se encontró el producto");
        await instancia.remove(req.params.id);
        return res.json({ estado: "BORRADO", producto: producto });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

module.exports = router;
