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
	type: number;
	subjectID: Types.ObjectId;
	trainingSectorID: Types.ObjectId;
	examID: Types.ObjectId;
}
export interface ICreateScheduleByStudent extends Document {
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	type: number;
	subjectID: Types.ObjectId;
	trainingSectorID: Types.ObjectId;
	level1: {
		type: Number;
		number: Number;
	};
	level2: {
		type: Number;
		number: Number;
	};
	level3: {
		type: Number;
		number: Number;
	};
	level4: {
		type: Number;
		number: Number;
	};
	point: Number;
	number: Number;
}
export interface IUpdateSchedule extends Document {
	title: String;
	classes: [String];
	dayAt: Date;
	timeAt: Date;
	timeRange: number;
	examID: Types.ObjectId;
}
