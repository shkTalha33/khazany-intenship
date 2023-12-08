const mongoose = require("mongoose")

const ProductSchema  = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"auth"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"listItem"
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
    sizeSelected:{
     type:String,
     required:true
    },
    productSizes:{
        type:Array,
        require:true
    },
    date:{
        type:Date,
        default: Date.now()
    }
},{collection:"products"})

const products = mongoose.model("products",ProductSchema)

module.exports = products

