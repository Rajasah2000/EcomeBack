const Product = require("../models/productModal");
const Category = require("../models/categoryModal");
const OrderSchema = require("../models/OrederModal")
const asyncHandler = require("express-async-handler");
const validMongoDbId = require("../config/utils/validateMongodbId");
const { default: mongoose } = require("mongoose");
const TrendingProduct = require("../models/TrendingProductModal");
const SellingProduxt = require("../models/BestSellingProductModal");
const DealsProduct = require("../models/DealsOnAudioProduct");
const WishList = require("../models/Wishlist");
const Cart = require("../models/CartModal")

const AddProducts = asyncHandler(async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      price,
      category,
      quantity,
      images,
      ratings,
      percentOff,
    } = req.body;

    const finfcategoryId = await Category.findById(categoryId);

    if (!finfcategoryId) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newProduct = new Product({
      categoryId,
      name,
      slug,
      description,
      price,
      category,
      quantity,
      images,
      ratings,
      percentOff,
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

const GetAllProduct = asyncHandler(async (req, res) => {
  const user_id = new mongoose.Types.ObjectId(req.user_id);
  try {
    const product = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categorydata",
        },
      },
      {
        $lookup: {
          from: "wishlists",
          foreignField: "product_id",
          localField: "_id",
          as: "wishlist",
          pipeline: [
            {
              $match: {
                user_id: user_id,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          quantity: 1,
          images: 1,
          percentOff: 1,
          ratings: 1,
          createdAt: 1,
          updatedAt: 1,
          categorydata: 1,
          iswishlisted: {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$wishlist",
                  },
                  0,
                ],
              },
              false,
              true,
            ],
          },
          addtocart: 1,
        },
      },
    ]);
    // const allProduct = await Product.find();
    res.send({
      status: true,
      data: product,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

const GetProductByCategoryName = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = new mongoose.Types.ObjectId(req.user_id);
  validMongoDbId(id);
  try {
    //  const products = await Product.find({ categoryId: id });
    //  res.send({
    //    status: true,
    //    data: products,
    //  });

    const product = await Product.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categorydata',
        },
      },
      {
        $lookup: {
          from: 'wishlists',
          foreignField: 'product_id',
          localField: '_id',
          as: 'wishlist',
          pipeline: [
            {
              $match: {
                user_id: user_id,
              },
            },
          ],
        },
      },
      {
        $unwind: '$categorydata',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          quantity: 1,
          images: 1,
          percentOff: 1,
          ratings: 1,
          createdAt: 1,
          updatedAt: 1,
          categorydata: 1,
          iswishlisted: {
            $cond: [
              {
                $eq: [
                  {
                    $size: '$wishlist',
                  },
                  0,
                ],
              },
              false,
              true,
            ],
          },
        },
      },
    ]);

    console.log(product);
    if (!product || product.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    res.status(200).json({ status: true, data: product });
  } catch (error) {
    res.send({
      status: false,
      message: "Failed to get products",
    });
  }
});

const GetSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  console.log(id);
  try {
    // const singleProduct = await Product.aggregate([
    // {
    //   $match: { _id: mongoose.Types.ObjectId(id) },
    // },
    //   {
    //     $lookup: {
    //       from: 'categories',
    //       localField: 'category',
    //       foreignField: '_id',
    //       as: 'categoryData',
    //     },
    //   },
    //   // {
    //   //   $unwind: {
    //   //     path: '$categoryData',
    //   //     preserveNullAndEmptyArrays: true,
    //   //   },
    //   // },
    //   {
    //     $unwind: '$category',
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       name: 1,
    //       description: 1,
    //       price: 1,
    //       quantity: 1,
    //       images: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       categoryData: 1,
    //       // category: '$categoryData.name',
    //     },
    //   },
    // ]);

    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categorydata",
        },
      },
      {
        $unwind: "$categorydata",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          quantity: 1,
          images: 1,
          percentOff: 1,
          ratings: 1,
          createdAt: 1,
          updatedAt: 1,
          categorydata: 1,
        },
      },
    ]);

    console.log(product);
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ status: true, product: product[0] });
    // const singleproducts = await Product.findById(id);
    // res.send({
    //   status: true,
    //   data: singleProduct,
    // });
  } catch (error) {
    res.send({
      status: false,
      message: "Failed to get products",
    });
  }
});

const UpdateProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  const { name } = req.body;

  // const findname = await Product.findOne({ name: name });
  // if (!findname) {
  // Create a new user
  const updateproduct = await Product.findByIdAndUpdate(
    id,
    {
      categoryId: req?.body?.categoryId,
      name: req?.body?.name,
      slug: req?.body?.slug,
      description: req?.body?.description,
      price: req?.body?.price,
      category: req?.body?.category,
      quantity: req?.body?.quantity,
      images: req?.body?.images,
      ratings: req?.body?.ratings,
      percentOff: req?.body?.percentOff,
    },
    {
      new: true,
    }
  );
  res.json({
    status: true,
    message: "Product Updated Successfully",
    data: updateproduct,
  });
  // } else {
  //   // User allready exist
  //   res.send({
  //     msg: 'Prodect name allready exists',
  //     status: false,
  //   });
  //   // throw new Error('User Already Exists')
  // }
});

const DeleteaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deleteProduct,
    });
  } catch (error) {
    res?.json(error);
  }
});

//     Trending Product

const AddTrendingProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    } = req.body;

    const newProduct = new TrendingProduct({
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    });

    await newProduct.save();

    res.status(200).json({
      status: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

const GetAllTrendingProduct = asyncHandler(async (req, res) => {
  try {
    const product = await TrendingProduct.find();
    // const allProduct = await Product.find();
    res.send({
      status: true,
      data: product,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

const UpdateTrendingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  validMongoDbId(id);
  try {
    const updateaproduct = await TrendingProduct.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        slug: req?.body?.slug,
        description: req?.body?.description,
        price: req?.body?.price,
        quantity: req?.body?.quantity,
        images: req?.body?.images,
        ratings: req?.body?.ratings,
        percentOff: req?.body?.percentOff,
      },
      {
        new: true,
      }
    );

    res?.json({
      status: true,
      data: updateaproduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res?.json({
      status: false,
      message: error,
    });
  }
});

const DeleteTrendingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deletedProduct = await TrendingProduct.findByIdAndDelete(id);
    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res?.json(error);
  }
});

//     Best Selling Deals Product

const AddBestSellingProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    } = req.body;

    const newProduct = new SellingProduxt({
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    });

    await newProduct.save();

    res.status(200).json({
      status: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

const GetAllBestSellingProduct = asyncHandler(async (req, res) => {
  try {
    const product = await SellingProduxt.find();
    // const allProduct = await Product.find();
    res.send({
      status: true,
      data: product,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

const UpdateBestSellingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const updateaproduct = await SellingProduxt.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        slug: req?.body?.slug,
        description: req?.body?.description,
        price: req?.body?.price,
        quantity: req?.body?.quantity,
        images: req?.body?.images,
        ratings: req?.body?.ratings,
        percentOff: req?.body?.percentOff,
      },
      {
        new: true,
      }
    );

    res?.json({
      status: true,
      data: updateaproduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res?.json({
      status: false,
      message: error,
    });
  }
});

const DeleteBestSellingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deletedProduct = await SellingProduxt.findByIdAndDelete(id);
    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res?.json(error);
  }
});

//       Deals On Audio

const AddBestDealsProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    } = req.body;

    const newProduct = new DealsProduct({
      name,
      slug,
      description,
      price,
      quantity,
      images,
      ratings,
      percentOff,
    });

    await newProduct.save();

    res.status(200).json({
      status: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

const GetAllBestDealsProduct = asyncHandler(async (req, res) => {
  try {
    const product = await DealsProduct.find();
    // const allProduct = await Product.find();
    res.send({
      status: true,
      data: product,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

const UpdateBestDealsProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const updateaproduct = await DealsProduct.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        slug: req?.body?.slug,
        description: req?.body?.description,
        price: req?.body?.price,
        quantity: req?.body?.quantity,
        images: req?.body?.images,
        ratings: req?.body?.ratings,
        percentOff: req?.body?.percentOff,
      },
      {
        new: true,
      }
    );

    res?.json({
      status: true,
      data: updateaproduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res?.json({
      status: false,
      message: error,
    });
  }
});

const DeleteBestDealsProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deletedProduct = await DealsProduct.findByIdAndDelete(id);
    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res?.json(error);
  }
});

const HandleWishlist = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Toggle the status field
    product.status = !product.status;
    await product.save();

    res.json({ message: "Wishlist status updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//            WishList Crud Operation

const AddToWishList = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { user_id, product_id } = req.body;
  try {
    // Check if wishlist item with the same product_id already exists for the user
    const existingItem = await WishList.findOne({ user_id, product_id });

    if (existingItem) {
      return res.send({
        message: "Product already exists in wishlist!",
        status: false,
      });
    }

    // If item does not exist, create a new wishlist item
    const wishlistdata = await WishList.create({ user_id, product_id });

    res.send({
      message: "Product added to wishlist successfully!",
      status: true,
      data: wishlistdata,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    res.status(500).send({
      message: "Error adding to wishlist",
      status: false,
    });
  }
});



const getAllWishlistData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const wishlistData = await WishList.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'wishlistProductdata',
        },
      },
      {
        $unwind: '$wishlistProductdata',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'wishlistProductdata.category',
          foreignField: '_id',
          as: 'categorydata',
        },
      },
      {
        $addFields: {
          iswishlist: true, // Assuming the document exists in the wishlist
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          wishlistProductdata: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            price: 1,
            quantity: 1,
            images: 1,
            percentOff: 1,
            ratings: 1,
            createdAt: 1,
            updatedAt: 1,
            categorydata: { $arrayElemAt: ['$categorydata', 0] },
            iswishlisted: '$iswishlist',
            addtocart: 1,
          },
        },
      },
    ]);
    res.send({
      message: 'Get all wishlist data',
      status: true,
      data: wishlistData,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error fetching wishlist',
      status: false,
      error: error.message,
    });
  }
});



