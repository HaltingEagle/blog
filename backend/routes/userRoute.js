import express from 'express';
import { getUsers, login, register, changePassword, getUser, forgotPassword } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/users', getUsers);
userRouter.post('/change-password',authMiddleware, changePassword);
userRouter.get('/:id', getUser);
userRouter.post('/forgot-password', forgotPassword);

export default userRouter