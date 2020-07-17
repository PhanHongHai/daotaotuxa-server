import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
import { mongo, Mongoose, Types } from 'mongoose';
const messages = getMessages('trainingSector', 'vi');
export const CreateClassValidatorSchema: ValidationSchema = {
  name: 'CreateClassValidatorSchema',
  properties: {
    name: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.NAME_IS_REQUIRED
      }
    ],
    startAt: [
     
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.STARTAT_IS_REQUIRED
      },
     
    ],
    endAt: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.ENDAT_IS_REQUIRED
      },
    ],
    trainingSectorID: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.TRAININGSECTOR_IS_REQUIRED
      },
    ],
  }
};
