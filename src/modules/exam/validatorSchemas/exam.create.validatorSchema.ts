import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('exam', 'vi');
export const CreateExamValidatorSchema: ValidationSchema = {
	name: 'CreateExamValidatorSchema',
	properties: {
		title: [
			{
				type: 'isDefined',
				message: messages.TITLE_IS_REQUIRED,
			},
		],
		point: [
			{
				type: 'isDefined',
				message: messages.POINT_IS_REQUIRED,
			},
		],
		subjectID: [
			{
				type: 'isDefined',
				message: messages.SUBJECT_IS_REQUIRED,
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
