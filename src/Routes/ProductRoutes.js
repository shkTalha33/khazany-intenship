const express = require("express")
const router = express.Router()
const fetchUser = require("../middleware/fetchUser")
const listItem = require("../Models/ListItemSchema")
const auth = require("../Models/AuthSchema")
const products = require("../Models/ProductSchema")




// Add Products API

router.post("/addproduct/:productId",fetchUser,async(req,res)=>{
   try {
    const userId = req.user.id
    const productId = req.params.productId
    const productDetails = await listItem.findOne({_id:productId})
    const sizes = req.query.sizes
    const sizesObj = {};
    sizes.map(size=>{
        const [country,code] = size.split(" ")
        return sizesObj[country] = code
    })

    const {_id,title,price,discountedPercentage,condition,size} = productDetails
    const productData = {user:userId,productId:_id,productTitle:title,productCondition:condition,productDiscount:discountedPercentage,productPrice:price,sizeSelected:size,productSizes:sizesObj}
    const newProduct = new products(productData)
    await newProduct.save()

    res.status(200).json({message:newProduct})
   } catch (error) {
      res.status(500).json({message:"Internal Server Error"})
   }
      

})



// Show Products API

router.get("/getproducts",fetchUser,async(req,res)=>{
   try {
    const userId = req.user.id
    
    const userProducts = await products.find({user:userId})

    res.status(200).json({message:userProducts})
   } catch (error) {
      res.status(500).json({message:"Internal Server Error"})
   }
})


module.exports = router