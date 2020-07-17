import BaseController from './../../common/base/controller.base';
import TimeKeepingRepository from './timeKeeping.repository';

import { ITimeKeeping, ICreateTimeKeeping } from './timeKeeping.interface';
import { BadRequestException } from '../../common/error';
import { getMessages } from './../../common/messages';

class TimeKeepingController extends BaseController {
	timeKeepingRepository: TimeKeepingRepository;
	messges = getMessages('timeKeeping', 'vi');
	constructor() {
		super();
		this.timeKeepingRepository = new TimeKeepingRepository();
	}

	/**
	 * get  timekeeping
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getTimeKeepingByStudent(req: any, res: any, next: any) {
		try {
			let { userID } = req;
			let timeKeeping = await this.timeKeepingRepository.getTimeKeepingByAccountID(userID);
			res.json(timeKeeping);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create TimeKeeping
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async attendanceByStudent(req: any, res: any, next: any) {
		try {
			let { date } = req.body;
			const { userID } = req;
			let exsitTimeKeeping = await this.timeKeepingRepository.getByOption({
				accountID: userID,
				date: date,
			});
			if (exsitTimeKeeping) throw new BadRequestException(this.messges.THIS_ACCOUNT_IS_TIMEKEEPING);
			let timeKeeping = await this.timeKeepingRepository.create({ date, accountID: userID });
			res.json(timeKeeping);
		} catch (error) {
			next(error);
		}
	}
}
export default TimeKeepingController;
