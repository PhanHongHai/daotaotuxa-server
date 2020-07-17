import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import GroupSubjectController from './groupSubject.controller';

import { GetListValidatorSchemas, IdMongoValidatorSchemas } from './../../common/validatorSchemas';
import { CreateGroupSubjectValidatorSchema } from './groupSubject.validatorSchemas';
import { authorize } from '../../middlewares/authorize';

const groupSubjectController = new GroupSubjectController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'student', 'teacher']));

router.get('/', groupSubjectController.getAllBySector);
// get subjects of sector
router.get('/getListSubject', validatorQuery(GetListValidatorSchemas), groupSubjectController.getListSubject);
// get subjects of sector group file
router.get(
	'/getListSubjectGroupFile',
	validatorQuery(GetListValidatorSchemas),
	groupSubjectController.getListSubjectGroupFile,
);
// get subjects other of sector by classID & subjectID
router.get('/getOtherSubjects', validatorQuery(GetListValidatorSchemas), groupSubjectController.getListSubjectOther);
// get subject for sector
router.get('/getAllList', validatorQuery(GetListValidatorSchemas), groupSubjectController.getAllListSubject);
// add subject to sector
router.post('/', validatorBody(CreateGroupSubjectValidatorSchema), groupSubjectController.createGroupSubject);
// remove subject from sector
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), groupSubjectController.deleteSubject);

export default router;
