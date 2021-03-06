import { Document, Types } from 'mongoose';
export interface IExam extends Document {
	_id: Types.ObjectId;
	title: String;
	questions: [Types.ObjectId];
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateExam extends Document {
	title: String;
	questions: [Types.ObjectId];
}

export interface ICreateExamAuto extends Document {
	title: String;
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
}

export interface IUpdateExam extends Document {
	title: String;
	questions: [Types.ObjectId];
}
