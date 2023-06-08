import express from 'express';
import AuthController from '../../controllers/user/auth.controller';
export const authRouter = express.Router();

authRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the auth router!',
  });
});

const authController = new AuthController();
authRouter.post('/register', authController.registerUser);
