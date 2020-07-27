import BaseController from '../../common/base/controller.base';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import QuestionRepository from './question.repository';
import { ICreateQuestion, IUpdateQuestion } from './question.interface';
import { Types } from 'mongoose';

class QuestionController extends BaseController {
	questionRepository: QuestionRepository;
	messges = getMessages('question', 'vi');
	constructor() {
		super();
		this.questionRepository = new QuestionRepository();
	}

	/**
	 * get and search questions
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, type, level, tag } = req.query;
			let option = {};
			if (type != 2) option = { ...option, type };
			if (level != 0) option = { ...option, level };
			if (tag && tag != '') option = { ...option, tag };
			let questions = await this.questionRepository.getAndSearch(limit, page, keyword, option);
			res.json(questions);
		} catch (error) {
			next(error);
		}
	}
	// /**
	//  * get questions random
	//  * @param req
	//  * @param res
	//  * @param next
	//  */
	// async getQuestionsRandom(req: any, res: any, next: any) {
	// 	try {
	// 		let { size, type, level } = req.query;
	// 		let questions = await this.questionRepository.getQuestionsRandom(size, { type, level });
	// 		res.json(questions);
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }
	/**
	 * get questions random
	 * @param req
	 * @param res
	 * @param next
	 */
	async getNumberQuestion(req: any, res: any, next: any) {
		try {
			let { typeLevel1, typeLevel2, typeLevel3, typeLevel4, tag } = req.query;
			let option = tag == '' ? {} : { tag:Types.ObjectId(tag) };
			let optionLevel1 = typeLevel1 == 2 ? {} : { $eq: ['$type', Number(typeLevel1)] };
			let optionLevel2 = typeLevel2 == 2 ? {} : { $eq: ['$type', Number(typeLevel2)] };
			let optionLevel3 = typeLevel3 == 2 ? {} : { $eq: ['$type', Number(typeLevel3)] };
			let optionLevel4 = typeLevel4 == 2 ? {} : { $eq: ['$type', Number(typeLevel4)] };
			let numberQuestion = await this.questionRepository.getNumberQuestion(
				optionLevel1,
				optionLevel2,
				optionLevel3,
				optionLevel4,
				option,
			);
			res.json(numberQuestion);
		} catch (error) {
			next(error);
		}
	}
	async getQuestionForUpdateExam(req: any, res: any, next: any) {
		try {
			let { questions, limit, page, keyword, type, level } = req.query;
			let option = {};
			if (type != 2) option = { ...option, type };
			if (level != 0) option = { ...option, level };
			let data = await this.questionRepository.getAndSearch(limit, page, keyword, {
				_id: { $nin: JSON.parse(questions) },
				...option,
			});
			res.json(data);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get detail questions
	 * @param req
	 * @param res
	 * @param next
	 */
	async getDetail(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let existQuestion = await this.questionRepository.getQuestionByOption({ _id: ID });
			if (!existQuestion) throw new BadRequestException(this.messges.QUESTION_IS_NOT_EXIST);
			let question = await this.questionRepository.getQuestionByID(ID);
			res.json(question);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create question
	 * @param req
	 * @param res
	 * @param next
	 */
	async createQuestion(req: any, res: any, next: any) {
		try {
			const questionData: ICreateQuestion = req.body;
			// check question
			let existQuestion = await this.questionRepository.getQuestionByOption({ content: questionData.content });
			if (existQuestion && existQuestion.length > 0) throw new BadRequestException(this.messges.QUESTION_IS_EXIST);
			let create = await this.questionRepository.create(questionData);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * update question
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateQuestion(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const questionData: IUpdateQuestion = req.body;
			let existQuestion = await this.questionRepository.getQuestionByOption({ _id: ID });
			if (!existQuestion) throw new BadRequestException(this.messges.QUESTION_IS_NOT_EXIST);
			if (questionData && questionData.content) {
				let existContent = await this.questionRepository.getQuestionByOption({ content: questionData.content });
				if (existContent && existContent.length > 0) throw new BadRequestException(this.messges.CONTENT_IS_EXIST);
			}
			let update = await this.questionRepository.update(ID, {
				...questionData,
			});
			res.json(update);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * remove question
	 * @param req
	 * @param res
	 * @param next
	 */
	async removeQuestion(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			let existQuestion = await this.questionRepository.getQuestionByOption({ _id: ID });
			if (!existQuestion) throw new BadRequestException(this.messges.QUESTION_IS_NOT_EXIST);
			let isRemove = await this.questionRepository.remove(ID);
			res.json(isRemove);
		} catch (error) {
			next(error);
		}
	}
}

export default QuestionController;
