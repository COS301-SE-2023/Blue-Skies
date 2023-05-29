import express from 'express';
import UserController from '../../controllers/user/user.controller';
export const userRouter = express.Router();

userRouter.use('/', (req, res) => {
  res.send({
    message: 'Welcome to the user router!',
  });
});

userRouter.get('/all', UserController.getAllUsers);
userRouter.get('/:userId', UserController.getUser);
userRouter.post('/create', UserController.createUser);
userRouter.put('/update/:userId', UserController.updateUser);
