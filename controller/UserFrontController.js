// const createJwtToken = require('../config/jwtToken');
// const createRefreshToken = require('../config/refreshToken');
// const crypto = require('crypto')
// const validMongoDbId = require('../config/utils/validateMongodbId');
// // const User = require('../models/userModel');
// const User = require('../models/UserFrontModal')
// const nodemailer = require('nodemailer');

// const asyncHandler = require('express-async-handler');

//  //    Register User
// const createUser = asyncHandler(
//   async(req , res) => {
//   const email = req?.body?.email;
//   const findEmail =await User?.findOne({email : email});
//   if(!findEmail){
//     // Create a new user
//     const newUser =await User.create(req?.body);
//     res.send(newUser)
//   }else{
//     // User allready exist
//     res.send({
//       msg: "User allready exists",
//       status: false
//     })
//     // throw new Error('User Already Exists')
//   }
// }
// )
//  //   Login User
// const loginUserControl = asyncHandler(async(req, res) => {
//   const { email , password} = req.body;
//   //  check user exist or not
//   const findUser = await User.findOne({email});
//   if(findUser && await findUser?.isPasswordMatched(password)){
//     const refreshToken = await createRefreshToken(findUser?._id);
//     const updateUser = await User.findByIdAndUpdate(findUser?._id,
//       {
//         refreshToken:refreshToken
//       },{
//         new:true
//       }
//       )

//       res.cookie("refreshToken" , refreshToken ,{
//         maxAge:72*60*60*1000,
//       })
//     res?.send({
//       status:true,
//       token: createJwtToken(findUser?._id),
//       data: findUser,
//       message:"Login Successfully"
//     })
//   }else{
//     res.send({
//       status:false,
//       message: "Invalid Crediential"
//     })
//   }
// })
//     //   Get all User

// const getAllUser = asyncHandler(async (req , res) => {
//   try {
//     const getUser = await User?.find();
//     res.json({
//       data:getUser 
//     })
    
//   } catch (error) {
//     res?.json({
//       message:error
//     })
//   }
// })

// //    Get Single User

// const getaUser = asyncHandler( async(req,res) => {
//   const {id} = req.params
//   validMongoDbId(id)
//   try {
//     const getsingleuser = await User.findById(id);
//     res.json({
//       status:true,
//       data: getsingleuser
//     })
//   } catch (error) {
//     res?.json(error)
//   }
// })

// //    Update User

// const UpdateUser = asyncHandler( async(req,res) => {
//   const {_id} = req.user
//   validMongoDbId(_id)
//   try {
//     const updatedduser = await User.findByIdAndUpdate(_id , {
//       firstname:req?.body?.firstname,
//       lastname:req?.body?.lastname,
//       email:req?.body?.email,
//       mobile:req?.body?.mobile
//     },{
//       new: true
//     });
//   res.json({
//       status:true,
//       message: "Updated Successfully",
//       data: updatedduser
//     })
//   } catch (error) {
//     res?.json(error)
//   }
// })

// //    Get Single User

// const DeleteaUser = asyncHandler( async(req,res) => {
//   const {id} = req.params
//   validMongoDbId(id)
//   try {
//     const getdeleteduser = await User.findByIdAndDelete(id);
//   getsingleuser &&  res.json({
//       message: "Deleted Successfully",
//       data: getdeleteduser
//     })
//   } catch (error) {
//     res?.json(error)
//   }
// })
// //     Block User

// const BlockedUser = asyncHandler(async(req,res) => {
//   const {id} = req.params;
//   validMongoDbId(id)
//   try {
//     const blocked =await User.findByIdAndUpdate(
//       id,{
//         isBlocked:true
//       },{
//         new:true
//       }
//     )
//     res.json(blocked)
//   } catch (error) {
//     res?.json(error)
//   }
// });
// //     Unblock User
// const UnBlockedUser = asyncHandler(async(req,res) => {
//     const {id} = req.params;
//     validMongoDbId(id)
//   try {
//     const unblocked =await User.findByIdAndUpdate(
//       id,{
//         isBlocked:false
//       },{
//         new:false
//       }
//     )
//       res.json(unblocked)
//   } catch (error) {
//     res?.json(error)
//   }
// });
// //      Change Password
// const changePassword = asyncHandler(async(req,res) => {
//   const { id } = req.params;
//   const { old_password, new_password } = req.body;
//   const findUser = await User.findById(id);
//   // Check if old password matches the current password

//   if (!(await findUser?.isPasswordMatched(old_password))) {
//     return res.status(401).json({ message: 'Old password is incorrect', status: false });
//   } else if ((await findUser?.isPasswordMatched(old_password)) && (await findUser?.isPasswordMatched(new_password))) {
//     return res.status(401).json({ message: 'New password not equal to old password', status: false });
//   }
//   // Update the password
//   findUser.password = new_password;

//   // Save the updated user object
//   await findUser.save();

//   return res.status(200).json({ message: 'Password Changed Successfully', status: true });
// })

// // Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   // host: 'smtp.ethereal.email',
//   // port: 587,
//   service:"gmail",
//   auth: {
//     user: 'rajasah30030@gmail.com',
//     pass: 'behy opyh bfun edny',
//   },
// });

// // Generate a random token
// const generateToken = () => {
//   return crypto.randomBytes(20).toString('hex');
// };


// const sendEmail = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({ message: 'User not found', status: false });
//     }

//     // Generate a token and set it to the user object
//     const token = await generateToken();
//     user.resetToken = token;

//     // Save the user object with the updated resetToken
//     await user.save();

//     // Send reset password link to user's email
//     const mailOptions = {
//       from: 'emil.bashirian27@ethereal.email',
//       to: email,
//       subject: 'Password Reset',
//       text: `Click the link below to reset your password:\n\nhttp://localhost:3001/reset-password/${token}`,
//     };

//     console.log(mailOptions); // Log mail options for debugging

//     await transporter?.sendMail(mailOptions);

//     return res.json({ message: 'Email sent successfully', status: true });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return res.json({ message: 'Error sending email', status: false });
//   }
// });

// const ResetPassword = asyncHandler(async(req,res) => {
//   const { token } = req.params;
//   const resetToken = token;
//   const { newPassword } = req.body;

//   const user = await User.findOne({ resetToken });
//   console.log(newPassword, user);
//   if (!user) {
//     return res.status(404).json({ message: 'Invalid or expired token' });
//   }

//   // Save the user object with the updated pasword
//   user.password = newPassword;
//   user.resetToken = '';

//   await user.save();

//   return res.json({ message: 'Password reset successfully', status: true });
// })

// module.exports = {createUser , loginUserControl,sendEmail,ResetPassword, getAllUser , getaUser ,UpdateUser, DeleteaUser , BlockedUser ,changePassword, UnBlockedUser};