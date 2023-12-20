if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path: __dirname+'/.env'});
  }
const express = require("express")
const cors = require("cors")
const connectToMongo = require("./db");
const path = require('path');
const app = express()
 app.use(express.json())
 app.use(cors())
require("dotenv").config()
connectToMongo()




// all your routes should go here
app.use("/items", require(path.join(__dirname,"./Routes/ListItemRoutes" )))
app.use("/auth", require(path.join(__dirname,"./Routes/AuthRoutes" )))
app.use("/products", require(path.join(__dirname,"./Routes/ProductRoutes" )))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend', 'dist')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  })
}

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Server is running on ${port} port`)
})