import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('point', 'vi');
export const UpdatePointValidatorSchema: ValidationSchema = {
	name: 'UpdatePointValidatorSchema',
	properties: {
		pointMiddle: [
			{
				type: 'isDefined',
				message: messages.POINT_MIDDLE_IS_REQUIRED,
			},
		],
	},
};
