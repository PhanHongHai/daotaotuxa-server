import * as mongooes from 'mongoose';
import { Types, Schema } from 'mongoose';
import { IClassDetail } from './classDetail.interface';
import mongoosePaginate from 'mongoose-paginate';

const ClassDetailSchemas = new Schema(
	{
		accountID: {
			type: Types.ObjectId,
			ref: 'accounts',
			required: true,
			
		},
		typeAccount: {
			type: String,
			required: true,
			default: "student"
		},
		classID: {
			type: Types.ObjectId,
			ref: 'classes',
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
ClassDetailSchemas.plugin(mongoosePaginate);
let ClassDeTailModel = mongooes.model<IClassDetail>('classDetails', ClassDetailSchemas);
export default ClassDeTailModel;
