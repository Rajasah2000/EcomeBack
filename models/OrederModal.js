const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose?.Schema?.Types?.ObjectId,
      require: true,
    },
    items: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
    userName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    postalCode: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    paymentMode: {
      type: String,
      require: true,
    },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OrderSchema', OrderSchema);