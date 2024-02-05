const createJwtToken = require('../config/jwtToken');
const createRefreshToken = require('../config/refreshToken');
const validMongoDbId = require('../config/utils/validateMongodbId');
const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');

 //    Register User
const createUser = asyncHandler(
  async(req , res) => {
  const email = req?.body?.email;
  const findEmail =await User?.findOne({email : email});
  if(!findEmail){
    // Create a new user
    const newUser =await User.create(req?.body);
    res.send(newUser)
  }else{
    // User allready exist
    res.send({
      msg: "User allready exists",
      status: false
    })
    // throw new Error('User Already Exists')
  }
}
)
 //   Login User
const loginUserControl = asyncHandler(async(req, res) => {
  const { email , password} = req.body;
  //  check user exist or not
  const findUser = await User.findOne({email});
  if(findUser && findUser?.isPasswordMatched(password)){
    const refreshToken =await createRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(findUser?._id,
      {
        refreshToken:refreshToken
      },{
        new:true
      }
      )

      res?.cookie("refreshToken" , refreshToken ,{
        httpOnly:true,
        maxAge:72*60*60*1000,
      })
    res?.send({
      status:true,
      token: createJwtToken(findUser?._id),
      data: findUser,
      message:"Login Successfully"
    })
  }else{
    res.send({
      status:false,
      message: "Invalid Crediential"
    })
  }
})
    //   Get all User

const getAllUser = asyncHandler(async (req , res) => {
  try {
    const getUser = await User?.find();
    res.json({
      data:getUser 
    })
    
  } catch (error) {
    res?.json({
      message:error
    })
  }
})

//    Get Single User

const getaUser = asyncHandler( async(req,res) => {
  const {id} = req.params
  validMongoDbId(id)
  try {
    const getsingleuser = await User.findById(id);
    res.json({
      data: getsingleuser
    })
  } catch (error) {
    res?.json(error)
  }
})

//    Update User

const UpdateUser = asyncHandler( async(req,res) => {
  const {_id} = req.user
  validMongoDbId(_id)
  try {
    const updatedduser = await User.findByIdAndUpdate(_id , {
      firstname:req?.body?.firstname,
      lastname:req?.body?.lastname,
      email:req?.body?.email,
      mobile:req?.body?.mobile
    },{
      new: true
    });
  res.json({
      message: "Updated Successfully",
      data: updatedduser
    })
  } catch (error) {
    res?.json(error)
  }
})

//    Get Single User

const DeleteaUser = asyncHandler( async(req,res) => {
  const {id} = req.params
  validMongoDbId(id)
  try {
    const getdeleteduser = await User.findByIdAndDelete(id);
  getsingleuser &&  res.json({
      message: "Deleted Successfully",
      data: getdeleteduser
    })
  } catch (error) {
    res?.json(error)
  }
})


const BlockedUser = asyncHandler(async(req,res) => {
  const {id} = req.params;
  validMongoDbId(id)
  try {
    const blocked =await User.findByIdAndUpdate(
      id,{
        isBlocked:true
      },{
        new:true
      }
    )
    res.json(blocked)
  } catch (error) {
    res?.json(error)
  }
});

const UnBlockedUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validMongoDbId(id)
  try {
    const unblocked =await User.findByIdAndUpdate(
      id,{
        isBlocked:false
      },{
        new:false
      }
    )
      res.json(unblocked)
  } catch (error) {
    res?.json(error)
  }
});

module.exports = {createUser , loginUserControl, getAllUser , getaUser ,UpdateUser, DeleteaUser , BlockedUser , UnBlockedUser};