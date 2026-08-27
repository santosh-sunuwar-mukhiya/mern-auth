import express from 'express'
import userAuth from '../middlewares/user.auth.js'
import getUser from '../controllers/user.controller.js'

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUser);

export default userRouter;