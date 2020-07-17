import * as mongoose from 'mongoose';
import { Types, Schema } from 'mongoose';
import { IClass } from './class.interface';
import mongoosePaginate from 'mongoose-paginate';

const ClassSchemas = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		trainingSectorID: {
			type: Types.ObjectId,
			ref: 'trainingSectors',
			required: true,
		},
		startAt: {
			type: Date,
			required: true,
		},
		endAt: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
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

ClassSchemas.plugin(mongoosePaginate);
const ClassModel = mongoose.model<IClass>('classes', ClassSchemas);
export default ClassModel;
