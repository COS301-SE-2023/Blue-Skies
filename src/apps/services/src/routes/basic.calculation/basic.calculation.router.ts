import express from 'express';

export const basicCalculationRouter = express.Router();

basicCalculationRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the basic calculation router!',
  });
});
