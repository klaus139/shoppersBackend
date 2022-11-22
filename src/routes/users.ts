import express from 'express';
import { getAllUsers, getSingleUser, LoginUser, RegisterUser, resendOTP, updateUserProfile, verifyUser } from '../controller/userController';
import { auth } from '../middleware/authorization';
const router = express.Router();


router.post('/signup', RegisterUser)
router.post('/verify/:signature', verifyUser)
router.post('/login', LoginUser)
router.get('/resend-otp/:signature', resendOTP)
router.get('/get-all-users', getAllUsers);
router.get('/get-user', auth, getSingleUser);
router.patch('/update-profile', auth, updateUserProfile);
export default router;