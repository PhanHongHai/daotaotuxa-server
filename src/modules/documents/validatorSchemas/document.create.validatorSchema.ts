import {ValidationSchema, IsPort} from "class-validator";
import { getMessages } from './../../../common/messages/index';
const messages = getMessages('document','vi');
export const CreateDocumentValidatorSchema: ValidationSchema = {
    name: 'CreateDocumentValidatorSchema',
    properties: {
        
    }
};