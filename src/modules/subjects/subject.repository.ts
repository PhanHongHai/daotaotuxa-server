import SubjectModel from './subject.model';
import { ICreateSubject, IUpdateSubject, ISubject } from './subject.inteface';
import { Types } from 'mongoose';

class SubjectRepository {
	constructor() {}

	async countNumberSubject(): Promise<number> {
		return SubjectModel.count({ isDeleted: false });
	}

	async getAndSearch(keyword: string = '', limit: number = 10, page: number = 1): Promise<Array<Object> | any> {
		const regex = new RegExp(keyword, 'i');
		return SubjectModel.paginate(
			{
				isDeleted: false,
				$or: [{ name: { $regex: regex } }, { tag: { $regex: regex } }],
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	//
	async getAndSearchSubjectGroupDocument(
		keyword: string = '',
		limit: number = 10,
		skip: number = 0,
	): Promise<Array<Object> | any> {
		const regex = new RegExp(keyword, 'i');
		return SubjectModel.aggregate([
			{
				$match: {
					isDeleted: false,
					$or: [{ name: { $regex: regex } }, { tag: { $regex: regex } }],
				},
			},
			{ $limit: limit },
			{ $skip: skip },
			{
				$lookup: {
					from: 'documents',
					localField: '_id',
					foreignField: 'subjectID',
					as: 'documents',
				},
			},
			{
				$project: {
					_id: 1,
					tag: 1,
					name: 1,
					introduce: 1,
					myCount: 1,
					documents: {
						$filter: {
							input: '$documents',
							as: 'documents',
							cond: {
								$eq: ['$$documents.isDeleted', false],
							},
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					tag: 1,
					name: 1,
					introduce: 1,
					myCount: 1,
					totalFile: {
						$size: '$documents',
					},
				},
			},
		]);
	}
	async create(data: ICreateSubject): Promise<ISubject | null | any> {
		return SubjectModel.create(data);
	}

	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await SubjectModel.updateOne(
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
	 * update many account
	 * @param id object ID
	 * @param dataUpdate object
	 */
	async updateMany(option: object, dataUpdate: object): Promise<ISubject | null | any> {
		const isUpdated = await SubjectModel.updateMany(
			{
				...option,
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

	async getAll() {
		return SubjectModel.find({ isDeleted: false }).sort({ createdAt: -1 });
	}

	async getAllByOption(data: any = {}, keyword: string = '', limit: number = 12, page: number = 1) {
		const regex = new RegExp(keyword, 'i');
		return SubjectModel.paginate(
			{
				isDeleted: false,
				...data,
				$or: [{ tag: { $regex: regex } }, { name: { $regex: regex } }],
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	async remove(targetId: string): Promise<Boolean> {
		const isUpdated = await SubjectModel.updateMany(
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
		const isUpdated = await SubjectModel.updateMany(
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

	/**
	 * get subject by id
	 * @param targetId ObjectId
	 * @param select  string
	 */
	async getById(targetId: string, select: string = ''): Promise<ISubject | null> {
		return SubjectModel.findOne({
			_id: targetId,
			isDeleted: false,
		}).select(select);
	}

	async getByOption(option: object, select: string = ''): Promise<ISubject | null> {
		return SubjectModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}

	/**
	 * search Training Sector by keyword: name or status
	 * @param limit
	 * @param page
	 * @param keyword
	 */
	async search(
		keyword: string = '',
		option: object = {},
		limit: number = 10,
		page: number = 1,
	): Promise<ISubject | null | any> {
		const regex = new RegExp(keyword, 'i');
		return SubjectModel.paginate(
			{
				...option,
				isDeleted: false,
				title: { $regex: regex },
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	// analysis Subject
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCount(option: object): Promise<ISubject | any> {
		return await SubjectModel.count({
			...option,
			isDeleted: false,
		});
	}
}

export default SubjectRepository;
