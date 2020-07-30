import { Types } from 'mongoose';

export interface client {
	userID: Types.ObjectId;
	socketID: string;
}
