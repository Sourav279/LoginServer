const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const Authenticate = require("../middleware/Authenticate");
require("../DB/conn");
const User = require("../Models/userSchema");
const user = require("../Models/userSchema");
router.get("/", (req, res) => {
  res.send("Hello World");
});

//Register
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  try {
    const response = await User.findOne({ email: email });
    if (response) {
      return res.status(422).json({ error: "user already registered" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();
      res.status(201).json({ message: "user registered" });
    }
  } catch (error) {
    console.log(error);
  }
});
//Login
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please fill the details" });
    }
    const UserEmail = await User.findOne({ email: email });
    if (UserEmail) {
      const isMatch = await bcrypt.compare(password, UserEmail.password);
      const token = await UserEmail.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (UserEmail && isMatch) {
        res.status(200).json({ mesage: "SignIn successfull" });
      } else {
        res.status(400).json({ error: "Invalid Details" });
      }
    } else {
      res.status(400).json({ error: "Invalid Details" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/about", Authenticate, (req, res) => {
  console.log("about page");
  res.status(201).send(req.rootUser);
});
router.get("/contact", (req, res) => {
  res.status(201).json({ mesage: "contact page" });
});
router.get("/home", (req, res) => {
  res.status(201).json({ mesage: "home page" });
});

module.exports = router;
