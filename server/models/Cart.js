const mongoose = require("mongoose");


const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String,required:true },
  quantity: { type: Number,required:true},
  price: { type: Number,required:true},
  image: { type: String,required:true},
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [CartItemSchema],
});

module.exports = mongoose.model("Cart", CartSchema);
