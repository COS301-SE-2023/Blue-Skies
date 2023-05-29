import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/user', userRouter);

export default router;
