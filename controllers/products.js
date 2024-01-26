const Product = require("../models/product");

//testing only
const getAllProductsStatic = async (req, res) => {
  const search = "ab";
  const products = await Product.find({}).select("name"); //-name => z-a price is smallest one first
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  //get the arguments from query
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  //Conditional statements if user does not pass in query
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }; //if product contains the contents of 'name', it will be put into products
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regEx = /\b(>|>=|<|<=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "ratings"];
    filters = filters.split(",").forEach((item) => {
      const [field, op, num] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [op]: Number(num) };
      }
    });
  }
  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList); //sorts by the arguments passed in
  } else {
    result.sort("createAt"); //if no arguments passed in, sort by creation date
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1; //page number
  const limit = Number(req.query.limit) || 10; //number of products per page
  const skip = (page - 1) * limit; //this skips to the requested page number

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
