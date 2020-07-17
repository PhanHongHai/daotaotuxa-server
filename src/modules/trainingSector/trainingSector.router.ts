import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import TrainingSectorController from './trainingSector.controller';

// Validator Schemas
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { CreateTrainingSectorValidatorSchema } from './validatorSchemas/trainingSector.create.validatorschemas';
import { UpdateTrainingSectorValidatorSchema } from './validatorSchemas/trainingSector.update.validatorschemas';

const trainingSectorController = new TrainingSectorController();
var router = express.Router();

// get and search  TrainingSector
router.get('/', validatorQuery(GetListValidatorSchemas), trainingSectorController.searchAndGetTrainingSector);
// analysis TrainingSector include(TrainingSector, class, subject)
router.get('/analysisTrainingSector',  trainingSectorController.analysisTrainingSector);

router.get('/all', trainingSectorController.getAllTrainingSector);

router.get('/:ID', trainingSectorController.getTrainingSectorByID);

router.post('/', validatorBody(CreateTrainingSectorValidatorSchema), trainingSectorController.createTrainingSector);

router.patch(
	'/:ID',
	validatorBody(UpdateTrainingSectorValidatorSchema),
	validatorParam(IdMongoValidatorSchemas),
	trainingSectorController.updateTrainingSector,
);

router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), trainingSectorController.deleteTrainingSector);

export default router;
