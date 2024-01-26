require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//databases
const connectDB = require("./db/connect.js");

//products
const products = require("./routes/products");

//middleware
const notFound = require("./middleware/notFound");
const errorCustom = require("./middleware/errorCustom");

const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/v1/products", products);

app.use(notFound);
app.use(errorCustom);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`The server is listening on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
