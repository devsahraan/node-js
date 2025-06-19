const express=require('express')
const router=express.Router()
const userRoute=require('./UserRoutes')

// /user/
router.use('/user',userRoute) //login signup get product order 
// router.use('/admin',userRoute) //login signup get product order 
// route('/admin')  //login addproduct read update or delete all order track 
// route('/sub_admin')

module.exports=router
