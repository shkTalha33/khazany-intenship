const express =  require("express")
const {check,validationResult} = require("express-validator")
const listItem = require("../Models/ListItemSchema")
const router  = express.Router()


// Add list items route 

const addListValidation = [
    check("title").isString().withMessage("plx enter valid title"),
    check("size").isString().withMessage("plx enter valid size"),
    check("condition").isString().withMessage("plx enter valid string"),
    check("price").isNumeric().withMessage("plx enter valid price"),
    check("discountPercentage").optional().isNumeric().withMessage("plx enter valid percentage"),
    check("featuredItem").optional().isString().withMessage("plx enter valid string"),
]
router.post("/additem",addListValidation,async(req,res)=>{
    const body = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({message:errors.array()})
    }
     try {
         const price = parseFloat(body.price)
         if (isNaN(price) || price < 0) {
             return res.status(400).json({message:"Plx enter valid price"})
         }
         const isFeaturedItem = body.featuredItem || "not featured"
         const discountedPercentage = body.discountPercentage || 0
         
         const newItem = { ...body,discountedPercentage,featuredItem:isFeaturedItem}
         console.log(newItem)
         const item = new listItem(newItem)
         console.log(item)
         await item.save()
         res.status(200).json({message:item})
       

     } catch (error) {
       res.status(500).json({message:"Internal Server Error"})
     }
    
})

// fetch list items route

router.get("/getitem",async(req,res)=>{
    try {
       const getItems = await listItem.find({})
       console.log(getItems) 
       res.status(200).json({message:getItems})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
})

// filtering API on the basis of minimum price

router.get("/getminprice",async(req,res)=>{
    try {
        const result = await listItem.aggregate([
            {
                $group:{
                    _id:null,
                    minPrice:{$min:"$price"}
                }
            }
        ])
        console.log(result)
        const minPrice = result.length > 0 ? result[0].minPrice : 0;
        
       const mnprice = await listItem.find({price:{$gte:minPrice}}).sort({price:1})
       res.status(200).json({message:mnprice})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})

// filtering API on the basis of maximum price 

router.get("/getmaxprice",async(req,res)=>{
    try {
        const result = await listItem.aggregate([
            {
                $group:{
                    _id:null,
                    maxPrice:{$max:"$price"}
                }
            }
        ])
        const maxPrice = result.length > 0 ? result[0].maxPrice : 0;
        
       const mxprice = await listItem.find({price:{$lte:maxPrice}}).sort({price:-1})
      res.status(200).json({message:mxprice})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})

// filtering API on the basis of high to low discount

router.get("/hightolowdiscount",async(req,res)=>{
  try {
    const result = await listItem.aggregate([
        {
            $group:{
                _id:null,
                discountedPercentage:{$max:"$discountedPercentage"}
            }
        }
    ])
     const highToLowValue = result.length > 0 ? result[0].discountedPercentage : 0  
        // const   highToLowValue = 100
        const highToLowDiscount = await listItem.find({discountedPercentage:{$lte:highToLowValue}}).sort({discountedPercentage:-1})
    
        console.log(highToLowDiscount)
        res.status(200).json({message:highToLowDiscount})
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"}) 
  }
})

// filtering API on the basis of A to Z order Title

router.get("/a-ztitle",async(req,res)=>{
    try {
        const assecOrderTitle = await listItem.find().sort({title:1})
        res.status(200).json({message:assecOrderTitle})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
    }
})


// filtering API on the basis of Z to A order Title

router.get("/z-atitle",async(req,res)=>{
     try {
        const descOrdertitle = await listItem.find().sort({title:-1})
        res.status(200).json({message:descOrdertitle})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})

// filtering API on the basis of Old Date

router.get("/newdate",async(req,res)=>{
     try {
        const oldDate = await listItem.find().sort({date:-1})
        res.status(200).json({message:oldDate})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})

// filtering API on the basis of New Date

router.get("/olddate",async(req,res)=>{
     try {
        const newDate = await listItem.find().sort({date:1})
        res.status(200).json({message:newDate})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the basis of Best Selling Items 

router.get("/bestsellingitem",async(req,res)=>{
     try {
        const bestSellingItem = await listItem.find({featuredItem:"featured"})
        res.status(200).json({message:bestSellingItem})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the basis of Size 

router.get("/bestsellingitem",async(req,res)=>{
     try {
        const bestSellingItem = await listItem.find().sort({size:1})
        res.status(200).json({message:bestSellingItem})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the Search  

router.get("/searchbar",async(req,res)=>{

    const searchTerm = req.query.term || ""

    if (!searchTerm.trim()) {
      return res.status(400).json({message:"Search bar is empty"})
    }
     try {
        
        const query = {
            title: { $regex: searchTerm, $options: 'i' }
        }

        const searchItems = await listItem.find(query)
        res.status(200).json({message:searchItems})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})


// filtering API on the Size  

router.get("/size",async(req,res)=>{

    // const selectedSize = ["EUR 40","EUR 42"]
    const selectedSize = req.query.sizes || []
    
     try {
        if (selectedSize.length === 0) {
            const all_Items = await listItem.find().sort({size:1})
            return res.status(200).json({message:all_Items})
         }
        const choosedSizes = await listItem.find({size:{$in:selectedSize}}).sort({size:1})
        res.status(200).json({message:choosedSizes})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"}) 
     }
})




module.exports = router