import BaseController from '../../common/base/controller.base';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import LogPointRepository from '../logSchedulePoint/logPoint.repository';
import ClassDetailRepository from '../classDetail/classDetail.repository';

class LogPointController extends BaseController {
	logPointRepository: LogPointRepository;
	classDetailRepository: ClassDetailRepository;

	messges = getMessages('question', 'vi');
	constructor() {
		super();

		this.logPointRepository = new LogPointRepository();
		this.classDetailRepository = new ClassDetailRepository();
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
