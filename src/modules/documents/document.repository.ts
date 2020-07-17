import DocumentModel from './document.model';
import { IDocument, ICreateDocument } from './document.interface';
import { Types } from 'mongoose';

class DocumentRepository {
	constructor() {}

	// count number lesson
	async countNumberLesson(): Promise<number> {
		return await DocumentModel.count({ isDeleted: false, type: 'MH' });
	}
	/**
	 * Create
	 * @param data any
	 */
	async create(data: any): Promise<ICreateDocument | any> {
		return DocumentModel.create(data);
	}

	/**
	 * Update
	 * @param id Types.ObjectId
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await DocumentModel.updateOne(
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
	 * Remove
	 * @param targetID Types.ObjectId
	 */
	async remove(targetID: Types.ObjectId): Promise<Boolean> {
		const isUpdated = await DocumentModel.updateOne(
			{
				_id: targetID,
			},
			{
				isDeleted: true,
			},
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
		const isUpdated = await DocumentModel.updateMany(
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
	 * get all by option
	 * @param data any
	 * @param limit number
	 * @param page number
	 */
	async getAll(data: any = {}, keyword: string = '', limit: number = 10, page: number = 1) {
		const regex = new RegExp(keyword, 'i');
		return DocumentModel.paginate(
			{
				...data,
				isDeleted: false,
				title: { $regex: regex },
			},
			{
				sort: { createAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	async getCount(option: object): Promise<IDocument | any> {
		return await DocumentModel.count({
			...option,
			isDeleted: false,
		});
	}

	/**
	 * get by option
	 * @param option object
	 * @param select String
	 */
	async getByOption(option: object, select: String = ''): Promise<IDocument | null> {
		return await DocumentModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
}
export default DocumentRepository;
