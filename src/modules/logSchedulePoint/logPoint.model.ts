import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { ILogPoint } from './logPoint.interface';
import mongoosePaginate from 'mongoose-paginate';
const LogPointSchemas = new Schema(
	{
		result: {
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
		scheduleID: {
			type: Types.ObjectId,
			ref: 'schedules',
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

LogPointSchemas.plugin(mongoosePaginate);
const LogPointModel = mongoose.model<ILogPoint>('logPoints', LogPointSchemas);
export default LogPointModel;
