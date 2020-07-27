import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import mongoosePagination from 'mongoose-paginate';
import { IDocument } from './document.interface';

const DocumentSchemas = new Schema(
	{
		subjectID: {
			type: Types.ObjectId,
			ref: 'subjects',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		// typeFile: {
		// 	type: String,
		// 	required: true,
		// },
		isDeleted: {
			type: Boolean,
			default: false,
			require: true,
		},
	},
	{
		timestamps: true,
	},
);
DocumentSchemas.plugin(mongoosePagination);
const DocumentModel = mongoose.model<IDocument>('document', DocumentSchemas);
export default DocumentModel;
