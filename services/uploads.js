const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
    format: async (req, file) => {
      const ext = file.mimetype.split("/")[1];
      return ext;
    },
    public_id: (req, file) => {
      const originalName = file.originalname.split(".")[0];
      return `${originalName}_${Date.now()}`;
    },
  },
});

/// upload locally
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     const fileName =
//       file.originalname.split(".")[0] +
//       Date.now() +
//       path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

/// upload locally
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error("Please upload only image files"), false); // Reject non-image files
//   }
// };
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

module.exports = upload;
