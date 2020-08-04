import PointModel from './point.model';
import { IPoint } from './point.interface';
import { Types } from 'mongoose';
class PointRepository {
	constructor() {}

	/**
	 * create point
	 * @param data
	 */
	async create(data: any): Promise<IPoint | any> {
		return PointModel.create(data);
	}

	/**
	 * update point
	 * @param id point id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await PointModel.updateOne(
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
	 * remove
	 * @param targetId Types.ObjectId
	 */
	async remove(targetId: Types.ObjectId): Promise<Boolean> {
		const isUpdated = await PointModel.updateOne(
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
	 * get exam by id
	 * @param ID
	 */
	async getDetailPointByAccountID(ID: Types.ObjectId, select: String = '') {
		return PointModel.find({ isDeleted: false, accountID: ID })
			.populate('subjectID')
			.select(select);
	}

	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<IPoint | any> {
		return await PointModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
}
export default PointRepository;
