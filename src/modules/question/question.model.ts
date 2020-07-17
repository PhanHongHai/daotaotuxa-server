import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IQuestion } from './question.interface';
import mongoosePaginate from 'mongoose-paginate';
const QuestionSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		tag: {
			type: [String],
			required: false,
		},
		answerA: {
			type: String,
			required: true,
		},
		answerB: {
			type: String,
			required: true,
		},
		answerC: {
			type: String,
			required: true,
		},
		answerD: {
			type: String,
			required: true,
		},
		answer: {
			type: String,
			required: true,
		},
		level: {
			type: Number,
			required: true,
		},
		type: {
			type: Number,
			default: 1,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

QuestionSchema.plugin(mongoosePaginate);
const QuestionModel = mongoose.model<IQuestion>('questions', QuestionSchema);
export default QuestionModel;
