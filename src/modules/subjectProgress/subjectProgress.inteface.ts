import { Document, Types} from 'mongoose';
export interface ISubjectProgress extends Document {
	accountID: String;
	subjectID: String;
	documents: [Types.ObjectId];
	progress: String;
	createdAt: Date;
	isDeleted: Boolean;
}

export interface ICreateSubjectProgress extends Document {
  accountID: String;
	subjectID: String;
	documents: [Types.ObjectId];
	progress: String;
}
