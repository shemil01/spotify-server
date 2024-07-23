const { required } = require('joi')
const mongoose = require('mongoose')

const adminSchema = new mongoose.model({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    }
})
module.exports = mongoose.model('admin',adminSchema)