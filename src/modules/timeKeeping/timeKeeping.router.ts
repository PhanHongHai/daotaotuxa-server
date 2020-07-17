import express from 'express';
import { validatorBody, validatorQuery } from '../../middlewares';
import TimeKeepingController from './timeKeeping.controller';

import { GetListValidatorSchemas } from './../../common/validatorSchemas';
import { CreateTimeKeepingValidatorSchema } from './validatorSchemas/timeKeeping.create.validatorSchemas';
import { authorize } from '../../middlewares/authorize';



const timeKeepingController = new TimeKeepingController();
var router = express.Router();
router.use(authorize(['student']));

router.get('/', timeKeepingController.getTimeKeepingByStudent);
router.post('/',validatorBody(CreateTimeKeepingValidatorSchema), timeKeepingController.attendanceByStudent);

export default router;
