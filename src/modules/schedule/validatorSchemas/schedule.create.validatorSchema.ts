import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('proFile', 'vi');
export const CreateScheduleValidatorSchema: ValidationSchema = {
	name: 'CreateScheduleValidatorSchema',
	properties: {
		title: [
			{
				type: 'isDefined',
				message: messages.TITLE_IS_REQUIRED,
			},
		],
		classes: [
			{
				type: 'isDefined',
				message: messages.CLASSES_IS_REQUIRED,
			},
		],
		dayAt: [
			{
				type: 'isDefined',
				message: messages.DAY_AT_IS_REQUIRED,
			},
		],
		timeAt: [
			{
				type: 'isDefined',
				message: messages.TIME_AT_IS_REQUIRED,
			},
		],
		timeRange: [
			{
				type: 'isDefined',
				message: messages.TIME_RANGE_IS_REQUIRED,
			},
		],
		subjectID: [
			{
				type: 'isDefined',
				message: messages.SUBJECT_IS_REQUIRED,
			},
		],
		trainingSectorID: [
			{
				type: 'isDefined',
				message: messages.SECTOR_IS_REQUIRED,
			},
		],
		examID: [
			{
				type: 'isDefined',
				message: messages.EXAM_IS_REQUIRED,
			},
		],
	},
};
