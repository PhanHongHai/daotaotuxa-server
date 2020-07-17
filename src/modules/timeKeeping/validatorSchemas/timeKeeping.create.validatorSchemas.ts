import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('timeKeeping', 'vi');
export const CreateTimeKeepingValidatorSchema: ValidationSchema = {
	name: 'CreateTimeKeepingValidatorSchema',
	properties: {
		date: [
			{
				type: 'isDefined',
				constraints: [true],
				message: messages.DATE_IS_REQUIRED,
			},
		]
	},
};
