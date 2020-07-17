import { ValidationSchema, } from 'class-validator';
import { getMessages } from '../../common/messages/index';
const messages = getMessages('groupSubject', 'vi');
export const CreateGroupSubjectValidatorSchema: ValidationSchema = {
	name: 'CreateGroupSubjectValidatorSchema',
	properties: {
		sectorID: [
			{
				type: 'isDefined',
				message: messages.SUBJECT_ID_IS_REQUIRED,
			},
		],
		subjectID: [
			{
				type: 'isDefined',
				message: messages.SECTOR_ID_IS_REQUIRED,
			},
		],
	},
};

