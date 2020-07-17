import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('proFile', 'vi');
export const CreateExamValidatorSchema: ValidationSchema = {
	name: 'CreateExamValidatorSchema',
	properties: {
		title: [
			{
				type: 'isDefined',
				message: messages.TITLE_IS_REQUIRED,
			},
		],
		questions: [
			{
				type: 'isDefined',
				message: messages.QUESTIONS_IS_REQUIRED,
			},
		],
	},
};
