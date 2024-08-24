const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    console.log("REQUEST", req?.headers?.authorization);
    try {
      if (token) {
        const decoded = jwt.verify(token, "mysecret");
        const user = await User?.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res?.json({
        msg: "Not Authorized token expired , please login again",
      });
    }
  } else {
    res?.json({
      msg: "There is no token attached to header",
    });
  }
});

const authMiddleware1 = (req, res, next) => {
  // Get the token from the request headers
  //   const token = req.headers.authorization;
  let token;
  if (!req?.headers?.authorization?.startsWith("Bearer")) {
    // return res.status(401).json({ message: 'Authorization token is missing' });

    //   When user not login
    req.user_id = "66120b3829babf00c79a7278";
    next();
    return;
  }

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    try {
      // Verify the token
      const decoded = jwt.verify(token, "mysecret");
      req.user_id = decoded.id; // Add the user ID to the request object
      next(); // Call next middleware
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    res?.json({
      msg: "You are not an admin",
    });
  } else {
    next();
  }
});

module.exports = { authMiddleware, authMiddleware1, isAdmin };
