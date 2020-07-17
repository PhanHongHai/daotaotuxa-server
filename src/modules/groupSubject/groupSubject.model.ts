import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { IGroupSubject } from './groupSubject.interface';
import mongoosePaginate from 'mongoose-paginate';

const GroupSubjectSchema = new Schema(
	{
		subjectID: {
			type: Types.ObjectId,
			ref: "subjects",
			required: true,
		},
		sectorID: {
			type: Types.ObjectId,
			ref: "trainingSectors",
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

GroupSubjectSchema.plugin(mongoosePaginate);
const GroupSubjectModel = mongoose.model<IGroupSubject>('groupsubjects', GroupSubjectSchema);
export default GroupSubjectModel;
