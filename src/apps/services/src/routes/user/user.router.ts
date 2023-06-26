import express from 'express';
import UserController from '../../controllers/user/user.controller';
export const userRouter = express.Router();
import bodyParser from 'body-parser';

userRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the user router!',
  });
});

const userController = new UserController();
userRouter.get('/all', userController.getAllUsers);
userRouter.get('/:userId', userController.getUser);
userRouter.patch(
  '/update/:userId',
  bodyParser.json(),
  userController.updateUser
);
userRouter.delete('/delete/:userId', userController.deleteUser);
