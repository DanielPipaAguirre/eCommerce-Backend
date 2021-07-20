const options = require("../../database/mysql/connection");
const knex = require("knex")(options);

const Carrito = async () => {
    try {
        await knex.schema.dropTableIfExists("carrito");

        await knex.schema.createTable("carrito", (table) => {
            table.increments("id").notNullable();
            table.string("timestamp").notNullable();
            table.string("producto");
        });
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
};

module.exports = Carrito;
