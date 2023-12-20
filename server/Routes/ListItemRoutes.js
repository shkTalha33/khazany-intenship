const express =  require("express")
const products = require("../Models/ProductSchema")
const router  = express.Router()



// filtering API on the basis of minimum price

router.get("/getminprice",async(req,res)=>{
    try {
        const result = await products.aggregate([
            {
                $group:{
                    _id:null,
                    minPrice:{$min:"$productPrice"}
                }
            }
        ])
        console.log(result)
        const minPrice = result.length > 0 ? result[0].minPrice : 0;
        
       const mnprice = await products.find({productPrice:{$gte:minPrice}}).sort({productPrice:1})
       res.status(200).json({message:mnprice})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})

// filtering API on the basis of maximum price 

router.get("/getmaxprice",async(req,res)=>{
    try {
        const result = await products.aggregate([
            {
                $group:{
                    _id:null,
                    maxPrice:{$max:"$productPrice"}
                }
            }
        ])
        const maxPrice = result.length > 0 ? result[0].maxPrice : 0;
        
       const mxprice = await products.find({productPrice:{$lte:maxPrice}}).sort({productPrice:-1})
      res.status(200).json({message:mxprice})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})

// filtering API on the basis of high to low discount

router.get("/hightolowdiscount",async(req,res)=>{
  try {
    const result = await products.aggregate([
        {
            $group:{
                _id:null,
                productDiscount:{$max:"$productDiscount"}
            }
        }
    ])
     const highToLowValue = result.length > 0 ? result[0].productDiscount : 0  
        // const   highToLowValue = 100
        const highToLowDiscount = await products.find({productDiscount:{$lte:highToLowValue}}).sort({productDiscount:-1})
    
        console.log(highToLowDiscount)
        res.status(200).json({message:highToLowDiscount})
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"}) 
  }
})

// filtering API on the basis of A to Z order Title

router.get("/a-ztitle",async(req,res)=>{

    try {
        const assecOrderTitle = await products.find().sort({productTitle:1})
        res.status(200).json({message:assecOrderTitle})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})


// filtering API on the basis of Z to A order Title

router.get("/z-atitle",async(req,res)=>{
     try {
        const descOrdertitle = await products.find().sort({productTitle:-1})
        res.status(200).json({message:descOrdertitle})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})

// filtering API on the basis of Old Date

router.get("/newdate",async(req,res)=>{
     try {
        const oldDate = await products.find().sort({date:-1})
        res.status(200).json({message:oldDate})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})

// filtering API on the basis of New Date

router.get("/olddate",async(req,res)=>{
     try {
        const newDate = await products.find().sort({date:1})
        res.status(200).json({message:newDate})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the basis of Best Selling Items 

router.get("/featured",async(req,res)=>{
     try {
        const bestSellingItem = await products.find({featuredItem:true})
        res.status(200).json({message:bestSellingItem})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the basis of Size 

router.get("/bestsellingitem",async(req,res)=>{
     try {
        const bestSellingItem = await products.find().sort({size:1})
        res.status(200).json({message:bestSellingItem})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the Search  

router.get("/searchbar",async(req,res)=>{

    const searchTerm = req.query.term || ""

    if (!searchTerm.trim()) {
        const searchItems = await products.find()
      return res.status(200).json({message:searchItems})
    }
     try {
        
        const query = {
            productTitle: { $regex: searchTerm, $options: 'i' }
        }

        const searchItems = await products.find(query)
        res.status(200).json({message:searchItems})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the Size  

router.get("/size", async (req, res) => {
     let selectedSize;
     if (req.query.sizes.length === 0) {
        selectedSize = []
     }else{
        const splitSizes = req.query.sizes.split(",")
         selectedSize = splitSizes 
     }
  
    try {
      if (selectedSize.length === 0) {
        const allItems = await products.find();
        return res.status(200).json({ message: allItems });
      }
  
      const choosedSizes = await products.find({
        productSizes: { $in: selectedSize } 
      });

  
      res.status(200).json({ message: choosedSizes });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  


// Getting all sizes products  

router.get("/allsizes",async(req,res)=>{
 
     try {
      
            const all_Items = await products.find()
        const sizes =  all_Items.map(size =>{
            return [...size.productSizes]
        })
        const uniqueSizes = [...new Set(sizes.flat())].sort()
        res.status(200).json({message:uniqueSizes})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})




module.exports = router