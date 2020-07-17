import { Types, Document } from 'mongoose';

export interface IGroupRule extends Document {
	_id: Types.ObjectId;
	accountID: Types.ObjectId;
	name: Types.ObjectId;
	READ: Boolean;
	WRITE: Boolean;
	isDeleted: Boolean;
}

export interface ICreateGroupRule extends Document {
	accountID: Types.ObjectId;
	name: Types.ObjectId;
	READ: Boolean;
	WRITE: Boolean;
	isDeleted: Boolean;
}
