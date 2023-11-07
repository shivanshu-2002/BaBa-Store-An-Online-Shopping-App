const mongoose = require("mongoose");


const ratingAndReviewSchema = new mongoose.Schema({
      rating:{
        type:Number,
        required:true
      },
      review:{
         type:String,
         required:true
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      }
});

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);