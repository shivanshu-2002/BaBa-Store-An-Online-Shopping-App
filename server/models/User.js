const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        accountType:{
            type:String,
            enum:["Buyer","Seller"],
            required:true
        },
        additionalDetails:{
            type:mongoose.Schema.Types.ObjectId,
            
            ref:"Profile"
        },
        token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
        image:{
             type:String,    
        }
        ,products:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
       }],
        cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart"
        }
})

module.exports = mongoose.model("User",userSchema);