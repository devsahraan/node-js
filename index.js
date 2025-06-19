const exp=require('express')
const app =exp()
const bodyParse=require('body-parser')
const mainRoute=require("./routes/MainRouters")
require('dotenv').config()
const mongoose=require('mongoose')
const port = 4000
var cors = require('cors')
const formData = require("express-form-data");

app.use(cors())

const dbUrl=process.env.connectionDB
mongoose.connect(dbUrl)

const db=mongoose.connection

db.on('error',(err)=>{
    console.error('mongosse db error ',err)
})
db.once('open',()=>{
    console.log('connected mongoose dd')
})
db.on('disconnected',()=>{
    console.log('connected mongoose')
}) 

console.log(dbUrl)

app.use(bodyParse.json())
// app.use(formData.parse())

app.use('/',mainRoute)

app.listen(port,()=>{
    console.log('server run')
    console.log('server run')
})



