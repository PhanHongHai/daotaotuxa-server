import GroupSubjectModel from './groupSubject.model';
import { ICreateGroupSubject, IUpdateGroupSubject, IGroupSubject } from './groupSubject.interface';
import { Types } from 'mongoose';

class GroupSubjectRepository {
	constructor() {}

	async getAndSearch(keyword: string = '', limit: number = 10, page: number = 1): Promise<IGroupSubject | null | any> {
		const regex = new RegExp(keyword, 'i');
		return GroupSubjectModel.paginate(
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

	async create(data: ICreateGroupSubject): Promise<IGroupSubject | null | any> {
		return GroupSubjectModel.create(data);
	}

	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await GroupSubjectModel.updateOne(
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

	async remove(targetId: string): Promise<Boolean> {
		const isUpdated = await GroupSubjectModel.updateOne(
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
		const isUpdated = await GroupSubjectModel.updateMany(
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

	async getArrSubjectsOfSector(sectorID: Types.ObjectId) {
		return GroupSubjectModel.find({
			sectorID,
			isDeleted: false,
		})
			.populate('subjectID')
			.sort({ createdAt: -1 })
			.select('subjectID');
	}

	async getSubjectOfSector(
		sectorID: Types.ObjectId,
		limit: number = 10,
		page: number = 1,
		keyword: string = '',
		select: string = 'subjectID',
	) {
		const regex = new RegExp(keyword, 'i');
		return GroupSubjectModel.paginate(
			{
				sectorID,
				isDeleted: false,
			},
			{
				populate: [
					{
						path: 'subjectID',
						match: {
							$or: [{ tag: { $regex: regex } }, { name: { $regex: regex } }],
						},
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}
	async getSubjectOfSectorGroupFile(sectorID: string, limit: number = 10, skip: number = 0, keyword: string = '') {
		const regex = new RegExp(keyword, 'i');
		return GroupSubjectModel.aggregate([
			{
				$match: {
					isDeleted: false,
					sectorID: { $eq: Types.ObjectId(sectorID) },
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
					from: 'subjects',
					localField: 'subjectID',
					foreignField: '_id',
					as: 'subject',
				},
			},
			{
				$unwind: '$subject',
			},
			{
				$match: {
					$or: [{ 'subject.tag': { $regex: regex } }, { 'subject.name': { $regex: regex } }],
					'subject.isDeleted': false,
				},
			},
			{
				$lookup: {
					from: 'documents',
					localField: 'subject._id',
					foreignField: 'subjectID',
					as: 'document',
				},
			},
			{
				$project: {
					_id: '$subject._id',
					name: '$subject.name',
					tag: '$subject.tag',
					introduce: '$subject.introduce',
					documents: {
						$filter: {
							input: '$document',
							as: 'document',
							cond: { $eq: ['$$document.isDeleted', false] },
						},
					},
				},
			},
		]);
	}

	async getSubjectOtherOfSector(
		sectorID: Types.ObjectId,
		subjectID: Types.ObjectId,
		limit: number = 10,
		page: number = 1,
		keyword: string = '',
		select: string = 'subjectID',
	) {
		const regex = new RegExp(keyword, 'i');
		return GroupSubjectModel.paginate(
			{
				sectorID,
				isDeleted: false,
				subjectID: { $ne: subjectID },
			},
			{
				populate: [
					{
						path: 'subjectID',
						match: {
							$and: [
								{
									$or: [{ tag: { $regex: regex } }, { name: { $regex: regex } }],
								},
								{
									isDeleted: false,
								},
							],
						},
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}
	async getAll(option: object = {}, limit: number = 10, page: number = 1, keyword: string = '', select: string = '') {
		const regex = new RegExp(keyword, 'i');
		return GroupSubjectModel.paginate(
			{
				...option,
				isDeleted: false,
			},
			{
				populate: [
					{
						path: 'subjectID',
						match: {
							$and: [
								{
									$or: [{ tag: { $regex: regex } }, { name: { $regex: regex } }],
								},
								{
									isDeleted: false,
								},
							],
						},
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}

	async findByOption(option: object, select: string = ''): Promise<IGroupSubject[]> {
		return GroupSubjectModel.find({
			...option,
			isDeleted: false,
		}).select(select);
	}
	/**
	 * get subject by id
	 * @param targetId ObjectId
	 * @param select  string
	 */
	async getById(targetId: string, select: string = ''): Promise<IGroupSubject | null> {
		return GroupSubjectModel.findOne({
			_id: targetId,
			isDeleted: false,
		}).select(select);
	}

	async getByOption(option: object, select: string = ''): Promise<IGroupSubject | null> {
		return GroupSubjectModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
}

export default GroupSubjectRepository;
