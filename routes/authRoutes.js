const express = require("express");
// const multer = require('multer');
const {
  createUser,
  changePassword,
  loginUserControl,
  getAllUser,
  ResetPassword,
  sendEmail,
  getaUser,
  DeleteaUser,
  UpdateUser,
  BlockedUser,
  UnBlockedUser,
} = require("../controller/userController");
const {
  authMiddleware,
  authMiddleware1,
  isAdmin,
} = require("../middlewares/authMiddleware");
const {
  AddCategory,
  GetAllCategory,
  UpdateCategory,
  DeleteaCategory,
} = require("../controller/categoryController");
const {
  AddProduct,
  AddProducts,
  GetAllProduct,
  GetProductByCategoryName,
  GetSingleProduct,
  UpdateProducts,
  DeleteaProduct,
  AddTrendingProduct,
  GetAllTrendingProduct,
  UpdateTrendingProduct,
  DeleteTrendingProduct,
  AddBestSellingProduct,
  GetAllBestSellingProduct,
  UpdateBestSellingProduct,
  DeleteBestSellingProduct,
  AddBestDealsProduct,
  GetAllBestDealsProduct,
  UpdateBestDealsProduct,
  DeleteBestDealsProduct,
  HandleWishlist,
  AddToWishList,
  HandlePayment,
  getAllWishlistData,
  RemoveToWishList,
  AddAddToCart,
  GetAllCArt,
  RemoveCartData,
  AddAddToCartQuantityDecrement,
} = require("../controller/productController");
const { CreateOrder, GetAllOrder } = require("../controller/orderController");
const router = express.Router();

router.post("/register", createUser, isAdmin);
router.post("/login", loginUserControl);
router.get("/all-user", getAllUser);
router.get(`/user-profile/:id`, authMiddleware, getaUser);
router.put(`/update-user`, authMiddleware, UpdateUser);
router.delete(`/delete-user/:id`, DeleteaUser);
router.put(`/blocked-user/:id`, authMiddleware, isAdmin, BlockedUser);
router.put(`/unblocked-user/:id`, authMiddleware, isAdmin, UnBlockedUser);
router.post("/change-password/:id", changePassword);
router.post("/send-email", sendEmail);
router.post("/reset-password/:token", ResetPassword);

//   Category

router.post("/add-category", AddCategory);
router.get("/get-all-category", GetAllCategory);
router.put("/edit-category/:id", UpdateCategory);
router.delete("/delete-category/:id", DeleteaCategory);

//  Wishlist

router.put("/wishlist/:id", HandleWishlist);
router.post("/add-to-wishlist", AddToWishList);
router.get("/wishlist/:id", getAllWishlistData);
router.delete("/remove-from-wishlist/:id", RemoveToWishList);

//  Add add to cart

router.post('/add-to-cart', AddAddToCart);
router.get('/get-all-cart/:id', GetAllCArt);
router.delete('/remove-cart-data/:id', RemoveCartData);
router.post('/add-to-cart-dec', AddAddToCartQuantityDecrement);

router.post('/razorpay', HandlePayment);

//   Product

router.post("/add-product", AddProducts);
router.get("/get-all-product", authMiddleware1, GetAllProduct);
router.get(
  "/get-product-by-category/:id",
  authMiddleware1,
  GetProductByCategoryName
);
router.get("/get-singleproduct/:id", GetSingleProduct);
router.put("/update-product/:id", UpdateProducts);
router.delete("/delete-product/:id", DeleteaProduct);

//   Trending Product

router.post("/add-tranding-product", AddTrendingProduct);
router.get("/get-all-tranding-product", GetAllTrendingProduct);
router.put("/update-tranding-product/:id", UpdateTrendingProduct);
router.delete("/delete-tranding-product/:id", DeleteTrendingProduct);

//     Best Selling Deals Product

router.post("/add-selling-product", AddBestSellingProduct);
router.get("/get-all-selling-product", GetAllBestSellingProduct);
router.put("/update-selling-product/:id", UpdateBestSellingProduct);
router.delete("/delete-selling-product/:id", DeleteBestSellingProduct);

//     Deals on Audio

router.post("/add-deals-product", AddBestDealsProduct);
router.get("/get-all-deals-product", GetAllBestDealsProduct);
router.put("/update-deals-product/:id", UpdateBestDealsProduct);
router.delete("/delete-deals-product/:id", DeleteBestDealsProduct);

//      Create Order

router.post('/create-order', CreateOrder);
router.get('/get-all-order/:id', GetAllOrder);
module.exports = router;
