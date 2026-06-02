const mongoose = require('mongoose');
const Product = require('./src/models/Product');

mongoose.connect('mongodb://admin:password@localhost:27017/xyzshop?authSource=admin')
.then(async () => {

  const product = await Product.create({
    name: "Test Laptop",
    description: "Gaming Laptop",
    category: "Electronics",
    price: 1000,
    stock: 10,
    tags: ["laptop"]
  });

  console.log("PRODUCT CREATED:", product._id);

  process.exit();
});
