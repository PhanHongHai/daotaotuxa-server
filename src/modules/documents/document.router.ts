import express from 'express';
import DocumentController from './document.controller';
import { validatorQuery, validatorBody, validatorParam } from './../../middlewares';
import { GetListValidatorSchemas, IdMongoValidatorSchemas } from './../../common/validatorSchemas';
import {CreateDocumentValidatorSchema} from './validatorSchemas/document.create.validatorSchema';
import { authorize } from '../../middlewares/authorize';

const documentController = new DocumentController();
var router = express.Router();

router.use(authorize(['admin', 'employment','student','teacher']));

// get and search document
router.get('/', validatorQuery(GetListValidatorSchemas), documentController.getAndSearch);
//
// create new document
router.post('/',validatorBody(CreateDocumentValidatorSchema), documentController.createDocument);

//get document by documentID
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), documentController.getDocumentById);
// update document
router.patch('/:ID', validatorParam(IdMongoValidatorSchemas), documentController.updateDocument);
// delete document
router.delete('/:ID', validatorParam(IdMongoValidatorSchemas), documentController.removeDocument);
// upload file
router.post('/upload', documentController.uploadFile);


export default router;
