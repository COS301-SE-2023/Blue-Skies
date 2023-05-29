import express from 'express';
export const userRouter = express.Router();

userRouter.use('/', (req, res) => {
  res.send({
    message: 'Welcome to the user router!',
  });
});
