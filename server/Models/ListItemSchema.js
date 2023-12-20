const mongoose = require("mongoose")

const ListItemSchema = mongoose.Schema({
     title:{
       type:String,
       required:true
     },
     size:{
       type:String,
       required:true
     },
     condition:{
       type:String,
       required:true
     },
     price:{
       type:Number,
       required:true
     },
     discountedPercentage:{
       type:Number,
     },
     featuredItem:{
       type:String,
     },
     date:{
        type:Date,
        default: new Date(Date.now())
     }
},{collection:"listItem"})

const listItem = mongoose.model("listItem",ListItemSchema)
module.exports = listItem;