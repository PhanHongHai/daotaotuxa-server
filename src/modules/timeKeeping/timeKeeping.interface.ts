import {Document, Types} from 'mongoose';

export interface ITimeKeeping extends Document {
    accountID: Types.ObjectId;
    date: String;
    createdAt: Date;
    isDeleted: Boolean;
}
export interface ICreateTimeKeeping extends Document {
    date: Date;
}