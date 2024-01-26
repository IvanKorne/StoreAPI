const mongoose = require("mongoose");

//Sets the type of the properties, the default/required value
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name must be provided"] },
  price: { type: Number, required: [true, "Price must be provided"] },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4 },
  createdAt: { type: Date, default: Date.now() },
  //These are the only available companies
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});

module.exports = mongoose.model("Product", productSchema);
