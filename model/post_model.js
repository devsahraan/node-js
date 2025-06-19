const mongoose=require('mongoose')
const { type } = require('../validation/userValidator')

const authScehma=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    createdAt: { type: Date, default: Date.now},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'auth'
    }
})

module.exports = mongoose.model('post',authScehma)