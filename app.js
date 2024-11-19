const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

//
const { errorHandler } = require("./services/errorHandler");

// configuration
const app = express();
dotenv.config();
const api = "/api/v1";

///routes
const categoryRoute = require("./routes/categories.route");
const productRoute = require("./routes/products.route");
const orderRoute = require("./routes/orders.route");
const userRoute = require("./routes/users.route");
const { authJwt } = require("./services/jwt");

///static
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
//middlewares
app.use(express.json());
app.use(authJwt());

// route middleware
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/products`, productRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/users`, userRoute);

/// error handler
app.use(errorHandler);

module.exports = app;
