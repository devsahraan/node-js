const userValidator = require("../validation/userValidator");
const userModel = require("../model/user_model");
const data = require("../data/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const postModel = require("../model/post_model");
const nodemailer = require("nodemailer");
const cloudinary =require('../helper/cloudinaryConfig')

const secretKey = process.env.secretKey;

exports.LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      if (user.isverify) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          let token = jwt.sign({ id: user._id }, secretKey, {
            expiresIn: "2h",
          });
          res.send({ data: user, message: "login Success", token });
        } else {
          res.status(403).send({ message: "enter right password" });
        }
      } else {
        res.status(403).send({ message: "Please verify your email" });
      }
    } else {
      res.status(400).send({ message: "user not found" });
    }
  } catch (e) {
    res.status(403).json({ message: e });
  }
};

exports.SignupController = async (req, res) => {
  try {
    await userValidator.validateAsync(req.body);
    const { email, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(400).send({ message: "user already exist" });
    } else {
      // let otp = Math.floor(Math.random() * 1000000);
      // console.log(otp);

      // if(otp.length<6){
      //   otp = Math.floor(Math.random() * 1000000);
      // }

      let otp = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      console.log(otp);

      req.body.isverify = false;
      req.body.otp = otp;

      const hashPassword = await bcrypt.hash(password, 12);
      req.body.password = hashPassword;
      console.log(hashPassword);
      const user = userModel(req.body);
      await user.save();

      //PROTOCOL CREATE
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.smtpemail,
          pass: process.env.smtppasskey,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      //TEMPLATE
      const info = {
        from: process.env.smtpemail,
        to: email,
        subject: "Welcome oto test MAIL SERVICE",
        html: `
                <h1>Verify Account</h1>
                <p>your otp is : ${otp}</p>   
                `,
      };

      transporter.sendMail(info, (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      });

      let token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "2h" });

      res.send({
        user: req.body,
        message: "Create user",
        token,
      });
    }
  } catch (e) {
    res.status(403).send({ message: e });
  }
};
exports.VerifyEmail = async (req, res) => {
  try {
    let { otp } = req.body;
    let { id } = req.user;
    if (otp.length < 6) {
      return res.status(400).send({ message: "Invalid OTP" });
    }
    let user = await userModel.findById(id);

    if (user) {
      if (user.otp == otp) {
        await user.updateOne({ isverify: true });
        return res.send({
          message: "verify user",
        });
      } else {
        return res.status(400).send({ message: "Invalid OTP" });
      }
    }

    return res.status(400).json({ message: "user not found" });
  } catch (e) {
    res.status(403).send({ message: e });
  }
};

exports.GetUserController = (req, res) => {
  res.send({ message: "User Controller", id: req.params.id, data: data.data });
};

exports.GetUsersController = async (req, res) => {
  try {
    const id = req.body.id;
    let user = await userModel.find({ _id: id });
    if (user) {
      res.send({ message: "User found", data: user });
    } else {
      res.status(400).send({ message: "User not found" });
    }
  } catch (e) {
    res.status(403).send({ message: e });
  }
};

exports.CreatePost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const post = postModel(req.body);
    await post.save();
    res.send({ message: "Post Created", data: req.body });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};
exports.GetPost = async (req, res) => {
  try {
    const postdata = await postModel
      .find()
      .populate("userId", "name email userType");

    res.send({ message: "Post Created", data: postdata });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};
exports.GetUserPost = async (req, res) => {
  try {
    console.log(req.params.id);

    const postdata = await postModel.find({ userId: req.params.id });

    res.send({ message: "Post Created", data: postdata });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};
exports.DeletePost = async (req, res) => {
  try {
    console.log(req.params.id);

    const postdata = await postModel.findOneAndDelete({ _id: req.params.id });

    res.send({ message: "Deleted Post", data: postdata });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};

exports.DeleteUserPost = async (req, res) => {
  try {
    console.log(req.params.id);

    const postdata = await postModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.params.userId,
    });

    res.send({ message: "Deleted Post", data: postdata });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};

exports.UpdatePost = async (req, res) => {
  try {
    console.log(req.params.id);

    const postdata = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, description: req.body.description },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.send({ message: "Update Post", data: postdata });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};

exports.UpdatePicture = async (req, res) => {
  var file=req.files
  // var path =file.image.path
  var path ='C:/Users/Lab-2 Instructor PC/Downloads/image.jpg'
  
  console.log("File:",  file); // Add this line
 await cloudinary.uploader.upload(path, { folder: 'my_folder' })
  .then(result => {
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
    res.json({ message:'image uploaded',file:result.secure_url });
  })
  .catch(err => {
    console.error('Upload failed:', err);
    res.json({ message:'fail'  });
  });
  //     const result = await cloudinary.uploader.upload(path, {
  //     folder: 'upload',
  //   });

  res.json({ message:'fail'  });
  // try {
  //    if (!req.file) {
  //     return res.status(400).json({ message: "No file uploaded" });
  //   }
  //   console.log(req.files)
  //   // console.log(req.file)
  //   res.send({ message: "Picture" });
  // } catch (e) {
  //   res.status(400).json({ message: "bad request" });
  // }
};
