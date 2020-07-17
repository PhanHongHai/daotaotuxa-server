import * as mongoose from 'mongoose';
import { Schema,Types } from 'mongoose';
import { ISubjectProgress } from './subjectProgress.inteface';
import mongoosePaginate from 'mongoose-paginate';

const SubjectProgressSchema = new Schema(
	{
		accountID: {
      type: Types.ObjectId,
      ref: 'accounts',
			required: true,
		},
		subjectID: {
			type: Types.ObjectId,
			ref: 'subjects',
			required: true,
    },
    documents: [
			{
				type: Types.ObjectId,
				ref: 'document',
				required: true,
			},
		],
		progress: {
			type: Number,
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

SubjectProgressSchema.plugin(mongoosePaginate);
const SubjectProgressModel = mongoose.model<ISubjectProgress>('subjectProgress', SubjectProgressSchema);
export default SubjectProgressModel;
