import ScheduleModel from './schedule.model';
import { ISchedule } from './schedule.interface';
import { Types } from 'mongoose';

class ScheduleRepository {
	constructor() {}

	/**
	 * create schedule
	 * @param data
	 */
	async create(data: any): Promise<ISchedule | any> {
		return ScheduleModel.create(data);
	}

	/**
	 * update schedule
	 * @param id account id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await ScheduleModel.updateOne(
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
		const isUpdated = await ScheduleModel.updateOne(
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
	 * get  schedule list
	 * @param data
	 * @param limit
	 * @param page
	 */

	async getAndSearch(limit: Number = 10, page: Number = 1, keyword: string = '', data: any = {}) {
		const regex = new RegExp(keyword, 'i');
		return ScheduleModel.paginate(
			{
				isDeleted: false,
				title: { $regex: regex },
				...data,
			},
			{
				populate: [
					{
						path: 'subjectID',
					},
					{
						path: 'classes',
					},
					{
						path: 'trainingSectorID',
					},
				],
				sort: { dayAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	/**
	 * get  schedule list with page limit
	 * @param data
	 * @param limit
	 * @param page
	 */

	async getAndSearchScheduleByOption(limit: Number = 10, page: Number = 1, keyword: string = '', data: any = {}) {
		const regex = new RegExp(keyword, 'i');
		return ScheduleModel.paginate(
			{
				isDeleted: false,
				title: { $regex: regex },
				...data,
			},
			{
				populate: [
					{
						path: 'subjectID',
					},
				],
				sort: { dayAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	/**
	 * get schedule by id
	 * @param ID
	 */
	async getDetailscheduleByID(ID: Types.ObjectId, select: String = '') {
		return ScheduleModel.findOne({
			isDeleted: false,
			_id: ID,
		})
			.populate('subjectID')
			.populate('trainingSectorID')
			.populate('classes')
			.populate('examID')
			.select(select);
	}

	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<ISchedule | any> {
		return await ScheduleModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}
	/**
	 * get many by option
	 * @param option object
	 * @param select string
	 */
	async getManyByOption(option: object, select: string = ''): Promise<ISchedule | any> {
		return await ScheduleModel.find({
			...option,
			isDeleted: false,
		}).select(select);
	}
}
export default ScheduleRepository;
