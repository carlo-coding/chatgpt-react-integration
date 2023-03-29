const parse = require("pg-connection-string").parse;
const config = parse(process.env.DATABASE_URL);
const knex = require("knex")({
  client: "pg",
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    ssl: { rejectUnauthorized: false },
  },
});

module.exports = knex;
