import express from 'express';
import { validatorParam, validatorQuery, validatorBody } from '../../middlewares';
import ProFileController from './proFile.controller';
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

import { CreateProFileValidatorSchema } from './validatorSchemas/proFile.create.validatorSchema';

// validator schema;
const proFileController = new ProFileController();
var router = express.Router();

router.use(authorize(['admin', 'employment','teacher']));

// get and search ProFile
router.get('/', validatorQuery(GetListValidatorSchemas), proFileController.getAllProFiles);
//get profile by accountID
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), proFileController.getProFileById);
// upload profile
router.post('/upload',proFileController.uploadFile);
// create new ProFile
router.post(
	'/',
	validatorParam(IdMongoValidatorSchemas),
	validatorBody(CreateProFileValidatorSchema),
	proFileController.createProFile,
);
// update profile
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), proFileController.updateProfile);
// remove profile
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), proFileController.removeProfile);



export default router;
