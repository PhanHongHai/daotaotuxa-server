import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import ClassDetailController from './classDetail.controller';

// Validator Schemas
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { ClassDetailValidatorSchema } from './validatorSchemas/classDetail.validatorschemas';
import { authorize } from '../../middlewares/authorize';


const classDetailController = new ClassDetailController();
var router = express.Router();

router.use(authorize(['admin', 'employment','teacher','student']));
// get student of class by classId
router.get('/', validatorQuery(GetListValidatorSchemas), classDetailController.getAndSearchStudentOfClass);
// analysis class and class detail
router.get('/', validatorQuery(GetListValidatorSchemas), classDetailController.getAndSearchStudentOfClass);
// get info teacher of class by classID
router.get('/info-teacher/:ID',validatorParam(IdMongoValidatorSchemas),classDetailController.getInfoTeacherOfClass);

router.get('/students',validatorQuery(GetListValidatorSchemas),classDetailController.getStudentsOfClassByTeacher);
// add student to classd 
router.post('/', validatorBody(ClassDetailValidatorSchema), classDetailController.addAccountToClassDetail);

//remove student by student id
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), classDetailController.deleteClassDetail);

export default router;
