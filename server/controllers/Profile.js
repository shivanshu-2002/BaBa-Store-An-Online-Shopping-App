const User = require("../models/User");
const Profile = require("../models/Profile");    
const Product = require("../models/Product");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
    try {
        const { gender, dateOfBirth, about, contactNumber } = req.body;
        const userId = req.user.id;
          console.log(req.user.id)
          
        // if (!gender || !dateOfBirth || !about || !contactNumber || !userId) {
        //     res.status(500).json({
        //         success: false,
        //         message: "All fields are necessary"
        //     })
        // }
        //  find profileId with the help of userid ...
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(profileId, {
            gender: gender,
            dateOfBirth: dateOfBirth,
            about: about,
            contactNumber: contactNumber
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            updatedProfile
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Cant Update Profile"
        })
    }
}
// delete Profile...
exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            console.log("Please Login first")
            return res.status(400).json({
                message: "Cant delete Profile Login first",
                success: false
            })
        }

        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        // delete Profile
        await Profile.findByIdAndDelete(profileId);

        //it should also be deleted from Course (enrolled Students)
        const productDetails = userDetails.products; // array of all courses User have...
        //delete them one by one from Course db ...also..
        for (let i = 0; i < productDetails.length; i++) {
            const productId = productDetails[i]

            await Product.findByIdAndUpdate(productId,
                {
                    $pull: {
                        studentEnrolled: userId
                    }
                }
                , { new: true })
        }

        // deleteUser  
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cant delete User account"
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId).populate("additionalDetails").populate("products").exec();

        if (!userDetails) {
            console.log("Please Login first")
            return res.status(400).json({
                message: "Cant delete Profile Login first",
                success: false
            })
        }

        res.status(200).json({
            success: true,
            message: "ALl data fetched Successfully",
            userDetails
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cant fetch all the data"
        })
    }
}
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPictures = req.files.displayPicture;
        if (!displayPictures) {
            return res.status(403).json({
                success: false,
                message: "Please insert the image.."
            })
        }
        const userId = req.user.id;
        //   update the image on cloudinary..
        
        const upimage = await uploadImageToCloudinary(displayPictures, process.env.FOLDER);
       
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, {
            image: upimage.secure_url
        }, { new: true })

        res.status(200).json({
            success: true,
            message: "Image Uploaded Successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cant update display picture."
        })
    }
}
