const mongoose = require("mongoose");

const schema = mongoose.Schema({
    timestamp: { type: Date, default: Date.now(), require: true },
    producto: {
        nombre: { type: String, require: true, max: 100 },
        descripcion: { type: String, require: true },
        código: { type: String, require: true, max: 20 },
        foto: { type: String, require: true },
        precio: { type: Number, require: true },
        stock: { type: Number, require: true },
    },
});

const Carrito = mongoose.model("carrito", schema);

module.exports = Carrito;
