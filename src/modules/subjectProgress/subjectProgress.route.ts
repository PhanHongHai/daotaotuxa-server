import express from 'express';
import { validatorBody, validatorParam } from '../../middlewares';
import SubjectProgressController from './subjectProgress.controller';

import { IdMongoValidatorSchemas } from './../../common/validatorSchemas';
import { CreateSubjectProgressValidatorSchema } from './validatorSchemas/subjectProgress.create.validatorSchemas';
import { authorize } from '../../middlewares/authorize';

const subjectProgressController = new SubjectProgressController();
var router = express.Router();

router.use(authorize(['admin', 'student', 'teacher']));

// get progress by student
router.get('/', subjectProgressController.getProgressByStudentID);
// get progress all of student by teacher 
router.get('/student/:ID', validatorParam(IdMongoValidatorSchemas), subjectProgressController.getAllByAccountID);
// get detail progress of subject
router.get('/detail', subjectProgressController.getDetailSubjectProgress);

router.post('/', validatorBody(CreateSubjectProgressValidatorSchema), subjectProgressController.createSubjectProgress);

router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), subjectProgressController.deleteSubjectProgress);

export default router;
