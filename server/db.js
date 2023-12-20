const mongoose = require("mongoose")
require("dotenv").config()
const URI = process.env.CONNECTION_STRING

 const connectToMongo =() =>{
    mongoose.connect(URI)
 }
  module.exports = connectToMongo