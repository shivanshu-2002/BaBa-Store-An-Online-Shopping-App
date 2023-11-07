const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth 
exports.auth = async (req, res, next) => {
    try {
      // Extract token
      let token =
        (req.cookies.token ||
        req.body.token ||
        req.header("Authorization") )
        
      // If token is missing, return a response.
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token is Missing",
        });
      }
      token = token.replace("Bearer ", "");
        
      // Find out values from the token
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS384'] // Specify the HS384 algorithm for verification
        });
        req.user = decode;
        next();
      } catch (error) {
        console.log(error);
        return res.status(401).json({
          success: false,
          message: "Token is invalid",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Token Verification failed",
      });
    }
  };

// isBuyer
exports.isBuyer = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Buyer') {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for the Buyers"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Role Can not be verified please try again!"
        })
    }
}


// isSeller
exports.isSeller = async (req, res, next) => {
    try {

        if (req.user.accountType !== 'Seller') {
            console.log(req.user.accoutType)
            return res.status(401).json({
                success: false,
                message: "This is protected Route for the Seller"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Role Can not be verified please try again!"
        })
    }
}

