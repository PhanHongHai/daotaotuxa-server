import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('question', 'vi');
export const GetTotalQuestionValidatorSchema: ValidationSchema = {
	name: 'GetTotalQuestionValidatorSchema',
	properties: {
		typeLevel1: [
			{
				type: 'isDefined',
				message: messages.TYPE_QUESTION_IS_REQUIRED,
			},
		],
		typeLevel2: [
			{
				type: 'isDefined',
				message: messages.TYPE_QUESTION_IS_REQUIRED,
			},
		],
		typeLevel3: [
			{
				type: 'isDefined',
				message: messages.TYPE_QUESTION_IS_REQUIRED,
			},
		],
		typeLevel4: [
			{
				type: 'isDefined',
				message: messages.TYPE_QUESTION_IS_REQUIRED,
			},
		],
	},
};
