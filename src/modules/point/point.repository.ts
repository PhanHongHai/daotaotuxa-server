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
	 * get points of subject by class
	 * @param ID
	 */
	async getPointAllOfClassBySubjectIDAndClassID(option: object = {}) {
		return PointModel.find({
			isDeleted: false,
			...option,
		})
			.populate('accountID')
			.sort({ createdAt: -1 });
	}
	/**
	 * get points of subject by class
	 * @param ID
	 */
	async getPointsOfClassByTeacher(limit: Number = 10, page: Number = 1, option: object = {}, select: String = '') {
		return PointModel.paginate(
			{
				isDeleted: false,
				...option,
			},
			{
				populate: [
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
	 * get points by class
	 * @param ID
	 */
	async getPointAllOfClass(limit: Number = 10, skip: Number = 0, accountArr: Types.ObjectId[] = []) {
		return PointModel.aggregate([
			{
				$match: {
					isDeleted: false,
					accountID: {
						$in: accountArr,
					},
				},
			},
			{ $skip: skip },
			{ $limit: limit },
			{
				$lookup: {
					from: 'accounts',
					localField: 'accountID',
					foreignField: '_id',
					as: 'accounts',
				},
			},
			{
				$lookup: {
					from: 'subjects',
					localField: 'subjectID',
					foreignField: '_id',
					as: 'subject',
				},
			},
			{
				$replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$accounts', 0] }, '$$ROOT'] } },
			},
			{ $project: { accounts: 0 } },
		]);
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
	async getByOption(option: object, select: string = ''): Promise<IPoint | any> {
		return await PointModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}

	/**
	 * find by option
	 * @param option object
	 * @param select string
	 */
	async findByOption(option: object, select: string = ''): Promise<IPoint | any> {
		return await PointModel.find({
			...option,
			isDeleted: false,
		}).select(select);
	}
}
export default PointRepository;
