const options = require("../../database/mysql/connection");
const knex = require("knex")(options);

const Producto = async () => {
    try {
        await knex.schema.dropTableIfExists("productos");

        await knex.schema.createTable("productos", (table) => {
            table.increments("id").notNullable();
            table.string("nombre", 100).notNullable();
            table.string("descripcion").notNullable();
            table.string("código", 20).notNullable();
            table.string("foto").notNullable();
            table.integer("precio").notNullable();
            table.integer("stock").notNullable();
        });
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
};

module.exports = Producto;
