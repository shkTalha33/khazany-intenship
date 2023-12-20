const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
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
  "/addproduct",
  fetchUser,
  upload.single("file"),
  async (req, res) => {
    try {

      console.log(req.body)
      
      console.log("filer",req.file)

      const response = await cloudinary.uploader.upload(req.file.path);
    
  

      const cloudinary_id = response.public_id;
      const img_url = response.secure_url;
      const userId = req.user.id;
      const userData = await auth.findById({_id:userId})
      const {fname,email} = userData
      const userInfo = {userId:userId,userName:fname,userEmail:email}
  
     

  
      

      const productData = {
        user: userInfo,
        productTitle: req.body.productTitle,
        productCondition: req.body.productCondition,
        productDiscount: req.body.productDiscount,
        productPrice: req.body.productPrice,
        productSizes: req.body.productSizes,
        featuredItem:req.body.featuredItem,
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

router.get("/getproducts", async (req, res) => {
  try {

    const userProducts = await products.find();

    res.status(200).json({ message: userProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/getsingleproduct/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const userProducts = await products.find({_id:productId});

    res.status(200).json({ message: userProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