const RemoveToWishList = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const removeWishlist = await WishList.findByIdAndDelete(id);
    if (!removeWishlist) {
      return res.status(404).json({
        status: false,
        message: "Wishlist item not found",
      });
    }
    res.json({
      status: true,
      message: "Product removed to wishlist successfully!",
      data: removeWishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      status: false,
      message: "Error removing from wishlist",
    });
  }
});

//              Add to Cart Operation

const AddAddToCart = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    // Check if wishlist item with the same product_id already exists for the user
    let existingItem = await Cart.findOne({ user_id, product_id });

    if (existingItem) {
      // If item exists, increment the quantity by 1
      existingItem.quantity += 1;
      await existingItem.save();
      return res.send({
        message: 'Product quantity incremented in cart!',
        status: true,
        data: existingItem,
      });
    } else {
      // If item does not exist, create a new wishlist item with quantity 1
      const Cartdata = await Cart.create({ user_id, product_id, quantity: 1 });
      return res.send({
        message: 'Product added to cart successfully!',
        status: true,
        data: Cartdata,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error adding to cart',
      status: false,
    });
  }
});

const AddAddToCartQuantityDecrement = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    // Check if wishlist item with the same product_id already exists for the user
    let existingItem = await Cart.findOne({ user_id, product_id });

    if (existingItem) {
      // If item exists, decrement the quantity by 1
      existingItem.quantity -= 1;
      await existingItem.save();
      return res.send({
        message: 'Product quantity decremented in cart!',
        status: true,
        data: existingItem,
      });
    } else {
      // If item does not exist, create a new wishlist item with quantity 1
      const Cartdata = await Cart.create({ user_id, product_id, quantity: 1 });
      return res.send({
        message: 'Product added to cart successfully!',
        status: true,
        data: Cartdata,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error adding to cart',
      status: false,
    });
  }
});


const GetAllCArt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const wishlistData = await Cart.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'CartProductdata',
        },
      },
      {
        $unwind: '$CartProductdata',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'CartProductdata.category',
          foreignField: '_id',
          as: 'categorydata',
        },
      },
      {
        $addFields: {
          iswishlist: true, // Assuming the document exists in the wishlist
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          quantity:1,
          CartProductdata: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            price: 1,
            quantity: 1,
            images: 1,
            percentOff: 1,
            ratings: 1,
            createdAt: 1,
            updatedAt: 1,
            categorydata: { $arrayElemAt: ['$categorydata', 0] },
            iswishlisted: '$iswishlist',
            addtocart: 1,
          },
        },
      },
    ]);
    res.send({
      message: 'Get all cart data',
      status: true,
      data: wishlistData,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error fetching cart data',
      status: false,
      error: error.message,
    });
  }
});

const RemoveCartData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const removeCartItem = await Cart?.findByIdAndDelete(id);
    console.log(removeCartItem);
    if (!removeCartItem) {
      return res.status(404).json({
        status: false,
        message: 'Cart item not found',
      });
    }
    res.json({
      status: true,
      message: 'Product removed from cart successfully!',
      data: removeCartItem,
    });
  } catch (error) {
    console.error('Error removing from cart item:', error);
    res.status(500).json({
      status: false,
      message: 'Error removing from cart item',
    });
  }
});

const crypto = require('crypto');

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base 36
  const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string
  return `order_${timestamp}${randomString}`;
}




const HandlePayment = asyncHandler(async(req,res) => {
  const { price} = req.body;
  const orderId = generateUniqueId();
  try {
  
    res.json({
      status: true,
      message: 'Order id generated successfully!',
      data: {
        amount: parseInt(price),
        currency: 'INR',
        id: orderId,
      },
    });
  } catch (error) {
   
    res.status(500).json({
      status: false,
      message: 'Error for generating order id',
    });
  }
})


module.exports = {
  RemoveCartData,
  AddAddToCart,
  GetAllCArt,
  AddProducts,
  HandleWishlist,
  AddToWishList,
  HandlePayment,
  getAllWishlistData,
  RemoveToWishList,
  GetAllProduct,
  GetProductByCategoryName,
  DeleteaProduct,
  GetSingleProduct,
  UpdateProducts,
  AddTrendingProduct,
  GetAllTrendingProduct,
  UpdateTrendingProduct,
  AddAddToCartQuantityDecrement,
  DeleteTrendingProduct,
  AddBestSellingProduct,
  GetAllBestSellingProduct,
  UpdateBestSellingProduct,
  DeleteBestSellingProduct,
  AddBestDealsProduct,
  GetAllBestDealsProduct,
  UpdateBestDealsProduct,
  DeleteBestDealsProduct,
};
