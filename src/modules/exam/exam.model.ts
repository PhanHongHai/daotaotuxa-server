import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { IExam } from './exam.interface';
import mongoosePaginate from 'mongoose-paginate';
const ExamSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		point: {
			type: Number,
			required: true,
		},
		subjectID: {
			type: Types.ObjectId,
			ref: 'subjects',
			required: true,
		},
		questions: [
			{
				type: Types.ObjectId,
				ref: 'questions',
				required: true,
			},
		],
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

ExamSchema.plugin(mongoosePaginate);
const ExamModel = mongoose.model<IExam>('exams', ExamSchema);
export default ExamModel;
