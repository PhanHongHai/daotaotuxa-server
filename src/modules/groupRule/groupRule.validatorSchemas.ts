import { ValidationSchema, IsBoolean } from 'class-validator';
import { getMessages } from '../../common/messages/index';
const messages = getMessages('groupRule', 'vi');
export const CreateAndUpdateGroupRuleValidatorSchema: ValidationSchema = {
	name: 'CreateGroupRuleValidatorSchema',
	properties: {
		accountID: [
			{
				type: 'isDefined',
				message: messages.ACCOUNT_ID_IS_REQUIRED,
			},
		],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		READ: [
			{
				type: 'isBoolean',
				constraints: [IsBoolean],
				message: messages.VALUE_INVAILD,
			},
		],
		WRITE: [
			{
				type: 'isBoolean',
				constraints: [IsBoolean],
				message: messages.VALUE_INVAILD,
			},
		],
		
	},
};

