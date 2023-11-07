// Import the required modules
const express = require("express")
const router = express.Router()
const { auth ,isBuyer} = require("../middlewares/auth")


// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  updateCart,
  getCart,
  removeFromCart
} = require("../controllers/Auth")


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Update Cart Model
router.post("/updateCart",auth, updateCart)
// Get Cart
router.get("/getCart",auth ,getCart);
router.post("/removeCart",auth ,removeFromCart);




module.exports = router