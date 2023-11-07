const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true
    },
    productDescription: {
        type: String,
        trim: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    discounts: [{ //Discount and offers
        type: String,
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number
    },
    thumbnail: [{ //image
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true
    },
    createdAt: {
		type:Date,
		default:Date.now
	},
});

module.exports = mongoose.model("Product", productSchema);