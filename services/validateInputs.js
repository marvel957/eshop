const { CustomError } = require("./errorHandler");

const validateUserInputs = (req, res, next) => {
  const { username, email, password, firstName, lastName, phone } = req.body;
  if (!username || !email || !password || !firstName || !lastName || !phone) {
    throw new CustomError("invalid credentials", 400);
  }
  next();
};
const validateProduct = (req, res, next) => {
  console.log(req.body);
  const { name, description, price, category, countInStock } = req.body;
  if (!name || !description || !price || !category || !countInStock) {
    throw new CustomError("invalid credentials", 400);
  }
  next();
};

module.exports = {
  validateUserInputs,
  validateProduct,
};
