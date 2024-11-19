const { expressjwt: expressJwt } = require("express-jwt");
const secret = process.env.JWT_SECRET || "marvtheGOAT";
const jwt = require("jsonwebtoken");
const { CustomError } = require("./errorHandler");

const generateToken = (user) => {
  return jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, secret, {
    expiresIn: "2d",
  });
};
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (requiredRole === "admin" && !req.auth.isAdmin) {
      throw new CustomError("access denied", 403);
    }
    next();
  };
};

function authJwt() {
  const api = "/api/v1";
  return expressJwt({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, tokenPayload) {
  if (!tokenPayload.payload || !tokenPayload.payload.userId) {
    return true;
  }
  return false;
}

module.exports = { generateToken, authJwt, checkRole };
