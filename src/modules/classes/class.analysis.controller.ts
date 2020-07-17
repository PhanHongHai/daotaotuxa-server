import BaseController from '../../common/base/controller.base';
import moment from 'moment';
import _ from 'lodash';
import { addMissingHour } from '../../utils/addMissingHour';
import { addMissingDate } from '../../utils/addMissingDate';
import { BadRequestException } from '../../common/error';

// interfaces
// message
import { getMessages } from '../../common/messages/index';
// repository
import ClassRepository from '../classes/class.repository';
import ClassDetailRepository from '../classDetail/classDetail.repository';

class ClassAnalysisController extends BaseController {
	classRepository: ClassRepository;
	classDetailRepository: ClassDetailRepository;

	messges = getMessages('class', 'vi');
	constructor() {
		super();
		this.classRepository = new ClassRepository();
		this.classDetailRepository = new ClassDetailRepository();
	}

	async getTotalsAllTime(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classRepository.getReportsTotals();
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
	async getTotals30days(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classRepository.getReportsTotals30day(req.query);
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}

	async getReportClassByTrainingType(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classRepository.reportTotalClassByTrainingType(req.query);
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
	async getReportClassByTrainingSector(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classRepository.reportTotalClassByTrainingSector(req.query);
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
	async getReportTotalStudentByTrainingType(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classDetailRepository.reportTotalStudentByTrainingType();
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
	async getReportTotalStudentByTrainingSector(req: any, res: any, next: any) {
		try {
			let reportTotal = await this.classDetailRepository.reportTotalStudentByTrainingSector();
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
	async getReportTotalClassByYear(req: any, res: any, next: any) {
		try {
			const { year } = req.query;
			if (!year) throw new BadRequestException(this.messges.YEAR_IS_REQUIRED);
			let reportTotal = await this.classRepository.getReportsTotalClassByYear(year);
			res.json(reportTotal);
		} catch (error) {
			next(error);
		}
	}
}
export default ClassAnalysisController;
