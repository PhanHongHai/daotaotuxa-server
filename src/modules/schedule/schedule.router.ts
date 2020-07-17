import express from 'express';
import { validatorParam, validatorQuery, validatorBody } from '../../middlewares';
import ScheduleController from './schedule.controller';
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

import { CreateScheduleValidatorSchema } from './validatorSchemas/schedule.create.validatorSchema';

// validator schema;
const scheduleController = new ScheduleController();
var router = express.Router();

router.use(authorize(['admin', 'teacher']));

// get and search schedules
router.get('/', validatorQuery(GetListValidatorSchemas), scheduleController.getAndSearch);
// get detail schedule
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), scheduleController.getDetail);
// get schedule by classID
router.get('/get-schedule',validatorQuery(GetListValidatorSchemas),scheduleController.getScheduleByClassID)
// create new schedule
router.post(
	'/',
	validatorParam(IdMongoValidatorSchemas),
	validatorBody(CreateScheduleValidatorSchema),
	scheduleController.createschedule,
);
// update schedule
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), scheduleController.updateschedule);
// remove schedule
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), scheduleController.removeSchedule);

export default router;
