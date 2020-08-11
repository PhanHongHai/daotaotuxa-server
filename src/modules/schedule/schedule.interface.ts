import { Document, Types } from 'mongoose';

export interface ISchedule extends Document {
	_id: Types.ObjectId;
	title: String;
	type: String;
	classes: [Types.ObjectId];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	subjectID: Types.ObjectId;
	trainingSectorID: Types.ObjectId;
	examID: Types.ObjectId;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateSchedule extends Document {
	title: String;
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	subjectID: Types.ObjectId;
	trainingSectorID: Types.ObjectId;
	examID: Types.ObjectId;
}
export interface IUpdateSchedule extends Document {
	title: String;
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	examID: Types.ObjectId;
}
