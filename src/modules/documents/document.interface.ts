import {Document, Types} from 'mongoose';
export interface IDocument extends Document{
    _id: Types.ObjectId;
    subjectID: Types.ObjectId;
    title:string;
    path: string;
    url: string;
    size: string;
    type: string;
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

}
export interface IUpdateDocument extends Document{
    subjectID: Types.ObjectId;
    title:string;
    path: string;
    url: string;
    size: string;
}