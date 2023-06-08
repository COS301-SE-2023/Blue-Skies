import express from 'express';
import UserController from '../../controllers/user/user.controller';
import { connection } from '../../main';
export const userRouter = express.Router();

userRouter.use('/', (req, res) => {
  res.send({
    message: 'Welcome to the user router!',
  });
});
const userController = new UserController(connection);
userRouter.get('/all', userController.getAllUsers);
userRouter.get('/:userId', userController.getUser);
userRouter.post('/create', userController.createUser);
userRouter.put('/update/:userId', userController.updateUser);
