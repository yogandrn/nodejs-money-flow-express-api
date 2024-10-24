require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "express_cash_flow",
    host: process.env.DB_HOST ?? "127.0.0.1",
    dialect: process.env.DB_CONNECTION ?? "mysql",
    timezone: process.env.DB_TIMEZONE,
    setTimeout: 10,
  },
  test: {
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "express_cash_flow",
    host: process.env.DB_HOST ?? "127.0.0.1",
    dialect: process.env.DB_CONNECTION ?? "mysql",
    setTimeout: 10,
    timezone: process.env.DB_TIMEZONE,
  },
  production: {
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "express_cash_flow",
    host: process.env.DB_HOST ?? "127.0.0.1",
    dialect: process.env.DB_CONNECTION ?? "mysql",
  },
  // development: {
  //   username: process.env.DB_USERNAME ?? "root",
  //   password: process.env.DB_PASSWORD ?? "",
  //   database: process.env.DB_NAME ?? "express_dev",
  //   host: process.env.DB_HOST ?? "127.0.0.1",
  //   dialect: process.env.DB_CONNECTION ?? "mysql",
  // },
};
