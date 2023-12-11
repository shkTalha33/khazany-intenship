const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const listItem = require("../Models/ListItemSchema");
const auth = require("../Models/AuthSchema");
const multer = require("multer");
const products = require("../Models/ProductSchema");
const path = require("path");
const cloudinary = require("../config/Cloudinary");

// Add Products API

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    cb(null, true);
  } else {
    cb(new Error("File type is not supported"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
router.post(
  "/addproduct/:productId",
  fetchUser,
  upload.single("file"),
  async (req, res) => {
    try {
      const response = await cloudinary.uploader.upload(req.file.path);

      const cloudinary_id = response.public_id;
      const img_url = response.secure_url;

      const userId = req.user.id;

      const productId = req.params.productId;
      const productDetails = await listItem.findOne({ _id: productId });
      const sizes = req.query.sizes;
      const sizesObj = {};
      sizes.map((size) => {
        const [country, code] = size.split(" ");
        return (sizesObj[country] = code);
      });

      const { _id, title, price, discountedPercentage, condition, size } =
        productDetails;
      console.log(productDetails);
      const productData = {
        user: userId,
        productId: _id,
        productTitle: title,
        productCondition: condition,
        productDiscount: discountedPercentage,
        productPrice: price,
        sizeSelected: size,
        productSizes: sizesObj,
        cloudinary_id,
        img_url,
      };
      const newProduct = new products(productData);
      await newProduct.save();

      res.status(200).json({ message: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Show Products API

router.get("/getproducts", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const userProducts = await products.find({ user: userId });

    res.status(200).json({ message: userProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
