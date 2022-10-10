const Product = require("../model/product");
const path = require("path");
const fs = require("fs");

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  // console.log(req.userId);

  if (!req.file) {
    const err = new Error("Image not provided");
    err.statusCode = 404;
    throw err;
  }
  const imageUrl = req.file.path;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    // userId: req.userId,
  });

  try {
    await product.save();
    res.status(200).json({ message: "Product Created Successfully" });
  } catch (err) {
    console.log(err);
    next();
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  let updatedImageUrl = req.body.image;
  if (req.file) {
    updatedImageUrl = req.file.path;
  }

  if (!updatedImageUrl) {
    const err = new Error("No file selected");
    err.statusCode = 422;
    throw err;
  }
  try {
    const product = await Product.findById(productId);
    console.log(product, "product");
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    if (updatedImageUrl !== product.imageUrl) {
      clearImage(product.imageUrl);
    }
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      throw new Error("No Product found!");
    }
    clearImage(product.imageUrl);
    await Product.findByIdAndRemove(productId);
    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    const err = new Error(error);
    err.statusCode = 500;
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err, "err2"));
};
