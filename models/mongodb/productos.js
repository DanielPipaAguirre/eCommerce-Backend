const mongoose = require("mongoose");

const schema = mongoose.Schema({
    nombre: { type: String, require: true, max: 100 },
    descripcion: { type: String, require: true},
    código: { type: String, require: true, max: 20},
    foto: { type: String, require: true},
    precio: { type: Number, require: true },
    stock: { type: Number, require: true },
});

const Producto = mongoose.model("productos", schema);

module.exports = Producto;