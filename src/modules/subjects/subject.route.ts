import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import SubjectController from './subject.controller';

import { GetListValidatorSchemas, IdMongoValidatorSchemas } from './../../common/validatorSchemas';
import { CreateSubjectValidatorSchema } from './validatorSchemas/subject.create.validatorSchemas';
import { authorize } from '../../middlewares/authorize';

const subjectController = new SubjectController();
var router = express.Router();

router.use(authorize(['admin', 'student', 'teacher']));

router.get('/', validatorQuery(GetListValidatorSchemas), subjectController.getAndSearch);
//
router.get('/all', subjectController.getAll);
router.get(
	'/getAndSearchSubject',
	validatorQuery(GetListValidatorSchemas),
	subjectController.getAndSearchSubjectGroupBy,
);
router.post('/', validatorBody(CreateSubjectValidatorSchema), subjectController.createSubject);
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), subjectController.getDetailSubject);
router.get('/getInfoBySubject/:ID', validatorParam(IdMongoValidatorSchemas), subjectController.getInfoBySubject);
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), subjectController.updateSubject);
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), subjectController.deleteSubject);

export default router;
