import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('point', 'vi');
export const CaculatorPointValidatorSchema: ValidationSchema = {
	name: 'CaculatorPointValidatorSchema',
	properties: {
		scheduleID: [
			{
				type: 'isDefined',
				message: messages.SCHEDULE_ID_IS_REQUIRED,
			},
		],
		examID: [
			{
				type: 'isDefined',
				message: messages.EXAM_ID_IS_REQUIRED,
			},
		],
		subjectID: [
			{
				type: 'isDefined',
				message: messages.SUBJECTT_ID_IS_REQUIRED,
			},
		],
		answers: [
			{
				type: 'isDefined',
				message: messages.ANSWER_ID_IS_REQUIRED,
			},
		],
	},
};
