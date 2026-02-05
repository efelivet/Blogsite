 const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;



  if (!token) {
    return res.status(401).json({
      message: 'Authentication failed - no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecretKey');
    req.user = decoded; // { id, username, isAdmin, iat, exp }
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);

    return res.status(403).json({
      message: 'Invalid or expired token'
    });
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
 
  verifyToken(req, res, () => {
  
    if (req.user.isAdmin) {
      next();
    } else {
      console.log("Admin check failed for user:", req.user?.username);
      return res.status(403).json({ message: "Admin access required" });
    }
  });
};


module.exports ={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}
