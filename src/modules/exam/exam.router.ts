import express from 'express';
import { validatorParam, validatorQuery, validatorBody } from '../../middlewares';
import ExamController from './exam.controller';
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

import { CreateExamValidatorSchema } from './validatorSchemas/exam.create.validatorSchema';
import { CreateExamAutoValidatorSchema } from './validatorSchemas/exam.createAuto.validatorSchemas';

// validator schema;
const examController = new ExamController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'teacher','student']));

// get and search exams
router.get('/', validatorQuery(GetListValidatorSchemas), examController.getAndSearch);
// get detail exam
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), examController.getDetail);
// create new exam
router.post(
	'/',
	validatorParam(IdMongoValidatorSchemas),
	validatorBody(CreateExamValidatorSchema),
	examController.createExam,
);
// create new exam random
router.post('/auto',  examController.createExamAuto);
// update exam
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), examController.updateExam);
// remove exam
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), examController.removeExam);

export default router;
