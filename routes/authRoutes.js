const express = require('express');
const {createUser , loginUserControl, getAllUser, getaUser, DeleteaUser, UpdateUser, BlockedUser, UnBlockedUser} = require('../controller/userController');
const {authMiddleware , isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', createUser);
router.post('/login' , loginUserControl);
router.get('/all-user', getAllUser);
router.get(`/user-profile/:id`,authMiddleware, isAdmin, getaUser);
router.put(`/update-user`,authMiddleware, UpdateUser);
router.delete(`/delete-user/:id`, DeleteaUser);
router.put(`/blocked-user/:id`, authMiddleware,isAdmin, BlockedUser);
router.put(`/unblocked-user/:id`,authMiddleware,isAdmin,  UnBlockedUser);
module.exports = router;

