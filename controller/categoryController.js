const validMongoDbId = require("../config/utils/validateMongodbId");
const Category = require("../models/categoryModal");

const asyncHandler = require("express-async-handler");

const AddCategory = asyncHandler(async (req, res) => {
  const findname = await Category.findOne({ name: req?.body?.name });
  if (!findname) {
    // Create a new user
    const addCategory = await Category.create(req?.body);
    console.log(addCategory);
    res.send({
      msg: "Category added successfully",
      status: true,
      data: addCategory,
    });
  } else {
    // User allready exist
    res.send({
      msg: "Category allready exists",
      status: false,
    });
    // throw new Error('User Already Exists')
  }
});

const GetAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.send({
      status: true,
      data: allCategory,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

const UpdateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  const { name } = req.body;

  // const findname = await Category.findOne({ name: name });
  // if (!findname) {
  // Create a new user
  const updateCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: req?.body?.name,
      image: req?.body?.image,
    },
    {
      new: true,
    }
  );
  res.json({
    status: true,
    message: "Category Updated Successfully",
    data: updateCategory,
  });
  // } else {
  //   // User allready exist
  //   res.send({
  //     msg: 'Category allready exists',
  //     status: false,
  //   });
  // throw new Error('User Already Exists')
  // }
});

const DeleteaCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deleteCategory,
    });
  } catch (error) {
    res?.json(error);
  }
});

module.exports = {
  AddCategory,
  GetAllCategory,
  UpdateCategory,
  DeleteaCategory,
};
