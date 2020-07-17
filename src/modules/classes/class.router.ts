import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import ClassController from './class.controller';
import AnalysisClassController from './class.analysis.controller';
// Validator Schemas
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { CreateClassValidatorSchema } from './validatorSchemas/class.create.validatorschemas';
import { UpdateTrainingSectorValidatorSchema } from './validatorSchemas/class.update.validatorschemas';
import { authorize } from '../../middlewares/authorize';

const classController = new ClassController();
const analysisClassController = new AnalysisClassController();

var router = express.Router();
router.use(authorize(['admin', 'employment', 'teacher', 'student']));

// analysis class
// get total all
router.get('/getTotalsAllTime', analysisClassController.getTotalsAllTime);
// get total 30days
router.get('/getTotalsByGroupDate', analysisClassController.getTotals30days);
// get report total class by training type
router.get('/getReportClassByTrainingType', analysisClassController.getReportClassByTrainingType);
// get report total class by training sector
router.get('/getReportClassByTrainingSector', analysisClassController.getReportClassByTrainingSector);
// get report total student by training type
router.get('/getReportStudentByTrainingType', analysisClassController.getReportTotalStudentByTrainingType);
// get report total student by training sector
router.get('/getReportStudentByTrainingSector', analysisClassController.getReportTotalStudentByTrainingSector);
// get report total class of month by year
router.get('/getReportTotalClassByYear', analysisClassController.getReportTotalClassByYear);

// crud class
// get all and search class
router.get('/', validatorQuery(GetListValidatorSchemas), classController.getAndSearch);
// filter with status
router.get('/filter', validatorQuery(GetListValidatorSchemas), classController.getClassByStatus);
// get classes by training sector
router.get('/getBySector', validatorQuery(GetListValidatorSchemas), classController.getAndSearchByTrainingSector);
// get info class
router.get('/getInfoClass', classController.getInfoClass);
// get subject by class
router.get('/getSubjectByClass', validatorQuery(GetListValidatorSchemas), classController.getSubjectByClass);
// get class by Id
router.get('/:ID', classController.getClassByID);
// create class
router.post('/', validatorBody(CreateClassValidatorSchema), classController.createClass);
// update class
router.patch(
	'/:ID',
	validatorBody(UpdateTrainingSectorValidatorSchema),
	validatorParam(IdMongoValidatorSchemas),
	classController.updateClass,
);

// delete class (change isDelete === true)
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), classController.deleteClass);

export default router;
