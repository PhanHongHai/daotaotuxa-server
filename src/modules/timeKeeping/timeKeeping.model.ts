import * as mongoose from 'mongoose';
import { Schema, Types} from 'mongoose';
import { ITimeKeeping } from './timeKeeping.interface';
import mongoosePaginate from 'mongoose-paginate';

const TimeKeepingSchema = new Schema(
	{
		accountID: {
			type: Types.ObjectId,
			required: true,
		},
		date: {
			type: Date,
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

TimeKeepingSchema.plugin(mongoosePaginate);
const TimeKeepingModel = mongoose.model<ITimeKeeping>('timeKeeping', TimeKeepingSchema);
export default TimeKeepingModel;
