import { Document, Types } from 'mongoose';
export interface ILogPoint extends Document {
	_id: Types.ObjectId;
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	pointTotal: number;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateLogPoint extends Document {
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	pointTotal: number;
}

