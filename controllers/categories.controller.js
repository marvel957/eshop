const mongoose = require("mongoose");
const { CustomError } = require("../services/errorHandler");

const Category = require("../models/categories.model");

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const category = await Category.create({ name: name });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}
async function getAllCategory(req, res, next) {
  try {
    const categoryList = await Category.find({});
    if (categoryList.length < 1) {
      throw new CustomError("no content", 204);
    }
    return res.status(200).json({ categories: categoryList });
  } catch (error) {
    next(error);
  }
}
async function getSingleCategory(req, res, next) {
  const { categoryId } = req.params;
  try {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new CustomError("invalid id format", 400);
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError("not item found", 404);
    }
    return res.status(200).json({
      sucess: true,
      category,
    });
  } catch (error) {
    next(error);
  }
}
async function updateCategory(req, res, next) {
  const { categoryId } = req.params;
  try {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new CustomError("invalid id format", 400);
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError("not item found", 404);
    }
    Object.assign(category, req.body);
    await category.save();
    return res.status(200).json({
      sucess: true,
      category,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteCategory(req, res, next) {
  const { categoryId } = req.params;
  try {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new CustomError("invalid id format", 400);
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError("not item found", 404);
    }
    await Category.deleteOne({ _id: categoryId });

    return res.status(200).json({
      sucess: true,
      message: "category successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
