import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
import { systemRouter } from './system/system.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/system', systemRouter);

export default router;
