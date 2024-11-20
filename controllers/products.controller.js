const mongoose = require("mongoose");
const { CustomError } = require("../services/errorHandler");
const Category = require("../models/categories.model");
const Product = require("../models/products.model");

const jwt = require("jsonwebtoken");

// async function createProduct(req, res, next) {
//   let imagePaths = [];
//   if (req.files && req.files.length > 0) {
//     imagePaths = req.files.map(
//       (file) => "http://localhost:5000/uploads/" + file.filename
//     );
//   }
//   try {
//     const category = await Category.findById(req.body.category);
//     if (!category) {
//       throw new CustomError("category does not exist", 404);
//     }
//     const product = await Product.create({
//       ...req.body,
//       images: imagePaths,
//     });

//     return res.status(200).json({ success: true, product });
//   } catch (error) {
//     next(error);
//   }
// }
async function createProduct(req, res, next) {
  let imagePaths = [];

  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => file.path);
  }

  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      throw new CustomError("Category does not exist", 404);
    }

    const product = await Product.create({
      ...req.body,
      images: imagePaths,
    });

    return res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  console.log(req.user);
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const products = await Product.find(filter).populate("category");
    if (products.length < 1) {
      throw new CustomError("no product found", 204);
    }
    return res.status(200).send({ success: true, products });
  } catch (error) {
    next(error);
  }
}
async function getSingleProduct(req, res, next) {
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new CustomError("invalid id format", 400);
    }
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      throw new CustomError("no product found", 404);
    }
    return res.status(200).json({
      sucess: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new CustomError("invalid id format", 400);
    }
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      throw new CustomError("no product found", 404);
    }
    Object.assign(product, req.body);
    await product.save();
    return res.status(200).json({
      sucess: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteProduct(req, res, next) {
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new CustomError("invalid id format", 400);
    }
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      throw new CustomError("no product found", 404);
    }
    await Product.deleteOne({ _id: productId });

    return res.status(200).json({
      sucess: true,
      message: "product successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}
async function totalProducts(req, res, next) {
  try {
    const productsCount = await Product.countDocuments();
    return res
      .status(200)
      .json({ sucess: true, "no of products": productsCount });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  totalProducts,
};
