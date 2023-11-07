const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
  deleteProfile,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteProfile)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router