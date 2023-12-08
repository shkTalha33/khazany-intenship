const express = require("express")
const cors = require("cors")
const connectToMongo = require("./db")
const app = express()
 app.use(express.json())
 app.use(cors())
require("dotenv").config()
connectToMongo()

// routes 
app.use("/items",require("./src/Routes/ListItemRoutes"))
app.use("/auth",require("./src/Routes/AuthRoutes"))
app.use("/products",require("./src/Routes/ProductRoutes"))

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Server is running on ${port} port`)
})