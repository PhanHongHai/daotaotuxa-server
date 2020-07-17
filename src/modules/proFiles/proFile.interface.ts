import {Document, Types} from 'mongoose';
export interface IProFile extends Document {
    _id: Types.ObjectId;
    accountID: Types.ObjectId;
    path: string;
    url:string;
    title:string;
    isDeleted: Boolean;
    createdAt: Date;
}
export interface ICreateProFile extends Document {
    accountID: Types.ObjectId;
    path: string;
    url:string;
    title:string;
}
export interface IUpdateProFile extends Document {
    title:string;
    path: string;
    url:string;
}
