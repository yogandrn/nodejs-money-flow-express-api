const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const router = require("./routes/index");
const errorHandler = require("./middleware/error_handler");

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT ?? 3000;

// middleware parsing json
app.use(express.json());

// set direktori 'public' bisa diakses publik
app.use("/public", express.static(path.join(`${__dirname}/public`)));

// middleware untuk encode data
app.use(express.urlencoded({ extended: true }));

// middleware cors
app.use(cors());

// app router
app.use(router);

// middleware error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
