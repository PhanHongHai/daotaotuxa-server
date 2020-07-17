import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('trainingSector', 'vi');
export const UpdateTrainingSectorValidatorSchema: ValidationSchema = {
  name: 'UpdateTrainingSectorValidatorSchema',
  properties: {
    name: [
      
      {
				type: 'minLength',
				constraints: [10],
				message: messages.NAME_MIN_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [100],
				message: messages.NAME_MAX_IS_150,
			}
    ],
    
  }
};
