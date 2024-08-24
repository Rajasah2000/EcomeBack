const express = require('express');
const { loginUserControl, getAllUser, getaUser, UpdateUser, DeleteaUser, BlockedUser, UnBlockedUser, changePassword, sendEmail, ResetPassword, createUser } = require('../controller/UserFrontController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserControl);
router.get('/all-user', getAllUser);
router.get(`/user-profile/:id`, authMiddleware, getaUser)
router.put(`/update-user`, authMiddleware, UpdateUser);
router.delete(`/delete-user/:id`, DeleteaUser);
router.put(`/blocked-user/:id`, authMiddleware, isAdmin, BlockedUser);
router.put(`/unblocked-user/:id`, authMiddleware, isAdmin, UnBlockedUser);
router.post('/change-password/:id', changePassword);
router.post('/send-email', sendEmail);
router.post('/reset-password/:token', ResetPassword);