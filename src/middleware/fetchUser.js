const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const secret = process.env.JWT_SECRET
const fetchUser = async(req,res,next)=>{
    try {
        const token = req.header("auth-token")
        if (!token) {
           return res.status(401).send({error:"Please authenticating a valid token"})
        }

        const data = jwt.verify(token,secret)
        req.user = data.user
       next() 
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})   
    }
}

module.exports = fetchUser