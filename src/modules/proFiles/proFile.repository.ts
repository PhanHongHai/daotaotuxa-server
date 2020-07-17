import ProFileModel from './proFile.model';
import { IProFile, ICreateProFile, IUpdateProFile } from './proFile.interface';
import { Types } from 'mongoose';
class ProFileRepository {
	constructor() {}

	/**
	 * create profile
	 * @param data
	 */
	async create(data: any): Promise<IProFile | any> {
		return ProFileModel.create(data);
	}

	/**
	 * update profile
	 * @param id account id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await ProFileModel.updateOne(
			{
				_id:id,
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
		const isUpdated = await ProFileModel.updateOne(
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
	 * get all proFile
	 * @param data
	 * @param limit
	 * @param page
	 */

	async getAll(data: any = {}, limit: Number = 10, page: Number = 1) {
		return ProFileModel.paginate(
			{
				isDeleted: false,
				...data,
			},
			{
				populate: 'accountID',
				sort: { createAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	/**
	 * get profile by student id
	 * @param ID
	 */
	async getProfileByStudentID(ID: Number) {
		return ProFileModel.find({
			isDeleted: false,
			accountID: ID,
		}).select('-path');
	}

	/**
	 * get profile
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<IProFile | any> {
		return await ProFileModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
	/**
	 * remove profile by option
	 * @param profileID
	 */
	async deleteProFile(option: Object): Promise<Boolean> {
		const isUpdated = await ProFileModel.updateOne(
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
}
export default ProFileRepository;
