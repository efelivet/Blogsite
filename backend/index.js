 const express = require('express');
 const mongoose = require('mongoose');
 const dotenv = require("dotenv");
 const cookieParser = require("cookie-parser");
 const cors = require("cors");
 const path =require("path");
 const authRoute = require('./routes/auth.js');
 const blogRouter = require("./routes/blogRouter");
 
 dotenv.config();

 const app =express();
// Middleware
app.use(
  cors({
    origin: "https://blogsite-7aer.onrender.com",
    credentials: true,
  })
);

app.use(cookieParser());
 app.use(express.json());


 mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
 }).then(()=>console.log("mongoDB Connected Sucessfully")
).catch((err)=>console.error("Mongodb connection error"))


// Use the router here

app.use("/api",authRoute)
app.use("/api", blogRouter);
app.use("/Public", express.static(path.join(__dirname,"Public")))

app.get('/',(req,res)=>{
    res.send("server is running and connected to MongoDB")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`))
