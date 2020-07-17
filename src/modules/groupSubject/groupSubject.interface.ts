import { Document, Types, } from 'mongoose';
export interface IGroupSubject extends Document {
	subjectID: Types.ObjectId;
	sectorID: Types.ObjectId;
	createdAt: Date;
	isDeleted: Boolean;
}

export interface ICreateGroupSubject extends Document {
	subjectID: Types.ObjectId;
	sectorID: Types.ObjectId;
}
export interface IUpdateGroupSubject extends Document {
	subjectID: Types.ObjectId;
	sectorID: Types.ObjectId;
	isDeleted: Boolean;
}
