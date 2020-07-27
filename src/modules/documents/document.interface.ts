import {Document, Types} from 'mongoose';
export interface IDocument extends Document{
    _id: Types.ObjectId;
    subjectID: Types.ObjectId;
    title:string;
    path: string;
    url: string;
    size: string;
    type: string;
    typeFile: string;
    isDeleted: Boolean;
    createsAt: Date;
}
export interface ICreateDocument extends Document{
    subjectID: Types.ObjectId;
    title:string;
    path: string;
    url: string;
    size: string;
    type: string;
    typeFile: string;
}
export interface IUpdateDocument extends Document{
    subjectID: Types.ObjectId;
    title:string;
    path: string;
    url: string;
    size: string;
    typeFile: string;
}