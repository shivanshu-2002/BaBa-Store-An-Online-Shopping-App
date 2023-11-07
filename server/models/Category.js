const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        product:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        }],
        image:{
            type:String,
        }
});

module.exports = mongoose.model("Category",categorySchema);