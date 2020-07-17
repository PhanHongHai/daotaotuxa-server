import { Types, Document, Schema } from 'mongoose';
export interface IClass extends Document {
    _id:Types.ObjectId,
    trainingSectorID:Types.ObjectId,
    name:String,
    startAt:Date,
    endtAt:Date,
    status:String,
    isDeleted:Boolean,
    createdAt: Date,
    updatedAt:Date
}

export interface ICreateClass extends Document {
    trainingSectorID:Types.ObjectId,
    name:String,
    startAt:Date,
    endtAt:Date,
    status:String,
    isDeleted:Boolean
}
export interface IUpdateClass extends Document {
    trainingSectorID:Types.ObjectId,
    name:String,
    startAt:Date,
    endtAt:Date,
    status:String,
    isDeleted:Boolean
}
export interface IGetReportTotalOptions {
	from: Date,
	to: Date,
	groupType: 'hour' | 'date',
  }