const RatingAndReview = require("../models/Rating&Reviews");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");


// Create Rating...
exports.createRating = async (req, res) => {
    try {

        const { rating, review, productId } = req.body;
        const userId = req.user.id;
        console.log("User ====>",userId)

        // check if user is enrolled or not ..;
        const userEnrolled = await User.findOne({ _id: userId, products: { $elemMatch: { $eq: productId } } });
        if (!userEnrolled) {
            return res.status(404).json({
                success: false,
                message: "User Has Not purchased the Product",
            })
        }

        // if already reviewed YOu cant do it again ...

        const alreadyreviewed = await RatingAndReview.findOne({ user: userId, product: productId });

        if (alreadyreviewed) {
            return res.status(403).json({
                success: false,
                message: "ALready reviewed the course",
            })
        }

        // Add the values ...
        const newRating = await RatingAndReview.create({ rating: rating, review: review, user: userId, product: productId });

        // add this rating's id to the course...
        const updatedProduct = await Product.findByIdAndUpdate({ _id:productId }, {
            $push: {
                ratingAndReviews: newRating._id
            }
        }, { new: true })

        console.log(updatedProduct);

        return res.status(200).json({
            success: true,
            message: "Successfully rated the course",
            updatedProduct
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cant give rating..."
        })
    }
}


// getAverageRating....
exports.getAverageRating = async (req, res) => {
    try {
        // fetch the courseId 
        const { productId } = req.body;
        // Calculate the avg rating...

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Schema.Types.ObjectId(productId)
                },
            },
            {
                $group: {
                    _id: null, averageRating: { $avg: "$rating" }
                },
            },
        ])

        // return result ..
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        return res.status(200).json({
            success: true,
            message: "No rating is Given till Now",
            averageRating: 0
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cant get the average"
        })
    }
}

