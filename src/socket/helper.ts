import _ from 'lodash';
import { Types } from 'mongoose';
import { client } from './interface';

export const pushIDtoArray = (arrUser: client[], socketID: string, userID: Types.ObjectId) => {
	arrUser.push({ userID, socketID });
	return arrUser;
};
export const removeIDfromArray = (arrUser: client[], socketID: string, userID: Types.ObjectId) => {
	_.remove(arrUser, ele => ele.socketID == socketID && ele.userID == userID);
	return arrUser;
};

export const checkClientExist = (arrUser: client[], userID: Types.ObjectId) => {
	let checkExist = _.find(arrUser, ele =>  ele.userID == userID);
	if (checkExist) return true;
	return false;
};
