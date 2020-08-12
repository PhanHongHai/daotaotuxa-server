import moment from 'moment';
import { Types } from 'mongoose';
import excel from 'exceljs';

import countries from '../../utils/country';
import trainingTypes from '../../utils/trainingType';
import convertNumberToText from '../../utils/convertNumberToText';

import { exportExcelServiceCustomRow } from '../../utils/exportExcel';

import BaseController from '../../common/base/controller.base';
import { BadRequestException, InternalServerErrorException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import PointRepository from './point.repository';
import ScheduleRepository from '../schedule/schedule.repository';
import ExamRepository from '../exam/exam.repository';
import LogPointRepository from '../logSchedulePoint/logPoint.repository';
import ClassDetailRepository from '../classDetail/classDetail.repository';
import ClassRepository from '../classes/class.repository';
import SubjectRepository from '../subjects/subject.repository';

import { IUpdatePoint, ISubmitTask } from './point.interface';
import { IQuestion } from '../question/question.interface';

function getNameCountry(arrValue: any[], itemKey: string) {
	let result = arrValue.find(ele => ele.key == itemKey);
	if (result) return result.name;
	return 'Không xác định';
}
function getNameTrainingType(arrValue: any[], itemKey: string) {
	let result = arrValue.find(ele => ele.key == itemKey);
	if (result) return result.value;
	return 'Không xác định';
}

class ExamController extends BaseController {
	pointRepository: PointRepository;
	scheduleRepository: ScheduleRepository;
	examRepository: ExamRepository;
	logPointRepository: LogPointRepository;
	classDetailRepository: ClassDetailRepository;
	classRepository: ClassRepository;
	subjectRepository: SubjectRepository;

	messges = getMessages('question', 'vi');
	constructor() {
		super();
		this.pointRepository = new PointRepository();
		this.scheduleRepository = new ScheduleRepository();
		this.examRepository = new ExamRepository();
		this.logPointRepository = new LogPointRepository();
		this.classDetailRepository = new ClassDetailRepository();
		this.classRepository = new ClassRepository();
		this.subjectRepository = new SubjectRepository();
	}

	/**
	 * export excel points subject of class
	 * @param req
	 * @param res
	 * @param next
	 */
	async exportExeclPointsSubjectOfClass(req: any, res: any, next: any) {
		try {
			let { classID, subjectID } = req.params;
			let classStudent = await this.classDetailRepository.findByOption({ classID });
			let classDetail = await this.classRepository.getById(classID);
			if (!classDetail) throw new BadRequestException(this.messges.CLASS_IS_NOT_EXIST);
			let subjectDetail = await this.subjectRepository.getById(subjectID);
			if (!subjectDetail) throw new BadRequestException(this.messges.SUBJECT_IS_NOT_EXIST);
			let arrStudentID: Types.ObjectId[] = [];
			if (classStudent.length > 0) {
				classStudent.forEach((ele: any) => arrStudentID.push(ele.accountID._id));
			}
			let pointsData = await this.pointRepository.getPointAllOfClassBySubjectIDAndClassID({
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

			let arrPointsData: any[] = [];
			if (pointsData.length > 0) {
				pointsData.forEach((ele: any, index: number) =>
					arrPointsData.push({
						stt: index + 1,
						tag: ele.accountID.tag,
						name: ele.accountID.name,
						birthDay: moment(ele.accountID.birthDay).format('DD-MM-YYYY'),
						sex: ele.accountID.sex == 1 ? 'Nam' : ' Nữ',
						country: getNameCountry(countries, ele.accountID.country),
						pointMiddle: ele.pointMiddle,
						pointLast: ele.pointLast,
						pointTotal: ele.pointTotal,
					}),
				);
			}
			let workbook = new excel.Workbook();

			let worksheet = workbook.addWorksheet('Bảng Điểm');
			const row = worksheet.getRow(1);
			row.hidden = true;
			worksheet.mergeCells('D4:F4');
			worksheet.mergeCells('D6:E6');
			worksheet.mergeCells('D7:E7');
			worksheet.mergeCells('D8:E8');
			//	worksheet.mergeCells('G2','H2','I2');
			worksheet.getCell('C6').value = 'Mã lớp học :' + classDetail.tag;
			worksheet.getCell('C7').value = 'Tên lớp học :' + classDetail.name;
			worksheet.getCell('C8').value =
				'Năm học :' + moment(classDetail.startAt).year() + '-' + moment(classDetail.endtAt).year();
			worksheet.getCell('D6').value = 'Mã môn học :' + subjectDetail.tag;
			worksheet.getCell('D7').value = 'Tên môn học :' + subjectDetail.name;
			worksheet.getCell('F6').value = 'Ngành :' + classDetail.trainingSectorID.name;
			worksheet.getCell('F7').value = 'Hệ :' + getNameTrainingType(trainingTypes, classDetail.trainingSectorID.type);
			worksheet.getCell('D4').value = 'BẢNG ĐIỂM';
			worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
			worksheet.getCell('D4').font = {
				family: 4,
				size: 17,
				bold: true,
			};
			let rowHeader = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
			rowHeader.forEach(ele => {
				worksheet.mergeCells(`${ele}13:${ele}14`);
				worksheet.getCell(`${ele}13`).alignment = { vertical: 'middle', horizontal: 'center' };
			});
			worksheet.getRow(13).values = [
				'STT',
				'MSHV',
				'Họ Tên',
				'Giới Tính',
				'Ngày Sinh',
				'Quê Quán',
				'Điểm Giữa Kỳ (30%)',
				'Điểm Cuối Kỳ (70%)',
				'Điểm Tổng Kết',
			];
			worksheet.columns = [
				{ header: 'STT', key: 'stt', width: 10 },
				{ header: 'MSHV', key: 'tag', width: 10 },
				{ header: 'Họ Tên', key: 'name', width: 30 },
				{ header: 'Giới Tính', key: 'sex', width: 15 },
				{ header: 'Ngày Sinh', key: 'birthDay', width: 20 },
				{ header: 'Quê Quán', key: 'country', width: 25 },
				{ width: 25, header: 'Điểm giữa kỳ (30%)', key: 'pointMiddle' },
				{ width: 25, header: 'Điểm cuối kỳ (70%)', key: 'pointLast' },
				{ width: 20, header: 'Điểm Tổng Kết', key: 'pointTotal' },
			];
			// Add Array Rows
			worksheet.addRows(arrPointsData);
			worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
				const insideColumns = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
				if (rowNumber == 13) {
					//	worksheet.mergeCells(`A${rowNumber}:A${rowNumber - 1}`);
					worksheet.getCell(`A${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`A${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
					insideColumns.forEach(ele => {
						//	worksheet.mergeCells(`${ele}${rowNumber}:${ele}${rowNumber - 1}`);
						worksheet.getCell(`${ele}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
						worksheet.getCell(`${ele}${rowNumber}`).border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' },
						};
						worksheet.getCell(`${ele}${rowNumber + 1}`).border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' },
						};
					});
				}
				if (rowNumber > 14) {
					worksheet.getCell(`A${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`A${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
					insideColumns.forEach(v => {
						worksheet.getCell(`${v}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
						worksheet.getCell(`${v}${rowNumber}`).border = {
							top: { style: 'thin' },
							bottom: { style: 'thin' },
							left: { style: 'thin' },
							right: { style: 'thin' },
						};
					});
				}
			});
			await exportExcelServiceCustomRow(res, workbook, worksheet);
		} catch (error) {
			next(error);
		}
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
			let pointsData = await this.pointRepository.getPointAllOfClass(Number(limit), skip, arrStudentID);
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
			let pointTotal = (pointData.pointMiddle * 30) / 100 + (existPoint.pointLast * 70) / 100;
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
