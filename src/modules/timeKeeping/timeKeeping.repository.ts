import TimeKeepingModel from './timeKeeping.model';
import { ITimeKeeping, ICreateTimeKeeping } from './timeKeeping.interface';
import { Types } from 'mongoose';

class TimeKeepingRepository {
	constructor() {}

	async getTimeKeepingByAccountID(targetId: Types.ObjectId): Promise<ITimeKeeping | null | any> {
		return TimeKeepingModel.find({
			accountID: targetId,
			isDeleted: false,
		}).select('date');
	}

	async countByOption(otpions: object): Promise<Number | any> {
		return TimeKeepingModel.count({
			...otpions,
			isDeleted: false,
		});
	}

	async getByOption(option: object, select: string = ''): Promise<ITimeKeeping | null> {
		return TimeKeepingModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
	async create(data: object): Promise<ITimeKeeping | null | any> {
		return TimeKeepingModel.create(data);
	}
}

export default TimeKeepingRepository;
