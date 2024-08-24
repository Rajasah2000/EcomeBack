const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const OrderSchema = require('../models/OrederModal');
const UserSchema = require('../models/userModel');
const Wishlist = require('../models/Wishlist');
const CartModal = require('../models/CartModal');

const CreateOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user_id, items, userName, phoneNumber, postalCode, address, paymentMode, totalAmount } = req.body;

    const checkUserExist = await UserSchema.findById(user_id); // Await the result

    if (!checkUserExist) {
      await session.abortTransaction(); // Abort transaction if user not found
      session.endSession();

      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const createUserOrder = new OrderSchema({
      user_id,
      items,
      userName,
      phoneNumber,
      postalCode,
      address,
      paymentMode,
      orderDate: new Date(),
      totalAmount,
    });

 

    await createUserOrder.save({ session });

    // Clear the cart for the user
    await CartModal.deleteMany({ user_id }).session(session);
    await Wishlist.deleteMany({ user_id }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'Order created successfully',
    });
  } catch (error) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});



const GetAllOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const allOrders = await OrderSchema.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(id) },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: '$_id',
          user_id: { $first: '$user_id' },
          userName: { $first: '$userName' },
          phoneNumber: { $first: '$phoneNumber' },
          postalCode: { $first: '$postalCode' },
          address: { $first: '$address' },
          paymentMode: { $first: '$paymentMode' },
          orderDate: { $first: '$orderDate' },
          totalAmount: { $first: '$totalAmount' },
          items: {
            $push: {
              productId: '$items.productId',
              quantity: '$items.quantity',
              productDetails: '$productDetails',
            },
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      {
        $addFields: {
          OrderStatus: 'Confirmed',
          paymentStatus: {
            $cond: {
              if: { $eq: ['$paymentMode', 'online'] },
              then: 'Payment is under process and wait for admin verification.',
              else: 'Payment completed or not applicable.',
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort orders by creation date in descending order
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          userName: 1,
          phoneNumber: 1,
          postalCode: 1,
          address: 1,
          paymentMode: 1,
          paymentStatus: 1,
          orderDate: 1,
          totalAmount: 1,
          items: 1,
          OrderStatus: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      data: allOrders,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



module.exports = {
  GetAllOrder,
  CreateOrder
};

