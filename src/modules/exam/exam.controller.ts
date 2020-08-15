import BaseController from '../../common/base/controller.base';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import ExamRepository from './exam.repository';
import QuestionRepository from '../question/question.repository';

import suffle from '../../utils/randomEleArr';

import { ICreateExam, IUpdateExam, ICreateExamAuto } from './exam.interface';
import { Types } from 'mongoose';

class ExamController extends BaseController {
	examRepository: ExamRepository;
	questionRepository: QuestionRepository;

	messges = getMessages('question', 'vi');
	constructor() {
		super();
		this.examRepository = new ExamRepository();
		this.questionRepository = new QuestionRepository();
	}

	/**
	 * get and search exams
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword } = req.query;
			let exams = await this.examRepository.getAndSearch(limit, page, keyword);
			res.json(exams);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get detail exam
	 * @param req
	 * @param res
	 * @param next
	 */
	async getDetail(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let examExam = await this.examRepository.getByOption({ _id: ID });
			if (!examExam) throw new BadRequestException(this.messges.EXAM_IS_NOT_EXIST);
			let exam = await this.examRepository.getDetailExamByID(ID);
			res.json(exam);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create exam
	 * @param req
	 * @param res
	 * @param next
	 */
	async createExam(req: any, res: any, next: any) {
		try {
			const questionData: ICreateExam = req.body;
			// check exam
			let existExam = await this.examRepository.getByOption({ title: questionData.title });
			if (existExam && existExam.length > 0) throw new BadRequestException(this.messges.EXAM_IS_EXIST);
			let create = await this.examRepository.create(questionData);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create exam auto
	 * @param req
	 * @param res
	 * @param next
	 */
	async createExamAuto(req: any, res: any, next: any) {
		try {
			const examData: ICreateExamAuto = req.body;
			const { level1, level2, level3, level4 } = examData;
			let questionsExam: String[] = [];
			// check exam
			let existExam = await this.examRepository.getByOption({ title: examData.title });
			if (existExam && existExam.length > 0) throw new BadRequestException(this.messges.EXAM_IS_EXIST);
			if (level1.number > 0) {
				let option = level1.type != 2 ? { type: Number(level1.type), tag: Types.ObjectId(examData.subjectID) } : {};
				let optionLevel1 = level1.type == 2 ? {} : { type: Number(level1.type) };
				let countQuestion = await this.questionRepository.counQuestionByLevel(optionLevel1, examData.subjectID, 1);
				let random = level1.number <= countQuestion*2 ? 0 : Math.floor(Math.random() * countQuestion);
				let questionLevel1 = await this.questionRepository.getQuestionsRandom(level1.number, 1, random, option);
				if (questionLevel1 && questionLevel1.length > 0) questionLevel1.forEach(ele => questionsExam.push(ele._id));
			}
			if (level2.number > 0) {
				let option = level2.type != 2 ? { type: Number(level2.type), tag: Types.ObjectId(examData.subjectID) } : {};
				let optionLevel2 = level2.type == 2 ? {} : { type: Number(level2.type) };
				let countQuestion = await this.questionRepository.counQuestionByLevel(optionLevel2, examData.subjectID, 2);
				let random = level2.number <= countQuestion*2 ? 0 : Math.floor(Math.random() * countQuestion);
				let questionLevel2 = await this.questionRepository.getQuestionsRandom(level2.number, 2, random, option);
				if (questionLevel2 && questionLevel2.length > 0) questionLevel2.forEach(ele => questionsExam.push(ele._id));
			}
			if (level3.number > 0) {
				let option = level3.type != 2 ? { type: Number(level3.type), tag: Types.ObjectId(examData.subjectID) } : {};
				let optionLevel3 = level3.type == 2 ? {} : { type: Number(level3.type) };
				let countQuestion = await this.questionRepository.counQuestionByLevel(optionLevel3, examData.subjectID, 3);
				let random = level3.number <= countQuestion*2 ? 0 : Math.floor(Math.random() * countQuestion);
				let questionLeve3 = await this.questionRepository.getQuestionsRandom(level3.number, 3, random, option);
				if (questionLeve3 && questionLeve3.length > 0) questionLeve3.forEach(ele => questionsExam.push(ele._id));
			}
			if (level4.number > 0) {
				let option = level4.type != 2 ? { type: Number(level4.type), tag: Types.ObjectId(examData.subjectID) } : {};
				let optionLevel4 = level4.type == 2 ? {} : { type: Number(level4.type) };
				let countQuestion = await this.questionRepository.counQuestionByLevel(optionLevel4, examData.subjectID, 4);
				let random = level4.number <= countQuestion*2 ? 0 : Math.floor(Math.random() * countQuestion);
				let questionLevel4 = await this.questionRepository.getQuestionsRandom(level4.number, 4, random, option);
				if (questionLevel4 && questionLevel4.length > 0) questionLevel4.forEach(ele => questionsExam.push(ele._id));
			}
			let create = await this.examRepository.create({
				title: examData.title,
				point: examData.point,
				subjectID: examData.subjectID,
				questions: suffle(questionsExam),
				number:examData.number
			});
			res.json(create);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * update exam
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateExam(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const examData: IUpdateExam = req.body;
			let existExam = await this.examRepository.getByOption({ _id: ID });
			if (!existExam) throw new BadRequestException(this.messges.EXAM_IS_NOT_EXIST);
			if (examData && examData.title) {
				let existTitle = await this.examRepository.getByOption({ title: examData.title });
				if (existTitle && existTitle.length > 0) throw new BadRequestException(this.messges.TITLE_IS_EXIST);
			}
			let update = await this.examRepository.update(ID, {
				...examData,
			});
			res.json(update);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * remove exam
	 * @param req
	 * @param res
	 * @param next
	 */
	async removeExam(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			let existExam = await this.examRepository.getByOption({ _id: ID });
			if (!existExam) throw new BadRequestException(this.messges.EXAM_IS_NOT_EXIST);
			let isRemoved = await this.examRepository.remove(ID);
			res.json(isRemoved);
		} catch (error) {
			next(error);
		}
	}
}

export default ExamController;
