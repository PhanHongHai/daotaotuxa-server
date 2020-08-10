import BaseController from '../../common/base/controller.base';
import { BadRequestException, InternalServerErrorException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import PointRepository from './point.repository';
import ScheduleRepository from '../schedule/schedule.repository';
import ExamRepository from '../exam/exam.repository';
import LogPointRepository from '../logSchedulePoint/logPoint.repository';
import ClassDetailRepository from '../classDetail/classDetail.repository';

import { IUpdatePoint, ISubmitTask } from './point.interface';
import { IQuestion } from '../question/question.interface';
import { Types } from 'mongoose';

class ExamController extends BaseController {
	pointRepository: PointRepository;
	scheduleRepository: ScheduleRepository;
	examRepository: ExamRepository;
	logPointRepository: LogPointRepository;
	classDetailRepository: ClassDetailRepository;

	messges = getMessages('question', 'vi');
	constructor() {
		super();
		this.pointRepository = new PointRepository();
		this.scheduleRepository = new ScheduleRepository();
		this.examRepository = new ExamRepository();
		this.logPointRepository = new LogPointRepository();
		this.classDetailRepository = new ClassDetailRepository();
	}

	/**
	 * get point subject of class by teacher
	 * @param req
	 * @param res
	 * @param next
	 */
	async getPointSubjectOfClassByTeacher(req: any, res: any, next: any) {
		try {
			let { limit, page, classID, subjectID } = req.query;
			let classStudent = await this.classDetailRepository.findByOption({ classID });
			let arrStudentID: Types.ObjectId[] = [];
			if (classStudent.length > 0) {
				classStudent.forEach((ele: any) => arrStudentID.push(ele.accountID._id));
			}
			let pointsData = await this.pointRepository.getPointsOfClassByTeacher(limit, page, {
				$and: [
					{
						subjectID,
					},
					{
						accountID: {
							$in: arrStudentID,
						},
					},
				],
			});
			res.json(pointsData);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get point all of class by teacher
	 * @param req
	 * @param res
	 * @param next
	 */
	async getPointAllOfClassByTeacher(req: any, res: any, next: any) {
		try {
			let { limit, page, classID } = req.query;
			const skip = Number(page) * Number(limit) - Number(limit);
			let classStudent = await this.classDetailRepository.findByOption({ classID });
			let arrStudentID: Types.ObjectId[] = [];
			if (classStudent.length > 0) {
				classStudent.forEach((ele: any) => arrStudentID.push(ele.accountID._id));
			}
			let pointsData=await this.pointRepository.getPointAllOfClass(Number(limit),skip,arrStudentID);
			res.json(pointsData);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get detail point by student
	 * @param req
	 * @param res
	 * @param next
	 */
	async getDetailByStudent(req: any, res: any, next: any) {
		try {
			let { userID } = req;
			let { limit, page } = req.query;
			let pointData = await this.pointRepository.getDetailPointByAccountID(limit, page, userID);
			res.json(pointData);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get detail point by account id
	 * @param req
	 * @param res
	 * @param next
	 */
	async getDetailByAccountID(req: any, res: any, next: any) {
		try {
			let { limit, page, studentID } = req.query;
			let pointData = await this.pointRepository.getDetailPointByAccountID(limit, page, studentID);
			res.json(pointData);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * caculator point
	 * @param req
	 * @param res
	 * @param next
	 */
	async caculatorPoint(req: any, res: any, next: any) {
		try {
			const dataTask: ISubmitTask = req.body;
			const { userID } = req;
			let numberAnswerRight = 0;
			let resultPoint = 0;
			let existSchedule = await this.scheduleRepository.getByOption({ _id: dataTask.scheduleID });
			if (!existSchedule) throw new BadRequestException(this.messges.SCHEDULE_IS_NOT_EXIST);
			let existExam = await this.examRepository.getByOption({ _id: dataTask.examID });
			if (!existExam) throw new BadRequestException(this.messges.EXAM_IS_NOT_EXIST);
			if (dataTask.answers.length > 0) {
				dataTask.answers.forEach((ele: any) => {
					let checkAnswer = existExam.questions.find(
						(item: IQuestion) => item._id == ele.questionID && item.answer === ele.answer,
					);
					if (checkAnswer) numberAnswerRight += 1;
				});
			}
			resultPoint = numberAnswerRight * existExam.point;
			let existPoint = await this.pointRepository.getByOption({ accountID: userID, subjectID: dataTask.subjectID });
			if (existPoint) {
				let updatePoint = false;
				// 2 : cuoi ky | 1 : giua ky | 0 : thuong
				if (existSchedule.type == 1) {
					updatePoint = await this.pointRepository.update(existPoint._id, {
						pointMiddle: resultPoint,
						pointTotal: (resultPoint * 30) / 100 + (existPoint.pointLast * 70) / 100,
					});
				} else if (existSchedule.type == 2) {
					updatePoint = await this.pointRepository.update(existPoint._id, {
						pointLast: resultPoint,
						pointTotal: (existPoint.pointMiddle * 30) / 100 + (resultPoint * 70) / 100,
					});
				} else updatePoint = true;
				if (!updatePoint) throw new InternalServerErrorException(this.messges.UPDATE_POINT_FAIL);
			} else {
				let createData = {
					subjectID: existSchedule.subjectID,
					accountID: userID,
				};
				// 2 : cuoi ky | 1 : giua ky | 0 : thuong
				if (existSchedule.type == 1) {
					await this.pointRepository.create({
						...createData,
						pointMiddle: resultPoint,
						pointTotal: (resultPoint * 30) / 100,
					});
				}
				if (existSchedule.type == 2) {
					await this.pointRepository.create({
						...createData,
						pointLast: resultPoint,
						pointTotal: (resultPoint * 70) / 100,
					});
				}
			}
			await this.logPointRepository.create({
				classID: dataTask.classID,
				scheduleID: dataTask.scheduleID,
				subjectID: dataTask.subjectID,
				examID: dataTask.examID,
				accountID: userID,
				result: resultPoint,
			});
			res.json({ answerRight: numberAnswerRight, total: resultPoint });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * update POINT
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updatePoint(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const pointData: IUpdatePoint = req.body;
			let existPoint = await this.pointRepository.getByOption({ _id: ID });
			if (!existPoint) throw new BadRequestException(this.messges.POINT_IS_NOT_EXIST);
			let pointTotal = ((pointData.pointMiddle * 30) / 100 + (existPoint.pointLast * 70) / 100);
			let update = await this.pointRepository.update(ID, {
				...pointData,
				pointTotal,
			});
			res.json(update);
		} catch (error) {
			next(error);
		}
	}
}

export default ExamController;
