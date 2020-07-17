import { Types, Document } from 'mongoose';
export interface ITrainingSector extends Document {
    _id:Types.ObjectId,
    name:String,
    type:String,
    isDeleted:Boolean,
    createdAt: Date,
    updatedAt:Date
}

export interface ICreateITrainingSector extends Document {
    name:String,
    type:String,
    isDeleted:Boolean
}
export interface IUpdateITrainingSector extends Document {
    name:String,
    type:String,
    isDeleted:Boolean
}
export interface IGetReportTotalOptions {
	from: Date,
	to: Date,
	groupType: 'hour' | 'date',
  }