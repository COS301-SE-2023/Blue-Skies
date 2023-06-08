import express from 'express';
import UserController from '../../controllers/user/user.controller';
export const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the user router!',
  });
});

const userController = new UserController();
userRouter.get('/all', userController.getAllUsers);
userRouter.get('/:userId', userController.getUser);
userRouter.post('/create', userController.createUser);
userRouter.put('/update/:userId', userController.updateUser);
