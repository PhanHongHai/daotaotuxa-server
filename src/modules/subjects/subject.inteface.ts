import { Document, } from 'mongoose';
export interface ISubject extends Document {
	tag: String;
	name: String;
	introduce: String;
	createdAt: Date;
	isDeleted: Boolean;
}

export interface ICreateSubject extends Document {
	tag: String;
	name: String;
	introduce: String;
	isDeleted: Boolean;
}
export interface IUpdateSubject extends Document {
	tag: String;
	name: String;
	introduce: String;
	isDeleted: Boolean;
}
