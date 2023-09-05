import { Router } from 'express';
import { testHelloWorld } from './default';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
import { systemRouter } from './system/system.router';
import { applianceRouter } from './appliance/appliance.router';
import { reportRouter } from './report/report.router';
import { reportApplianceRouter } from './report.appliance/report.appliance.router';
import { keyRouter } from './key/key.router';
import { trainingDataRouter } from './training.data/training.data.router';
import { locationDataRouter } from './location.data/location.data.router';
import { reportAllApplianceRouter } from './report.all.appliances/report.all.appliances.router';
const router = Router();

router.get('/', testHelloWorld);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/system', systemRouter);
router.use('/appliance', applianceRouter);
router.use('/report', reportRouter);
router.use('/reportAppliance', reportApplianceRouter);
router.use('/key', keyRouter);
router.use('/trainingData', trainingDataRouter);
router.use('/locationData', locationDataRouter);
router.use('/reportAllAppliance', reportAllApplianceRouter);

export default router;
