require("dotenv").config();
const connetDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

//deletes and creates new products using the products from jsonProducts every time it is run
const start = async () => {
  try {
    await connetDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("Success");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
