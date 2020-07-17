import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('subject', 'vi');
export const UpdateSubjectValidatorSchema: ValidationSchema = {
  name: 'UpdateSubjectValidatorSchema',
  properties: {
    name: [
      {
				type: 'minLength',
				constraints: [5],
				message: messages.NAME_MIN_IS_5,
			},
			{
				type: 'maxLength',
				constraints: [100],
				message: messages.NAME_MAX_IS_100,
			},
    ],
    introduce: [
			{
				type: 'maxLength',
				constraints: [200],
				message: messages.INTRODUCE_MAX_IS_200,
			},
    ],
    
  }
};
