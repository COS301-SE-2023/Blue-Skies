import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/users', userRouter);

export default router;
