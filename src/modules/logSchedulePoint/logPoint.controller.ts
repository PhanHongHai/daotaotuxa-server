import excel from 'exceljs';
import moment from 'moment';

import countries from '../../utils/country';
import trainingTypes from '../../utils/trainingType';
import convertNumberToText from '../../utils/convertNumberToText';

import { exportExcelServiceCustomRow } from '../../utils/exportExcel';

import BaseController from '../../common/base/controller.base';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import LogPointRepository from '../logSchedulePoint/logPoint.repository';
import ClassDetailRepository from '../classDetail/classDetail.repository';
import ScheduleRepository from '../schedule/schedule.repository';
import ClassRepository from '../classes/class.repository';

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

class LogPointController extends BaseController {
	logPointRepository: LogPointRepository;
	classDetailRepository: ClassDetailRepository;
	scheduleRepository: ScheduleRepository;
	classRepository: ClassRepository;

	messges = getMessages('logPoint', 'vi');
	constructor() {
		super();

		this.logPointRepository = new LogPointRepository();
		this.classDetailRepository = new ClassDetailRepository();
		this.scheduleRepository = new ScheduleRepository();
		this.classRepository = new ClassRepository();
	}

	/**
	 * export excel log point of schedule by teacher
	 * @param req
	 * @param res
	 * @param next
	 */
	async exportLogPointOfSchedule(req: any, res: any, next: any) {
		try {
			let { classID, scheduleID } = req.params;
			let detailSchedule = await this.scheduleRepository.getDetailscheduleByID(scheduleID);
			if (!detailSchedule) throw new BadRequestException(this.messges.SCHEDULE_IS_NOT_EXIST);
			let classDetail = await this.classRepository.getById(classID);
			if (!classDetail) throw new BadRequestException(this.messges.CLASS_IS_NOT_EXIST);
			let logsData = await this.logPointRepository.getLogsScheduleOfClassByID(scheduleID, classID);
			let arrLogData: any[] = [];
			if (logsData.length > 0) {
				logsData.forEach((ele: any, index: number) =>
					arrLogData.push({
						stt: index + 1,
						tag: ele.accountID.tag,
						name: ele.accountID.name,
						birthDay: moment(ele.accountID.birthDay).format('DD-MM-YYYY'),
						sex: ele.accountID.sex == 1 ? 'Nam' : ' Nữ',
						country: getNameCountry(countries, ele.accountID.country),
						result: ele.result,
						resultText: convertNumberToText(ele.result),
					}),
				);
			}
			let workbook = new excel.Workbook();

			let worksheet = workbook.addWorksheet('Kết quả');
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
			worksheet.getCell('D6').value = 'Mã môn học :' + detailSchedule.subjectID.tag;
			worksheet.getCell('D7').value = 'Tên môn học :' + detailSchedule.subjectID.name;
			worksheet.getCell('D8').value =
				'Ngày thi :' +
				moment(detailSchedule.timeAt).format('DD-MM-YYYY') +
				' lúc ' +
				moment(detailSchedule.timeAt).format('HH:mm');
			worksheet.getCell('F6').value = 'Ngành :' + classDetail.trainingSectorID.name;
			worksheet.getCell('F7').value = 'Hệ :' + getNameTrainingType(trainingTypes, classDetail.trainingSectorID.type);
			worksheet.getCell('D4').value = 'KẾT QUẢ KIỂM TRA';
			worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
			worksheet.getCell('D4').font = {
				family: 4,
				size: 17,
				bold: true,
			};
			let rowHeader = ['A','B','C','D','E','F'];
			rowHeader.forEach(ele =>{
				worksheet.mergeCells(`${ele}13:${ele}14`);
				worksheet.getCell(`${ele}13`).alignment = { vertical: 'middle', horizontal: 'center' };
			});
			worksheet.getRow(13).values = ['STT', 'MSHV', 'Họ Tên', 'Giới Tính', 'Ngày Sinh', 'Quê Quán', 'Bằng Chữ','Bằng Số'];
			worksheet.columns = [
				{ header: 'STT', key: 'stt', width: 10 },
				{ header: 'MSHV', key: 'tag', width: 10 },
				{ header: 'Họ Tên', key: 'name', width: 30 },
				{ header: 'Giới Tính', key: 'sex', width: 15 },
				{ header: 'Ngày Sinh', key: 'birthDay', width: 20 },
				{ header: 'Quê Quán', key: 'country', width: 35 },
				{ width: 15, header: 'Bang so', key: 'resultText' },
				{ width: 15, header: 'Bang chu', key: 'result' },
			];
			// Add Array Rows
			worksheet.addRows(arrLogData);
			worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
				const insideColumns = ['B', 'C', 'D', 'E', 'F'];
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
						worksheet.getCell(`${ele}${rowNumber+1}`).border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' },
						};
					});
					worksheet.mergeCells(`G${rowNumber}:H${rowNumber}`);
				
					worksheet.getCell(`G${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`G${rowNumber+1}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`H${rowNumber+1}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`G${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
					worksheet.getCell(`G${rowNumber}`).value = 'Điểm Thi';
					worksheet.getCell(`G${rowNumber + 1}`).value = 'Bằng Chữ';
					worksheet.getCell(`H${rowNumber + 1}`).value = 'Bằng Số';
					worksheet.getCell(`G${rowNumber + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
					worksheet.getCell(`H${rowNumber + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
				}
				if (rowNumber > 14) {
					worksheet.getCell(`A${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`G${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`H${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`G${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
					worksheet.getCell(`H${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
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

					worksheet.getCell(`F${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				}
			});
			await exportExcelServiceCustomRow(res, workbook, worksheet);
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
	async logsScheduleByStudent(req: any, res: any, next: any) {
		try {
			let { limit, page } = req.query;
			let { userID } = req;
			let dataLog = await this.logPointRepository.getDetailPointByAccountID(limit, page, userID);
			res.json(dataLog);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get logs point by scheduleID & classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async logsScheduleByTeacher(req: any, res: any, next: any) {
		try {
			let { limit, page, classID, scheduleID } = req.query;
			// let classStudent = await this.classDetailRepository.findByOption({ classID });
			// let arrStudentID: string[] = [];
			// if (classStudent.length > 0) {
			// 	classStudent.forEach((ele: any) => arrStudentID.push(ele._id));
			// }
			let dataLog = await this.logPointRepository.getLogsByTeacher(limit, page, scheduleID, classID);
			res.json(dataLog);
		} catch (error) {
			next(error);
		}
	}
}

export default LogPointController;
