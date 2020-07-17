import { Document, Types } from 'mongoose';

export interface ISchedule extends Document {
	_id: Types.ObjectId;
	title: String;
	classes: [Types.ObjectId];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	subjectID: String;
	trainingSectorID: String;
	examID: String;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateSchedule extends Document {
	title: String;
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	subjectID: String;
	trainingSectorID: String;
	examID: String;
}
export interface IUpdateSchedule extends Document {
	title: String;
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	examID: String;
}
