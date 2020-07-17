import * as mongoose from 'mongoose';

import { Schema, Types } from 'mongoose';
import { IGroupRule } from './groupRule.interface';
import mongoosePaginate from 'mongoose-paginate';

const GroupRuleSchema = new Schema({
	accountID: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'accounts',
	},
	name: {
		type: String,
		required: true,
		ref: 'rules',
	},
	READ: {
		type: Boolean,
		required: false,
		default: false,
	},
	WRITE: {
		type: Boolean,
		required: false,
		default: false,
	},
	
});

GroupRuleSchema.plugin(mongoosePaginate);
const GroupRuleModel = mongoose.model<IGroupRule>('groupRules', GroupRuleSchema);
export default GroupRuleModel;
