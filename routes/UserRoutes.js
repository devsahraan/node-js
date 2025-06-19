const exp = require('express');
const router = exp.Router();
const userContorller=require('../controller/user_controller')
const imageUpload=require('../controller/uploadpicutre')
const middleWare=require('../helper/middleware')
const { v2: cloudinary } = require("cloudinary");
const upload=require('../helper/upload')
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

require('dotenv').config()

// cloudinary.config({
//     cloud_name: process.env.cloudName,
//     api_key: process.env.apiKey,
//     api_secret: process.env.cloudSecretKey,
// })
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads',
//     format: async () => 'png',
//     public_id: (req, file) => Date.now() + '-' + file.originalname,
//   },
// });

// const upload = multer({ storage });
//end point
router.post('/login',userContorller.LoginController);
router.post('/signup',userContorller.SignupController);

router.post('/verify_email',middleWare.verifyToken,userContorller.VerifyEmail);
router.get('/get_users',middleWare.verifyToken, userContorller.GetUsersController);
router.get('/get_user/:id',middleWare.verifyToken, userContorller.GetUserController);
router.post('/create_post',middleWare.verifyToken, userContorller.CreatePost);
router.get('/get_post',middleWare.verifyToken, userContorller.GetPost);
router.get('/get_user_post/:id',middleWare.verifyToken, userContorller.GetUserPost);
router.delete('/delete_post/:id',middleWare.verifyToken, userContorller.DeletePost);
router.delete('/delete_user_post/:id/:userId',middleWare.verifyToken, userContorller.DeleteUserPost);
router.put('/update_post/:id',middleWare.verifyToken, userContorller.UpdatePost);
router.post('/picture', userContorller.UpdatePicture);


module.exports = router;
