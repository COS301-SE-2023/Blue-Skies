import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
