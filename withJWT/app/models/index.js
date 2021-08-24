const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const mysql = require('mysql2/promise');

mysql.createConnection({
  host: config.HOST,
  // port: "3306",
  user: config.USER,
  password: config.PASSWORD,
}).then(connection => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${config.DB};`).then((res) => {
    console.info("Database create or successfully checked");
  })
});

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);

module.exports = db;
