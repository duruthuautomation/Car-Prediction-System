const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

const cors = require('cors');

const app = express();

const userRoutes = require("./routes/user");
const carRoutes = require("./routes/car");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to database!"))
    .catch((error) => console.log(error));

app.use(function (req, res, next) {
    console.log(req.path, req.method);
    next();
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      error: true,
      message: err.message,
      code: 500
    });
  });

app.use(cors({
    origin: "*",
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/car", carRoutes);

app.listen(process.env.PORT, function () {
    console.log("Server has started on port " + process.env.PORT);
})