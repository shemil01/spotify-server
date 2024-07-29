const jwt = require('jsonwebtoken')
const adminSchema = require('../model/AdminSchema')
const {tryCatch} = require('../utils/tryCatch') 

const adminAuth = tryCatch(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        req.status(401).json({
            success:false,
            message:"Unauthorzed token is missing"
        })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const admin = await adminSchema.findById(decoded.id)
    if(!admin){
        res.status(404).json({
            success:false,
            message:"Not admin"
        })
    }
    req.admin = admin
    next()
}) 
module.exports = adminAuth