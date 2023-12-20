const mongoose = require("mongoose")

const ProductSchema  = mongoose.Schema({
    user:{
       type:Object,
       required:true
    },
    productTitle:{
     type:String,
     required:true
    },
    productCondition:{
     type:String,
     required:true
    },
    productPrice:{
     type:Number,
     required:true
    },
    productDiscount:{
     type:Number,
     required:true
    },
    cloudinary_id:{
       type:String,
       required:true
    },
    img_url:{
       type:String,
       required:true
    },
    productSizes:{
        type:Array,
        require:true
    },
    featuredItem:{
        type:Boolean
    },
    date:{
        type:Date,
        default: Date.now()
    }
},{collection:"products"})

const products = mongoose.model("products",ProductSchema)

module.exports = products

