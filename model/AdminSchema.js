const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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
    ,
    role: { type: String, enum: ['admin', 'artist'], default: 'admin' },
})
module.exports = mongoose.model('admin',adminSchema)