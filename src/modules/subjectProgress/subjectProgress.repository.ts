import subjectProgressModel from './subjectProgress.model';
import { ISubjectProgress } from './subjectProgress.inteface';
import { Types } from 'mongoose';

class ScheduleRepository {
	constructor() {}

	/**
	 * create subject progress
	 * @param data
	 */
	async create(data: any): Promise<ISubjectProgress | any> {
		return subjectProgressModel.create(data);
	}

	/**
	 * update subject progress
	 * @param id account id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await subjectProgressModel.updateOne(
			{
				_id: id,
			},
			{
				...dataUpdate,
			},
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}

	/**
	 * remove subject progress
	 * @param targetId Types.ObjectId
	 */
	async remove(targetId: Types.ObjectId): Promise<Boolean> {
		const isUpdated = await subjectProgressModel.updateOne(
			{
				_id: targetId,
			},
			{ isDeleted: true },
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}

	/**
	 * get subject progress by subject id & accountID
	 * @param ID
	 */
	async getDetailProgress(subjectID: Types.ObjectId, accountID: Types.ObjectId) {
		return subjectProgressModel
			.findOne({
				isDeleted: false,
				subjectID,
				accountID,
			})
			.populate('documents')
			.select('-accountID');
	}

	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByAccountID(accountID: Types.ObjectId, select: string = ''): Promise<ISubjectProgress | any> {
		return await subjectProgressModel
			.find({
				accountID,
				isDeleted: false,
			})
			.populate('subjectID')
			.select(select);
	}
	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<ISubjectProgress | any> {
		return await subjectProgressModel
			.findOne({
				...option,
				isDeleted: false,
			})
			.select(select);
	}
	/**
	 * get many by option
	 * @param option object
	 * @param select string
	 */
	async getManyByOption(option: object, select: string = ''): Promise<ISubjectProgress | any> {
		return await subjectProgressModel
			.find({
				...option,
				isDeleted: false,
			})
			.select(select);
	}
}
export default ScheduleRepository;
