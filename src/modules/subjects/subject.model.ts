import * as mongoose from 'mongoose';
import { Schema, } from 'mongoose';
import { ISubject } from './subject.inteface';
import mongoosePaginate from 'mongoose-paginate';

const SubjectSchema = new Schema(
	{
		tag: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		introduce: {
			type: String,
			required: false,
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

SubjectSchema.plugin(mongoosePaginate);
const SubjectModel = mongoose.model<ISubject>('subjects', SubjectSchema);
export default SubjectModel;
