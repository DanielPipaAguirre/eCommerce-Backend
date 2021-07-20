const options = require("../../database/mysql/connection");
const knex = require("knex")(options);
const config = require("../../config/config.json");

const mysql = config.PERSISTENCIA === "mysql";

class MysqlCRUD {
    constructor(model, table) {
        model();
        this.table = table;
    }

    async create(data) {
        if (mysql && this.table === "carrito") {
            const producto = await knex
                .from("productos")
                .select(
                    "id",
                    "nombre",
                    "descripcion",
                    "código",
                    "foto",
                    "precio",
                    "stock"
                )
                .where("id", "=", `${data}`);
            if (!producto.length) return [];
            const body = {
                timestamp: new Date().toLocaleString(),
                producto: JSON.stringify(producto[0]),
            };
            return knex(this.table).insert(body);
        }
        return knex(this.table).insert(data);
    }

    async findById(id) {
        if (mysql && this.table === "carrito") {
            const response = await knex
                .from(this.table)
                .select("id", "timestamp", "producto")
                .where("id", "=", `${id}`);
            if (response.length > 0) {
                return {
                    ...response[0],
                    producto: JSON.parse(response[0].producto),
                };
            }

            return [];
        }
        return knex
            .from(this.table)
            .select(
                "id",
                "nombre",
                "descripcion",
                "código",
                "foto",
                "precio",
                "stock"
            )
            .where("id", "=", `${id}`);
    }

    async findAll() {
        if (mysql && this.table === "carrito") {
            const response = await knex
                .from(this.table)
                .select("id", "timestamp", "producto");
            if (response.length > 0) {
                return response.map((cart) => {
                    cart.producto = JSON.parse(cart.producto);
                    return cart;
                });
            }
            return [];
        }
        return knex
            .from(this.table)
            .select(
                "id",
                "nombre",
                "descripcion",
                "código",
                "foto",
                "precio",
                "stock"
            );
    }

    update(id, toUpdate) {
        return knex.from(this.table).where("id", "=", `${id}`).update(toUpdate);
    }

    remove(id) {
        return knex(this.table).where("id", "=", `${id}`).del();
    }
}

module.exports = MysqlCRUD;
