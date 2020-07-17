import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('trainingSector', 'vi');
export const CreateTrainingSectorValidatorSchema: ValidationSchema = {
  name: 'CreateTrainingSectorValidatorSchema',
  properties: {
    name: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.NAME_IS_REQUIRED
      },
      {
				type: 'minLength',
				constraints: [10],
				message: messages.NAME_MIN_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [100],
				message: messages.NAME_MAX_IS_150,
			},
    ],
    type: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.TYPE_IS_REQUIRED
      },
      
    ],
    
  }
};
