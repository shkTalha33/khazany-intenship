const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check,validationResult } = require("express-validator")
require("dotenv").config()
const auth = require("../Models/AuthSchema")
const fetchUser = require("../middleware/fetchUser")
const secret = process.env.JWT_SECRET




// sign up API 
const signUpValidation = [
    check("fname").isLength({min:3}).withMessage("Name must be atleast 3 letters"),
    check("lname").isLength({min:3}).withMessage("Name must be atleast 3 letters"),
    check("email").isEmail().withMessage("Enter valid email"),
    check("password").isLength({min:6}).withMessage("Password must be atleast 8 letters")
]
router.post("/signup",signUpValidation,async(req,res)=>{

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message:errors.array()})
        }
        const body = req.body
        const {password,email} = body
        const email_check = await auth.findOne({email:email})
        if (email_check) {
            return res.status(400).json({message:"Email already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const formData = {...body,password:hashedPassword}   
        const newUser = new auth(formData)
        await newUser.save()

        const data = {
            user:{
                id:newUser.id
            }
        }   
            const authToken = jwt.sign(data,secret)
           return res.status(200).json({message:authToken})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
})

// sign in API 

const signInValidation = [
    check("email").isEmail().withMessage("Enter valid email"),
    check("password").isLength({min:6}).withMessage("Password must be atleast 8 letters")
]
router.post("/signin",signInValidation,async(req,res)=>{

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message:errors.array()})
        }
        const body = req.body
        const {password,email} = body
        const email_check = await auth.findOne({email:email})
        if (!email_check) {
            return res.status(401).json({message:"Email not exist"})
        }
        const hashedPassword = await bcrypt.compare(password,email_check.password)

        if (!hashedPassword) {
            return res.status(401).json({message:"password not correct"})
        }
    
        const data = {
            user:{
                id:email_check.id
            }
        }   
            const authToken = jwt.sign(data,secret)
           return res.status(200).json({message:authToken})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get("/getuser",fetchUser,async(req,res)=>{
     try {
        const userDetail = await auth.find({_id:req.user.id}).select("-password")
        res.json({message:userDetail})
        
     } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
     }
})




module.exports = router