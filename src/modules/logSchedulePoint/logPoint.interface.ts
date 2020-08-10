import { Document, Types } from 'mongoose';
export interface ILogPoint extends Document {
	_id: Types.ObjectId;
	classID: Types.ObjectId;
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	result: number;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateLogPoint extends Document {
	classID: Types.ObjectId;
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	result: number;
}

