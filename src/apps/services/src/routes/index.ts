import {Router} from 'express';
import {testHelloWorld} from './default'
const router = Router();

router.get('/', testHelloWorld);

export default router;