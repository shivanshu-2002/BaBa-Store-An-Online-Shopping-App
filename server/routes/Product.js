// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  getProductDetails,
  getSomeProducts,
  addProducts,
  updateProducts,
  buyProducts
} = require("../controllers/Product")


// Categories Controllers Import
const {
  showAllCategory,
  createCategory,
  categoryPageDetails,
  updateCategory
} = require("../controllers/Category")


// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  
} = require("../controllers/RatingandReviews")



// Importing Middlewares
const { auth, isSeller, isBuyer} = require("../middlewares/auth")



// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


router.post("/createProduct",auth,isSeller,addProducts)
router.get("/getProductDetails", getProductDetails)
router.put("/updateProducts",updateProducts)
router.put("/buyProducts",auth , isBuyer, buyProducts) //just for testing purpose

router.get("/getSomeProducts", getSomeProducts)
router.get("/showAllCategories" , showAllCategory)

router.post("/createCategory",auth ,isSeller, createCategory)
router.put("/updateCategory",updateCategory)

router.get("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isBuyer, createRating)
router.get("/getAverageRating", getAverageRating)


module.exports = router;