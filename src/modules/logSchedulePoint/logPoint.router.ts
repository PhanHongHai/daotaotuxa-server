import express from 'express';
import { validatorQuery } from '../../middlewares';
import LogPointController from './logPoint.controller';

// Validator Schemas
import { GetListValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

const logPointController = new LogPointController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'teacher', 'student']));

router.get('/log-by-teacher', validatorQuery(GetListValidatorSchemas), logPointController.logsScheduleByTeacher);
router.get('/log-by-student', validatorQuery(GetListValidatorSchemas), logPointController.logsScheduleByStudent);

export default router;
