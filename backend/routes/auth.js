 const express = require("express");
 const bcrypt = require("bcryptjs");
 const User = require('../model/userModel');
 const jwt = require("jsonwebtoken")

 const router = express.Router();
const { verifyToken} = require("../verifyToken");
 // POST
 router.post("/register",async(req,res)=>{
    try{
        const {username, password} =req.body;

        // Validate inputs
        if(!username || !password){
            return res.status(400).json({message:"All fields are required"});

        }
  // Check if user already exists
  const existingUser = await User.findOne({username});
  if(existingUser){
    return res.status(400).json({message:"Username already exists"});

  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create and save User

  const newUser = new User({
    username,
    password:hashedPassword,
  })
  await newUser.save();
  res.status(201).json({message:"User registered successfully"})
    } catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"})
    }
 })

 

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token (optional)
    const token = jwt.sign(
      { id: user._id, username: user.username,isAdmin: user.isAdmin },
      "mySecretKey", // in real projects, use process.env.JWT_SECRET
      { expiresIn: "3d" }
    );
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // 👈 keep false for localhost
    sameSite: "lax", // 👈 use lax for dev (strict blocks localhost:3000→5000)
  });

 

    res.status(200).json({
      message: "Login successful",
      user: { username: user.username, isAdmin: user.isAdmin },
      token, // return token for client use
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/auth.js
router.get("/me", verifyToken, async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;