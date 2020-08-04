import ExamModel from './exam.model';
import { IExam } from './exam.interface';
import { Types } from 'mongoose';
class ExamRepository {
	constructor() {}

	/**
	 * create exam
	 * @param data
	 */
	async create(data: any): Promise<IExam | any> {
		return ExamModel.create(data);
	}

	/**
	 * update exam
	 * @param id account id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await ExamModel.updateOne(
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
		const isUpdated = await ExamModel.updateOne(
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
	 * get  exam list
	 * @param data
	 * @param limit
	 * @param page
	 */

	async getAndSearch(limit: Number = 10, page: Number = 1, keyword: string = '', data: any = {}) {
		const regex = new RegExp(keyword, 'i');
		return ExamModel.paginate(
			{
				isDeleted: false,
				title: { $regex: regex },
				...data,
			},
			{
				populate: [
					{
						path: 'questions',
					},
					{
						path: 'subjectID',
					},
				],
				sort: { createAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	/**
	 * get exam by id
	 * @param ID
	 */
	async getDetailExamByID(ID: Types.ObjectId, select: String = '') {
		return ExamModel.findOne({
			isDeleted: false,
			_id: ID,
		})
			.populate('questions')
			.populate('subjectID')
			.select(select);
	}

	/**
	 * get by option
	 * @param option object
	 * @param select string
	 */
	async getByOption(option: object, select: string = ''): Promise<IExam | any> {
		return await ExamModel.findOne({
			...option,
			isDeleted: false,
		})
			.populate('questions')
			.select(select);
	}
}
export default ExamRepository;
