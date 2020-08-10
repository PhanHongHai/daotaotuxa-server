import express from 'express';
import { validatorParam,  validatorBody } from '../../middlewares';
import PointController from './point.controller';
import { IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

import { CaculatorPointValidatorSchema } from './validatorSchemas/point.caculatorPoint.validatorSchemas';
import { UpdatePointValidatorSchema } from './validatorSchemas/point.update.validatorSchemas';

const pointController = new PointController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'teacher', 'student']));


// get detail point by accountID
router.get('/', pointController.getDetailByAccountID);
// get detail point by student
router.get('/detail-point-by-student', pointController.getDetailByStudent);
// get points of class by subjectID
router.get('/get-points-by-subject',pointController.getPointSubjectOfClassByTeacher);
// get point all of class by teacher
router.get('/get-point-all-by-class',pointController.getPointAllOfClassByTeacher);
// caculator point
router.post('/caculator-point',validatorBody(CaculatorPointValidatorSchema),pointController.caculatorPoint);
// update point
router.patch(
	'/:ID',
	validatorBody(UpdatePointValidatorSchema),
	validatorParam(IdMongoValidatorSchemas),
	pointController.updatePoint,
);


export default router;
