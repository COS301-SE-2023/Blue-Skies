import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
import { systemRouter } from './system/system.router';
import { basicCalculationRouter } from './basic.calculation/basic.calculation.router';
import { applianceRouter } from './appliance/appliance.router';
import { reportRouter } from './report/report.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/system', systemRouter);
router.use('/basicCalculation', basicCalculationRouter);
router.use('/appliance', applianceRouter);
router.use('/report', reportRouter);

export default router;
