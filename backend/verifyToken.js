 const jwt = require("jsonwebtoken");

 const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

// ---------- VERIFY TOKEN FROM COOKIE ----------
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;               // { id, username, isAdmin }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


// ======================

const verifyTokenAndAuthorization =(req,res,next)=>{
    verifyToken(req,res,()=>{
       next()
    })
}



// ---------- ADMIN-ONLY MIDDLEWARE ----------
const verifyTokenAndAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin required" });
  }
  next();
};


module.exports ={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}
