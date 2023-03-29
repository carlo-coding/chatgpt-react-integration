require("dotenv").config();
const parse = require("pg-connection-string").parse;
const config = parse(process.env.DATABASE_URL);
module.exports = {
  client: "pg",
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    directory: "./migrations",
  },
};
