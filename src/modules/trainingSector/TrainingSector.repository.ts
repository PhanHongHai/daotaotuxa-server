import TrainingSectorModel from './trainingSector.model';
import { ITrainingSector, ICreateITrainingSector, IGetReportTotalOptions } from './trainingSector.interface';
import { Types } from 'mongoose';
import moment from 'moment';

class TrainingSectorRepository {
	constructor() {}

	// count number sector
	async countNumberSector(): Promise<number> {
		return await TrainingSectorModel.count({ isDeleted: false });
	}

	async create(data: ICreateITrainingSector): Promise<ITrainingSector | null | any> {
		return TrainingSectorModel.create(data);
	}

	async update(id: string, dataUpdate: any) {
		const isUpdated = await TrainingSectorModel.updateOne(
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

	async getAll() {
		return TrainingSectorModel.find({
			isDeleted: false,
		});
	}

	async remove(targetId: string): Promise<Boolean> {
		const isUpdated = await TrainingSectorModel.updateMany(
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
	async existNameInType(targetType: String, name: String, select: string = ''): Promise<ITrainingSector | null> {
		return TrainingSectorModel.findOne({
			type: targetType,
			name,
			isDeleted: false,
		}).select(select);
	}

	async existType(targetType: string): Promise<ITrainingSector | null> {
		return TrainingSectorModel.findOne({
			isDeleted: false,
			type: targetType,
		});
	}

	/**
	 * Get Training Sector By Option
	 * @param option objec
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<ITrainingSector | null> {
		return TrainingSectorModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}

	async getById(targetId: Types.ObjectId, select: string = ''): Promise<ITrainingSector | null> {
		return TrainingSectorModel.findOne({
			_id: targetId,
			isDeleted: false,
		}).select(select);
	}
	/**
	 * search Training Sector by keyword: name or status
	 * @param limit
	 * @param page
	 * @param keyword
	 */
	async search(keyword: string = '', limit: number = 12, page: number = 1): Promise<ITrainingSector | null | any> {
		const regex = new RegExp(keyword, 'i');
		return TrainingSectorModel.paginate(
			{
				isDeleted: false,
				$or: [{ name: { $regex: regex } }, { type: { $regex: regex } }],
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	// analysis TrainingSector
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCount(option: object): Promise<ITrainingSector | any> {
		return await TrainingSectorModel.count({
			...option,
			isDeleted: false,
		});
	}


}

export default TrainingSectorRepository;
