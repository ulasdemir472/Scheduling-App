const { Pool } = require("pg");

const pool = new Pool({
  host: "db",
  port: 5432,
  user: "postgres",
  password: "test",
  database: "postgres",
});

module.exports = pool;
