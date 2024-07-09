const jwt = require('jsonwebtoken')
const {tryCatch} = require('../utils/tryCatch')
const userSchema = require("../model/UserSchema")

const userAuth = tryCatch(async(req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        res.status(401).json({
            success:false,
            message:"Unauthorized token is missing"
        })
    }
    const decoded = jwt.verify(token,process.env.jwt_secret)
    const user = await userSchema.findById(decoded.id)
    if(!user){
        res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    req.user = user
    next()
})
module.exports = userAuth