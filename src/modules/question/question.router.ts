import express from 'express';
import { validatorParam, validatorQuery, validatorBody } from '../../middlewares';
import QuestionController from './question.controller';
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

import { CreateQuestionValidatorSchema } from './validatorSchemas/question.create.validatorSchema';
import { GetTotalQuestionValidatorSchema } from './validatorSchemas/question.getTotal.validatorSchemas';

// validator schema;
const questionController = new QuestionController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'teacher']));

// get and search questions
router.get('/', validatorQuery(GetListValidatorSchemas), questionController.getAndSearch);
router.get('/exam', validatorQuery(GetListValidatorSchemas), questionController.getQuestionForUpdateExam);
router.get('/total-question', validatorQuery(GetTotalQuestionValidatorSchema), questionController.getNumberQuestion);
//get detail question
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), questionController.getDetail);
// create new question
router.post(
	'/',
	validatorParam(IdMongoValidatorSchemas),
	validatorBody(CreateQuestionValidatorSchema),
	questionController.createQuestion,
);
// update question
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), questionController.updateQuestion);
// remove question
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), questionController.removeQuestion);

export default router;
