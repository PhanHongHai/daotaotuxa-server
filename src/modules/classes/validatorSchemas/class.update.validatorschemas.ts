import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('trainingSector', 'vi');
export const UpdateTrainingSectorValidatorSchema: ValidationSchema = {
  name: 'UpdateTrainingSectorValidatorSchema',
  properties: {
    name: [
      
      
    ],
    
  }
};
