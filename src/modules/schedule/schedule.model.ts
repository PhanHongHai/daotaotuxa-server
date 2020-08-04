import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { ISchedule } from './schedule.interface';
import mongoosePaginate from 'mongoose-paginate';
const ScheduleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		type: {
			type: Number,
			required: true,
		},
		classes: [
			{
				type: Types.ObjectId,
				ref: 'classes',
				required: true,
			},
		],
		dayAt: {
			type: Date,
			required: true,
		},
		timeAt: {
			type: Date,
			required: true,
		},
		timeRange: {
			type: Number,
			required: true,
		},
		subjectID: {
			type: Types.ObjectId,
			ref: 'subjects',
			required: true,
		},
		trainingSectorID: {
			type: Types.ObjectId,
			ref: 'trainingSectors',
			required: true,
		},
		examID: {
			type: Types.ObjectId,
			ref: 'exams',
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

ScheduleSchema.plugin(mongoosePaginate);
const ScheduleModel = mongoose.model<ISchedule>('schedules', ScheduleSchema);
export default ScheduleModel;
