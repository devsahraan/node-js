const mongoose=require('mongoose')

const authScehma=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    userType:{type:String,required:true,enum:['user','admin']},
    isverify:{
        type:Boolean,
        default:false
    },
    otp : {
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('auth',authScehma)