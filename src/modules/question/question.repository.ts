import QuestionModel from './question.model';
import { IQuestion, ICreateQuestion } from './question.interface';
import { Types } from 'mongoose';

class QuestionRepository {
	constructor() {}

	/**
	 * get questions
	 * @param data
	 * @param limit
	 * @param page
	 */

	async getAndSearch(
		limit: number = 10,
		page: number = 1,
		keyword: string = '',
		option: object = {},
		select: string = '',
	): Promise<IQuestion | null | any> {
		const regex = new RegExp(keyword, 'i');
		return QuestionModel.paginate(
			{
				isDeleted: false,
				content: { $regex: regex },
				...option,
			},
			{
				sort: { createAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select,
			},
		);
	}

	/**
	 * get detail question by question id
	 * @param ID
	 */
	async getQuestionByID(ID: Types.ObjectId, select: string = '') {
		return QuestionModel.findOne({
			isDeleted: false,
			_id: ID,
		}).select(select);
	}
	/**
	 * get question by option
	 * @param option
	 */
	async getQuestionByOption(option: object = {}, select: string = '') {
		return QuestionModel.find({
			isDeleted: false,
			...option,
		}).select(select);
	}
	/**
	 * get questions random
	 * @param option
	 */
	async getQuestionsRandom(size: Number, option: object = {}) {
		return QuestionModel.aggregate([{ $match: { ...option, isDeleted: false } }, { $sample: { size } }]);
	}
	/**
	 * get number question
	 * @param option
	 */
	async getNumberQuestion(
		typeLevel1: object = {},
		typeLevel2: object = {},
		typeLevel3: object = {},
		typeLevel4: object = {},
	) {
		const reports = await QuestionModel.aggregate([
			{ $match: { isDeleted: false } },
			{
				$group: {
					_id: 0,
					level1: {
						$sum: {
							$cond: [
								{
									$and: [{ ...typeLevel1 }, { $eq: ['$level', 1] }],
								},
								1,
								0,
							],
						},
					},
					level2: {
						$sum: {
							$cond: [
								{
									$and: [{ ...typeLevel2 }, { $eq: ['$level', 2] }],
								},
								1,
								0,
							],
						},
					},
					level3: {
						$sum: {
							$cond: [
								{
									$and: [{ ...typeLevel3 }, { $eq: ['$level', 3] }],
								},
								1,
								0,
							],
						},
					},
					level4: {
						$sum: {
							$cond: [
								{
									$and: [{ ...typeLevel4 }, { $eq: ['$level', 4] }],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					level1: 1,
					level2: 1,
					level3: 1,
					level4: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					level1: 0,
					level2: 0,
					level3: 0,
					level4: 0,
			  };
	}

	/**
	 * create question
	 * @param data
	 */
	async create(data: ICreateQuestion): Promise<IQuestion | any> {
		return QuestionModel.create(data);
	}

	/**
	 * update question
	 * @param id question id
	 * @param dataUpdate any
	 */
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await QuestionModel.updateOne(
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
	 * @param targetId questionID
	 */
	async remove(targetId: Types.ObjectId): Promise<Boolean> {
		const isUpdated = await QuestionModel.updateOne(
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
}

export default QuestionRepository;
