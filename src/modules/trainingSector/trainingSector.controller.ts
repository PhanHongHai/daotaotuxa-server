import moment from 'moment';
import BaseController from '../../common/base/controller.base';
import TrainingSectorRepository from './TrainingSector.repository';
import SubjectRepository from './../subjects/subject.repository';
import ClassRepository from '../classes/class.repository';
import AccountRepository from './../accounts/account.repository';
import ClassDetailRepository from './../classDetail/classDetail.repository';
import GroupSubjectRepository from './../groupSubject/groupSubject.repository';
import { UnauthorizedException, BadRequestException, NotFoundException } from '../../common/error';

// interfaces
import { ICreateITrainingSector, IUpdateITrainingSector } from './trainingSector.interface';
import { getMessages } from '../../common/messages/index';
class TrainingSectorController extends BaseController {
	trainingSectorRepository: TrainingSectorRepository;
	classRepository: ClassRepository;
	classDetailRepository: ClassDetailRepository;
	subjectRepository: SubjectRepository;
	accountRepository: AccountRepository;
	groupSubjectRepository: GroupSubjectRepository;

	messges = getMessages('trainingSector', 'vi');

	constructor() {
		super();
		this.trainingSectorRepository = new TrainingSectorRepository();
		this.classRepository = new ClassRepository();
		this.classDetailRepository = new ClassDetailRepository();
		this.subjectRepository = new SubjectRepository();
		this.accountRepository = new AccountRepository();
		this.groupSubjectRepository = new GroupSubjectRepository();
	}

	async getAllTrainingSector(req: any, res: any, next: any) {
		try {
			let trainingSector = await this.trainingSectorRepository.getAll();
			res.json(trainingSector);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * search TrainingSector with keyword: name or type
	 * @param req
	 * @param res
	 * @param next
	 */

	async searchAndGetTrainingSector(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword } = req.query;
			let trainingSector = await this.trainingSectorRepository.search(keyword, limit, page);
			res.json(trainingSector);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get detail application data
	 * @param req
	 * @param res
	 * @param next
	 */

	async getTrainingSectorByID(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const appData = await this.trainingSectorRepository.getById(ID);
			if (!appData) {
				throw new NotFoundException(this.messges.NOT_FOUND_TRAINING_SECTOR);
			} else res.json(appData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create new application
	 * @param req
	 * @param res
	 * @param next
	 */

	async createTrainingSector(req: any, res: any, next: any) {
		try {
			let data: ICreateITrainingSector = req.body;
			let nameExistInType = await this.trainingSectorRepository.existNameInType(data.type, data.name);
			if (nameExistInType) throw new BadRequestException(this.messges.NAME_IS_EXIST_IN_TYPE);
			let tagExistInType = await this.trainingSectorRepository.getByOption({ tag: data.tag, type: data.type });
			if (tagExistInType) throw new BadRequestException(this.messges.TAG_IS_EXIST_IN_TYPE);
			let create = await this.trainingSectorRepository.create(data);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create new application
	 * @param req
	 * @param res
	 * @param next
	 */

	async updateTrainingSector(req: any, res: any, next: any) {
		try {
			let data: IUpdateITrainingSector = req.body;
			const { ID } = req.params;
			const trainingSectorData = await this.trainingSectorRepository.getById(ID);
			if (!trainingSectorData) {
				throw new NotFoundException(this.messges.NOT_FOUNT_TRAINING_SECTOR_UPDATE);
			}
			if (data.type && !data.name) {
				let nameExistInType = await this.trainingSectorRepository.existNameInType(data.type, trainingSectorData.name);
				if (nameExistInType) throw new BadRequestException(this.messges.TYPE_IS_EXIST_IN_NAME);
			}
			if (!data.type && data.name) {
				let nameExistInType = await this.trainingSectorRepository.existNameInType(trainingSectorData.type, data.name);
				if (nameExistInType) throw new BadRequestException(this.messges.NAME_IS_EXIST_IN_TYPE);
			}
			if (data.type && data.name) {
				let nameExistInType = await this.trainingSectorRepository.existNameInType(data.type, data.name);
				if (nameExistInType) throw new BadRequestException(this.messges.TYPE_AND_NAME_IS_EXIST);
			}
			if (data.tag && !data.type) {
				let tagExistInType = await this.trainingSectorRepository.getByOption({
					tag: data.tag,
					type: trainingSectorData.type,
				});
				if (tagExistInType) throw new BadRequestException(this.messges.TAG_IS_EXIST_IN_TYPE);
			}
			if (data.tag && data.type) {
				let tagExistInType = await this.trainingSectorRepository.getByOption({ tag: data.tag, type: data.type });
				if (tagExistInType) throw new BadRequestException(this.messges.TAG_IS_EXIST_IN_TYPE);
			}
			let isUpdate = await this.trainingSectorRepository.update(ID, data);
			res.json({ isUpdated: isUpdate });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Remove account
	 * @param req
	 * @param res
	 * @param next
	 */

	async deleteTrainingSector(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const exisitAccount = await this.trainingSectorRepository.getById(ID);
			if (!exisitAccount) {
				throw new NotFoundException(this.messges.NOT_FOUNT_TRAINING_SECTOR_DELETE);
			}
			const isDeleted = await this.trainingSectorRepository.remove(ID);
			if (isDeleted) {
				let isDeletedClass = await this.classRepository.removeMany({ trainingSectorID: ID });
				if (isDeletedClass) {
					let exsitGroupSubject = await this.groupSubjectRepository.findByOption({ sectorID: ID });
					let deleteGroupSubject = await this.groupSubjectRepository.removeMany({ sectorID: ID });
					if (deleteGroupSubject) {
						exsitGroupSubject.forEach(async element => {
							await this.subjectRepository.removeMany({ _id: element.subjectID });
						});
						let exsitClassDetail = await this.classDetailRepository.findByOption({ classID: ID });
						let deleteClassDetail = await this.classDetailRepository.removeMany({ classID: ID });
						if (deleteClassDetail) {
							exsitClassDetail.forEach(async element => {
								await this.accountRepository.updateMany({ _id: element.accountID }, { status: false });
							});
							res.json(deleteClassDetail);
						} else res.json(deleteClassDetail);
					} else res.json(deleteGroupSubject);
				} else res.json(isDeletedClass);
			} else res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}

	// analysis account
	async analysisTrainingSector(req: any, res: any, next: any) {
		try {
			const countTrainingSector = await this.trainingSectorRepository.getCount({});
			const countClass = await this.classRepository.getCount({});
			const countSubject = await this.subjectRepository.getCount({});
			res.json({ countTrainingSector, countClass, countSubject });
		} catch (error) {
			next(error);
		}
	}
}

export default TrainingSectorController;
