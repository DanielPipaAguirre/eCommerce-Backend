const express = require("express");
const app = express();

app.set("port", process.env.PORT || 8080);
app.use(express.json());

app.use("/productos", require("./routes/products.router"));
app.use("/carrito", require("./routes/cart.router"));

app.listen(app.get("port"), () => {
    console.log(`Servidor en el puerto ${app.get("port")}`);
});

app.get("*", (req, res) => {
    res.status(404).json({
        error: -2,
        descripcion: `ruta ${req.path} metodo ${req.method} no implementada`,
    });
});
