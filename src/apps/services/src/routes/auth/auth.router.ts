import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import bodyParser from 'body-parser';
export const authRouter = express.Router();

authRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the auth router!',
  });
});

const authController = new AuthController();
authRouter.post('/register', bodyParser.json(), authController.registerUser);
authRouter.get('/login', bodyParser.json(), authController.loginUser);
