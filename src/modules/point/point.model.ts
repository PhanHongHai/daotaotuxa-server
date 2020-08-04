import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { IPoint } from './point.interface';
import mongoosePaginate from 'mongoose-paginate';
const PointSchema = new Schema(
	{
		pointMiddle: {
			type: Number,
			required: true,
			default: 0,
		},
		pointLast: {
			type: Number,
			required: true,
			default: 0,
		},
		pointTotal: {
			type: Number,
			required: true,
			default: 0,
		},
		subjectID: {
			type: Types.ObjectId,
			ref: 'subjects',
			required: true,
		},
		accountID: {
			type: Types.ObjectId,
			ref: 'accounts',
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

PointSchema.plugin(mongoosePaginate);
const PointModel = mongoose.model<IPoint>('points', PointSchema);
export default PointModel;
