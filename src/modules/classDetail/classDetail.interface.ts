import { Types, Document,  } from 'mongoose';
export interface IClassDetail extends Document{
    _id : Types.ObjectId,
    accountID : Types.ObjectId,
    typeAccount: String,
    classID : Types.ObjectId,
    createdAt: Date,
    updateAt: Date,
    isDeleted:Boolean,
}
export interface ICreateClassDetail extends Document{
    accountID:Types.ObjectId,
    classID : Types.ObjectId,
    typeAccount: String,
}
