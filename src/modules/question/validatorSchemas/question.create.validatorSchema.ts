import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('question', 'vi');
export const CreateQuestionValidatorSchema: ValidationSchema = {
	name: 'CreateQuestionValidatorSchema',
	properties: {
		content: [
			{
				type: 'isDefined',
				message: messages.CONTENT_IS_REQUIRED,
			},
		],
		answerA: [
			{
				type: 'isDefined',
				message: messages.ANSWER_IS_REQUIRED,
			},
		],
		answerB: [
			{
				type: 'isDefined',
				message: messages.ANSWER_IS_REQUIRED,
			},
		],
		answerC: [
			{
				type: 'isDefined',
				message: messages.ANSWER_IS_REQUIRED,
			},
		],
		answerD: [
			{
				type: 'isDefined',
				message: messages.ANSWER_IS_REQUIRED,
			},
		],
		level: [
			{
				type: 'isDefined',
				message: messages.LEVEL_IS_REQUIRED,
			},
		],
		type: [
			{
				type: 'isDefined',
				message: messages.TYPE_IS_REQUIRED,
			},
		],
	},
};
