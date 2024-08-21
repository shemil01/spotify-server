const jwt = require('jsonwebtoken')
const {tryCatch} = require('../utils/tryCatch')
const userSchema = require('../model/User')

const userAuth = tryCatch(async(req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        res.status(401).json({
            success:false,
            message:"Unauthorized token is missing"
        })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await userSchema.findById(decoded.id)
    if(!user){
        res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    req.user = user

    if (user.role !== 'artist') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Not an artist."
        });
    }
    next()
})
module.exports = userAuth
