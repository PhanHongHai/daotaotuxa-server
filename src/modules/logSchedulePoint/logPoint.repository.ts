import PointModel from './logPoint.model';
import { ILogPoint } from './logPoint.interface';
import { Types } from 'mongoose';
class LogPointRepository {
	constructor() {}

	/**
	 * create log point
	 * @param data
	 */
	async create(data: any): Promise<ILogPoint | any> {
		return PointModel.create(data);
	}

	/**
	 * update log point
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
	async getDetailPointByAccountID(limit: Number = 10, page: Number = 1, ID: Types.ObjectId, select: String = '') {
		return PointModel.paginate(
			{
				isDeleted: false,
				accountID: ID,
			},
			{
				populate: [
					{
						path: 'subjectID',
					},
					{
						path: 'scheduleID',
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}

	/**
	 * get exam by id
	 * @param ID
	 */
	async getLogsByTeacher(
		limit: Number = 10,
		page: Number = 1,
		scheduleID: Types.ObjectId,
		classID: Types.ObjectId,
		select: String = '',
	) {
		return PointModel.paginate(
			{
				isDeleted: false,
				scheduleID,
				classID,
			},
			{
				populate: [
					{
						path: 'subjectID',
					},
					{
						path: 'scheduleID',
					},
					{
						path: 'accountID',
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}

	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<ILogPoint | any> {
		return await PointModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
}
export default LogPointRepository;
