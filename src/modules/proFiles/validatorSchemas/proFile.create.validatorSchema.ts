import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('proFile', 'vi');
export const CreateProFileValidatorSchema: ValidationSchema = {
	name: 'CreateProFileValidatorSchema',
	properties: {
		title: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		path: [
			{
				type: 'isDefined',
				message: messages.PATH_IS_REQUIRED,
			},
		],
		url: [
			{
				type: 'isDefined',
				message: messages.URL_IS_REQUIRED,
			},
		],
	},
};
