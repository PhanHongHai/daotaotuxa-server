import ClassDetailModel from './classDetail.model';
import { IClassDetail, ICreateClassDetail } from './classDetail.interface';
import { Types } from 'mongoose';
import moment from 'moment';

class ClassDetailRepository {
	constructor() {}

	async getAndSearchStudentClass(keyword: string = '', limit: number = 10, page: number = 1, classID: string) {
		let regex = new RegExp(keyword, 'i');
		return await ClassDetailModel.paginate(
			{
				isDeleted: false,
				classID,
				typeAccount: 'student',
			},
			{
				populate: [
					{
						path: 'accountID',
						match: {
							$or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
						},
						select: '-password',
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: 'accountID',
			},
		);
	}

	async getAndSearchStudentOfClassByTeacher(
		keyword: string = '',
		limit: number = 10,
		skip: number = 0,
		classID: string,
	) {
		let regex = new RegExp(keyword, 'i');
		return await ClassDetailModel.aggregate([
			{
				$match: {
					isDeleted: false,
					typeAccount: 'student',
					classID: Types.ObjectId(classID),
				},
			},
			{
				$limit: limit,
			},
			{
				$skip: skip,
			},
			{
				$lookup: {
					from: 'accounts',
					localField: 'accountID',
					foreignField: '_id',
					as: 'account',
				},
			},
			{
				$unwind: '$account',
			},
			{
				$match: {
					$or: [{ 'account.name': { $regex: regex } }, { 'account.email': { $regex: regex } }],
				},
			},
			{
				$lookup: {
					from: 'timekeepings',
					localField: 'account._id',
					foreignField: 'accountID',
					as: 'timeKeeping',
				},
			},
			{
				$project: {
					_id: 0,
					account: '$account',
					totalAttendance: {
						$filter: {
							input: '$timeKeeping',
							as: 'timeKeeping',
							cond: { $eq: ['$$timeKeeping.isDeleted', false] },
						},
					},
				},
			},
		]);
	}

	async create(data: ICreateClassDetail): Promise<IClassDetail | any> {
		return await ClassDetailModel.create(data);
	}
	async createTeacher(data: object): Promise<IClassDetail | any> {
		return await ClassDetailModel.create(data);
	}

	async update(id: string, dataUpdate: any) {
		const isUpdated = await ClassDetailModel.updateOne(
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

	async getAll(limit: number = 12, page: number = 1) {
		return ClassDetailModel.paginate(
			{
				isDeleted: false,
			},
			{
				populate: ['accountID', 'classID'],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	async getManyByOption(limit: number = 10, page: number = 1, option: object) {
		return ClassDetailModel.paginate(
			{
				isDeleted: false,
				...option,
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	// get classDetail no pagination
	async getAllNoPaginate() {
		return ClassDetailModel.find({
			isDeleted: false,
		})
			.populate({
				path: 'accountID',
				match: { role: { $eq: 'employment' } },
			})
			.populate('classID');
	}

	// delete classDeteil: update isdelete = true
	async remove(targetId: Types.ObjectId): Promise<Boolean> {
		const isUpdated = await ClassDetailModel.updateOne(
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
	 * delete many
	 * @param option
	 */
	async removeMany(option: object): Promise<Boolean> {
		const isUpdated = await ClassDetailModel.updateMany(
			{
				...option,
			},
			{ isDeleted: true },
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}

	//get classDetail by AccountID with role: teacher
	async getByAccountIDStudent(targetId: Types.ObjectId, select: string = ''): Promise<IClassDetail | null> {
		return ClassDetailModel.findOne({
			accountID: targetId,
			isDeleted: false,
		})
			.select(select)
			.populate({
				path: 'accountID',
				match: { role: { $eq: 'student' } },
			})
			.populate('classID');
	}

	//get classDetail by ClassID
	async checkExist(accountID: Types.ObjectId, classID: Types.ObjectId): Promise<IClassDetail[] | null> {
		return ClassDetailModel.find({
			$and: [{ accountID }, { classID }],
			isDeleted: false,
		});
	}
	//get classDetail by ClassID
	async findByOption(option: object): Promise<IClassDetail[]> {
		return ClassDetailModel.find({
			...option,
			isDeleted: false,
		}).populate('accountID');
	}
	//get student classDetail by ClassID
	async getStudentsByOption(option: object): Promise<IClassDetail[]> {
		return ClassDetailModel.find({
			...option,
			isDeleted: false,
			typeAccount:'student'
		}).populate({
			path: 'accountID',
			match: { role: { $eq: 'student' } },
		});
	}
	//get classDetail by ClassID
	async getByClassID(targetId: Types.ObjectId, select: string = ''): Promise<IClassDetail | null> {
		return ClassDetailModel.findOne({
			classID: targetId,
			isDeleted: false,
		})
			.select(select)
			.populate('accountID')
			.populate('classID');
	}
	//get classDetail by id
	async getByID(targetId: Types.ObjectId, select: string = ''): Promise<IClassDetail | null> {
		return ClassDetailModel.findOne({
			_id: targetId,
			isDeleted: false,
		}).select(select);
	}

	//get classDetail by option
	async getByOption(option: object, select: string = ''): Promise<IClassDetail | any> {
		return await ClassDetailModel.findOne({
			...option,
			isDeleted: false,
		})
			.select(select)
			.populate('accountID');
	}
	//get classDetail by option
	async getInfoTeacher(classID: Types.ObjectId, select: string = 'accountID'): Promise<IClassDetail | any> {
		return await ClassDetailModel.findOne({
			classID,
			isDeleted: false,
			typeAccount: 'teacher',
		})
			.select(select)
			.populate({
				path: 'accountID',
				select: '-password',
			});
	}

	// analysis classDetail
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCount(option: object): Promise<IClassDetail | any> {
		return await ClassDetailModel.count({
			...option,
			isDeleted: false,
		});
	}

	//get list view by classID
	async getListViewByClassID(targetId: Types.ObjectId, limit: number = 12, page: number = 1) {
		return ClassDetailModel.paginate(
			{
				classID: targetId,
				isDeleted: false,
			},
			{
				populate: ['accountID', 'classID'],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	async reportTotalStudentByTrainingType() {
		const reports = await ClassDetailModel.aggregate([
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$lookup: { from: 'classes', localField: 'classID', foreignField: '_id', as: 'class' },
			},
			{ $unwind: '$class' },
			{
				$lookup: { from: 'trainingsectors', localField: 'class.trainingSectorID', foreignField: '_id', as: 'sector' },
			},
			{ $unwind: '$sector' },
			{
				$group: {
					_id: '$sector.type',
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					key: '$_id',
					total: 1,
				},
			},
		]);
		return reports;
	}

	async reportTotalStudentByTrainingSector() {
		const reports = await ClassDetailModel.aggregate([
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$lookup: { from: 'classes', localField: 'classID', foreignField: '_id', as: 'class' },
			},
			{ $unwind: '$class' },
			{
				$lookup: { from: 'trainingsectors', localField: 'class.trainingSectorID', foreignField: '_id', as: 'sector' },
			},
			{ $unwind: '$sector' },
			{
				$group: {
					_id: '$sector.name',
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					key: '$_id',
					total: 1,
				},
			},
		]);
		return reports;
	}
}

export default ClassDetailRepository;
