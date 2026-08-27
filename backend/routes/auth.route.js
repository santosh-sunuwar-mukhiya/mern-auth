import express from 'express'

import { register, login, logout, sendVerifyOtp, verifyEmail, checkAuth, resetOtp, resetPassword } from '../controllers/auth.controller.js'

import userAuth from '../middlewares/user.auth.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-account', userAuth, verifyEmail);
router.post('/is-auth', userAuth, checkAuth);
router.post('/reset-otp', resetOtp);
router.post('/reset-password', resetPassword);

export default router;
