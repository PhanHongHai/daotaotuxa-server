import { Document, Types } from 'mongoose';
export interface IPoint extends Document {
	_id: Types.ObjectId;
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	pointLast: number;
	pointMiddle: number;
	pointTotal: number;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreatePoint extends Document {
	subjectID: Types.ObjectId;
	accountID: Types.ObjectId;
	scheduleID: Types.ObjectId;
	pointLast: number;
	pointMiddle: number;
	pointTotal: number;
}

export interface IUpdatePoint extends Document {
	pointMiddle: number;
}

export interface ISubmitTask extends Document {
	scheduleID: Types.ObjectId;
	examID: Types.ObjectId;
	subjectID: Types.ObjectId;
	answers: object[];
}
