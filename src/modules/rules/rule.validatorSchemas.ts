import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../common/messages/index';
const messages = getMessages('rule', 'vi');
export const CreateRuleValidatorSchema: ValidationSchema = {
	name: 'CreateRuleValidatorSchema',
	properties: {
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
      },
      {
        type: 'minLength',
        constraints: [6],
        message: messages.NAME_MIN_IS_6
      },
      {
        type: 'maxLength',
        constraints: [40],
        message: messages.NAME_MAX_IS_40
      }
		],
		
	},
};
