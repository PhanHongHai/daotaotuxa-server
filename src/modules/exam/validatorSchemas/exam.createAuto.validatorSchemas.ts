import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('proFile', 'vi');
export const CreateExamAutoValidatorSchema: ValidationSchema = {
	name: 'CreateExamAutoValidatorSchema',
	properties: {
		title: [
			{
				type: 'isDefined',
				message: messages.TITLE_IS_REQUIRED,
			},
		],
		level1: [
			{
				type: 'isDefined',
				message: messages.LEVEL_QUESTION_IS_REQUIRED,
			},
		],
		level2: [
			{
				type: 'isDefined',
				message: messages.LEVEL_QUESTION_IS_REQUIRED,
			},
		],
		level3: [
			{
				type: 'isDefined',
				message: messages.LEVEL_QUESTION_IS_REQUIRED,
			},
		],
		level4: [
			{
				type: 'isDefined',
				message: messages.LEVEL_QUESTION_IS_REQUIRED,
			},
		],
	},
};
