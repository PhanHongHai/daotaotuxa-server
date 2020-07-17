import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('subjectProgress', 'vi');
export const CreateSubjectProgressValidatorSchema: ValidationSchema = {
	name: 'CreateSubjectProgressValidatorSchema',
	properties: {
		// accountID: [
		// 	{
		// 		type: 'isDefined',
		// 		constraints: [true],
		// 		message: messages.ACCOUNT_ID_IS_REQUIRED,
		// 	},
		// ],
		subjectID: [
			{
				type: 'isDefined',
				constraints: [true],
				message: messages.SUBJECT_IS_REQUIRED,
			},
		],
		documents: [
			{
				type: 'isDefined',
				constraints: [true],
				message: messages.DOCUMENTS_IS_REQUIRED,
			},
		],
		progress: [
			{
				type: 'isDefined',
				constraints: [true],
				message: messages.PROGRESS_IS_REQUIRED,
			},
			{
				type: 'min',
				constraints: [0],
				message: messages.PROGRESS_MIN_IS_0,
			},
			{
				type: 'max',
				constraints: [100],
				message: messages.PROGRESS_MAX_IS_100,
			},
		],
	},
};
