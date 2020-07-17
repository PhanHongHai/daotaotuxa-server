import { Document, Types } from 'mongoose';
export interface IQuestion extends Document {
	_id: Types.ObjectId;
	content: String;
	tag: [String];
	answerA: String;
	answerB: String;
	answerC: String;
	answerD: String;
	answer: String;
	level:Number;
	type:Number;
	isDeleted: Boolean;
	createdAt: Date;
}
export interface ICreateQuestion extends Document {
	content: String;
	tag: [String];
	answerA: String;
	answerB: String;
	answerC: String;
	answerD: String;
	answer: String;
	level:Number;
	type:Number;
}
export interface IUpdateQuestion extends Document {
  content: String;
	tag: [String];
	answerA: String;
	answerB: String;
	answerC: String;
	answerD: String;
	answer: String;
	level:Number;
	type:Number;
}
