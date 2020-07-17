import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
import { mongo, Mongoose, Types } from 'mongoose';
const messages = getMessages('classDetail', 'vi');
export const ClassDetailValidatorSchema: ValidationSchema = {
  name: 'ClassDetailValidatorSchema',
  properties: {
      accountID:[
        {
          type:'isDefined',
          constraints:[true],
          message: messages.ACCOUNT_ID_IS_REQUIRED 
        }
      ],
      classID:[
        {
          type: 'isDefined',
          constraints:[true],
          message: messages.CLASS_ID_IS_REQUIRED
        }
      ]
    
  }
};
