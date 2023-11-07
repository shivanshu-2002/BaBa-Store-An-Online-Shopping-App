const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Cart = require("../models/Cart");


//otpverification
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const isPresent = await User.findOne({ email });

        if (isPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exist"
            });
        }
        // I am Trying to Create a Unique Otp ..It is not a perfomance wise optimize method but i am doing it because i want unique otp 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp: otp });
        }
        console.log("Otp Generated Succesfully ", otp);
        const otpPayload = {
            email, otp
        }

        // Create entry in db .
        const response = await OTP.create(otpPayload);
        console.log("Otpgenerator",response);
        return res.status(200).json({
            success: true,
            message: 'Otp Sent Successfully',
            otp
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
// signup
exports.signUp = async (req, res) => {
    try {
        //  fetch data from request ..
        const {
            firstName,
            lastName,
            password,
            email,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // VALIDATE THE DATA ,,
        if (!firstName || !lastName || !password || !email || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // match 2 password..
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm Password Not matches"
            })
        }

        //  Check if user already exist or not ..
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //  find the most recent otp  ...
        const recentOTP = await OTP.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
        console.log("recentOtp", recentOTP);

        if (recentOTP.length === 0) {
            return res.status(400).json({
                message: "Otp not found",
                success: false
            })
        } else if (recentOTP.otp !== otp) {
            return res.status(400).json({
                message: "Otp not matches",
                success: false
            })
        }

        // Hash password  ...
        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        // Create entry in DB 
        const user = await User.create({
            firstName,
            lastName,
            password: hashedPassword,
            contactNumber,  //  He has given Contact number here but it is not added in the schema
            email,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // return response..
        return res.status(200).json({
            success: true,
            message: "User registered Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Can not be registered !"
        })
    }
}
// login
exports.login = async (req, res) => {
    try {
        //    fetch the data 
        const { email, password } = req.body;
         
        // Validate the data 
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if user exist 
        const user = await User.findOne({ email: email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            })
        }

          
        // if password matches
        if (await bcrypt.compare(password, user.password)) {
            // generate jwt token
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType
            }
            
            const token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "10h",
                    algorithm: 'HS384'
                })
              console.log("token",token)
            user.token = token;
            user.password = undefined;

            const options = {
                maxAge: 3 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 3 days (3 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
                httpOnly: true,
            };
            
            // save it in a cookie and send the response
           return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully and Cookie has been Sent",
            });
        }
        // You can write the else block here..if password is incorrect 
        else {
            return res.status(401).json({
                success: false,
                message: "Password Not matches"
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failed"
        })
    }
}
// updateCart
exports.updateCart = async (req, res) => {
  try {  
    console.log("Hey this is pandey")
    const userId = req.user.id; // Assuming you have user information in the request (e.g., from authentication middleware)
    const { productId,productName , quantity ,price , image, action} = req.body;
    
    
    let cart = await Cart.findOne({ userId })
    

    if (cart==null) {
      // If the user doesn't have a cart, you can create one here
      cart = new Cart({ userId, cartItems: [] });
    }
    
    const existingCartItem = cart.cartItems.find(
      (item) => item.productId._id.toString() === productId
    );
    

    if (action === "add") {
      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        existingCartItem.quantity += Number(quantity);
      } else {
        // If the product is not in the cart, add it
        cart.cartItems.push({ productId , productName , quantity, price, image});
      }
    }

    // Save the updated cart
    const resp =  await cart.save();
   
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to update cart" });
  }
}

// // Delete Product from cart

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request (e.g., from authentication middleware)
    const productId = req.body.productId; // Assuming the product to remove is sent in the request body
    // Check if the userId and productId are provided
    if (!userId || !productId) {
      return res.status(400).json({ error: 'Both userId and productId are required in the request' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the user' });
    }

    // Find the index of the item to remove based on productId
    const itemIndex = cart.cartItems.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Remove the item from the cart
    cart.cartItems.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();
    console.log(cart.cartItems)
    return res.status(200).json({ message: 'Item removed from the cart successfully', cart: cart.cartItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove item from the cart' });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request (e.g., from an authentication middleware)
     console.log(userId)
    if (!userId) {
      return res.json({
        data:[],
        success: false,
        message: "Can't find the user",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: true, // Changed "EMpty" to "true" for consistency
        data: [],
      });
    }

    const data = cart.cartItems;
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error); // Use console.error for error logging
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
