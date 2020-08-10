import moment from 'moment';

import BaseController from '../../common/base/controller.base';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';
import ScheduleRepository from './schedule.repository';

import { ICreateSchedule, IUpdateSchedule, ISchedule } from './schedule.interface';

function checkTimeSchedule(arrSchedule: ISchedule[], dataSchedule: any) {
	let result = [];
	const timeAddRangeScheduleData = moment(dataSchedule.timeAt).add(dataSchedule.timeRange, 'minute');
	for (let i = 0; i < arrSchedule.length; i++) {
		const ele = arrSchedule[i];
		const timeAddRangeSchedule = moment(ele.timeAt).add(ele.timeRange, 'minute');
		if (
			(moment(ele.timeAt) >= moment(dataSchedule.timeAt) && moment(ele.timeAt) <= timeAddRangeScheduleData) ||
			(timeAddRangeSchedule >= moment(dataSchedule.timeAt) && timeAddRangeSchedule <= timeAddRangeScheduleData)
		)
			result.push(ele);
	}
	return result;
}

class scheduleController extends BaseController {
	scheduleRepository: ScheduleRepository;

	messges = getMessages('schedule', 'vi');
	constructor() {
		super();
		this.scheduleRepository = new ScheduleRepository();
	}

	/**
	 * get and search schedules
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, startAt, endAt } = req.query;
			if (!startAt && !endAt) {
				let schedules = await this.scheduleRepository.getAndSearch(limit, page, keyword);
				res.json(schedules);
			} else {
				const fromDate = moment(startAt)
					.startOf('day')
					.toDate();
				const toDate = moment(endAt)
					.startOf('day')
					.toDate();
				let schedules = await this.scheduleRepository.getAndSearch(limit, page, keyword, {
					$and: [
						{
							dayAt: {
								$gte: fromDate,
							},
						},
						{
							dayAt: {
								$lte: toDate,
							},
						},
					],
				});
				res.json(schedules);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get detail schedule
	 * @param req
	 * @param res
	 * @param next
	 */
	async getDetail(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let scheduleschedule = await this.scheduleRepository.getByOption({ _id: ID });
			if (!scheduleschedule) throw new BadRequestException(this.messges.SCHEDULE_IS_NOT_EXIST);
			let schedule = await this.scheduleRepository.getDetailscheduleByID(ID);
			res.json(schedule);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get schedule by classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getScheduleByClassID(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID, startAt, endAt } = req.query;
			const fromDate = moment(startAt)
				.startOf('day')
				.toDate();
			const toDate = moment(endAt)
				.startOf('day')
				.toDate();
			if (startAt && endAt) {
				let schedulesData = await this.scheduleRepository.getAndSearchScheduleByOption(limit, page, keyword, {
					$and: [
						{
							dayAt: {
								$gte: fromDate,
							},
						},
						{
							dayAt: {
								$lte: toDate,
							},
						},
					],
					classes: {
						$elemMatch: {
							$eq: classID,
						},
					},
				});
				res.json(schedulesData);
			} else {
				let schedulesData = await this.scheduleRepository.getAndSearchScheduleByOption(limit, page, keyword, {
					classes: {
						$elemMatch: {
							$eq: classID,
						},
					},
				});
				res.json(schedulesData);
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create schedule
	 * @param req
	 * @param res
	 * @param next
	 */
	async createschedule(req: any, res: any, next: any) {
		try {
			const scheduleData: ICreateSchedule = req.body;
			// check schedule
			let existSchedule = await this.scheduleRepository.getByOption({ title: scheduleData.title });
			let checkClass = await this.scheduleRepository.getManyByOption({
				classes: {
					$elemMatch: {
						$in: scheduleData.classes,
					},
				},
			});
			if (existSchedule) throw new BadRequestException(this.messges.TITLE_IS_EXIST);
			if (checkClass.length > 0) {
				let dataExist = await checkTimeSchedule(checkClass, scheduleData);
				if (dataExist.length > 0) throw new BadRequestException(this.messges.SCHEDULE_IS_DUPLICATED);
			}

			let create = await this.scheduleRepository.create(scheduleData);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * update schedule
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateschedule(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const scheduleData: IUpdateSchedule = req.body;
			let existSchedule = await this.scheduleRepository.getByOption({ _id: ID });
			if (!existSchedule) throw new BadRequestException(this.messges.SCHEDULE_IS_NOT_EXIST);
			if (scheduleData && scheduleData.title) {
				let existTitle = await this.scheduleRepository.getByOption({ title: scheduleData.title });
				if (existTitle) throw new BadRequestException(this.messges.TITLE_IS_EXIST);
			}
			if (scheduleData && scheduleData.dayAt) {
				let checkClass = [];
				if (!scheduleData.classes) {
					checkClass = await this.scheduleRepository.getManyByOption({
						classes: {
							$elemMatch: {
								$in: existSchedule.classes,
							},
						},
					});
				} else {
					checkClass = await this.scheduleRepository.getManyByOption({
						classes: {
							$elemMatch: {
								$in: scheduleData.classes,
							},
						},
					});
				}
				if (checkClass.length > 0) {
					if (scheduleData.timeAt) {
						let dataExist = await checkTimeSchedule(checkClass, scheduleData);
						if (dataExist.length > 0) throw new BadRequestException(this.messges.SCHEDULE_IS_DUPLICATED);
					} else {
						let dataExist = await checkTimeSchedule(checkClass, existSchedule);
						if (dataExist.length > 0) throw new BadRequestException(this.messges.SCHEDULE_IS_DUPLICATED);
					}
				}
			}
			let update = await this.scheduleRepository.update(ID, {
				...scheduleData,
			});
			res.json(update);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * remove schedule
	 * @param req
	 * @param res
	 * @param next
	 */
	async removeSchedule(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			let existSchedule = await this.scheduleRepository.getByOption({ _id: ID });
			if (!existSchedule) throw new BadRequestException(this.messges.SCHEDULE_IS_NOT_EXIST);
			let isRemoved = await this.scheduleRepository.remove(ID);
			res.json(isRemoved);
		} catch (error) {
			next(error);
		}
	}
}

export default scheduleController;
