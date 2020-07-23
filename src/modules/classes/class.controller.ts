import BaseController from '../../common/base/controller.base';
import ClassRepository from './class.repository';
import ClassDetailRepository from './../classDetail/classDetail.repository';
import TrainingSectorRepository from './../trainingSector/TrainingSector.repository';
import GroupSubjectRepository from './../groupSubject/groupSubject.repository';
import AccountRepository from './../accounts/account.repository';
import { BadRequestException, NotFoundException } from '../../common/error';

// interfaces
import { ICreateClass, IUpdateClass } from './class.interface';
import { getMessages } from '../../common/messages/index';

class ClassController extends BaseController {
	ClassRepository: ClassRepository;
	classDetailRepository: ClassDetailRepository;
	trainingSectorRepository: TrainingSectorRepository;
	accountRepository: AccountRepository;
	groupSubjectRepository: GroupSubjectRepository;
	messges = getMessages('class', 'vi');
	constructor() {
		super();
		this.ClassRepository = new ClassRepository();
		this.classDetailRepository = new ClassDetailRepository();
		this.trainingSectorRepository = new TrainingSectorRepository();
		this.accountRepository = new AccountRepository();
		this.groupSubjectRepository = new GroupSubjectRepository();
	}

	/**
	 * get and search Class with keyword: name , status
	 * @param req
	 * @param res
	 * @param next
	 */

	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, status } = req.query;
			let classes = await this.ClassRepository.getAndSearch(keyword, limit, page, status);
			res.json(classes);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get and search Class by sectorID
	 * @param req
	 * @param res
	 * @param next
	 */

	async getAndSearchByTrainingSector(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, sectorID } = req.query;
			let classes = await this.ClassRepository.getAndSearchByTrainingSector(keyword, limit, page, sectorID);
			res.json(classes);
		} catch (error) {
			next(error);
		}
	}

	async getInfoClass(req: any, res: any, next: any) {
		try {
			let { role, userID } = req;
			let returnData = {};
			//verify account exsit in class
			let accExsitInClass = await this.classDetailRepository.getByOption({ accountID: userID });
			if (accExsitInClass !== null && role === 'student') {
				// find teacher in class of account login
				let infoTeacher = await this.classDetailRepository.getByOption(
					{
						classID: accExsitInClass.classID,
						typeAccount: 'teacher',
					},
					'accountID',
				);
				let infoClass = await this.ClassRepository.getById(accExsitInClass.classID);
				let countStudent = await this.classDetailRepository.getCount({
					classID: accExsitInClass.classID,
					typeAccount: 'student',
				});
				returnData = { countStudent, infoClass, infoTeacher };
			}
			if (accExsitInClass !== null && role === 'teacher') {
				let countStudent = await this.classDetailRepository.getCount({
					classID: accExsitInClass.classID,
					typeAccount: 'student',
				});
				let infoClass = await this.ClassRepository.getById(accExsitInClass.classID);
				returnData = { countStudent, infoClass };
			}
			res.json(returnData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get class by status
	 * @param req
	 * @param res
	 * @param next
	 */

	async getClassByStatus(req: any, res: any, next: any) {
		try {
			let { limit, page, status } = req.query;
			if (status === undefined) {
				status = ['opening', 'isOpen', 'close'];
			} else {
				status = [status];
			}
			const users = await this.ClassRepository.getManyByOption(limit, page, { status: status });
			res.json(users);
		} catch (error) {
			next(error);
		}
	}

	async getSubjectByClass(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID } = req.query;
			let existClass = await this.ClassRepository.getById(classID);
			if (!existClass) throw new NotFoundException(this.messges.NOT_FOUND_CLASS);
			if (existClass) {
				let existGroupSubject = await this.groupSubjectRepository.getAll(
					{ sectorID: existClass.trainingSectorID },
					limit,
					page,
					keyword,
				);
				res.json(existGroupSubject);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get class by ID
	 * @param req
	 * @param res
	 * @param next
	 */

	async getClassByID(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const appData = await this.ClassRepository.getById(ID);
			if (!appData) {
				throw new NotFoundException(this.messges.NOT_FOUND_CLASS);
			} else res.json(appData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create new Class
	 * @param req
	 * @param res
	 * @param next
	 */

	async createClass(req: any, res: any, next: any) {
		try {
			let data: ICreateClass = req.body;
			// verify class name
			if (data.name) {
				let existClassName = await this.ClassRepository.existClassName(data.name);
				if (existClassName) throw new BadRequestException(this.messges.CLASSNAME_IS_EXIST);
			}
			if (data.trainingSectorID) {
				let existTrainingSector = await this.trainingSectorRepository.getById(data.trainingSectorID);
				if (!existTrainingSector) throw new BadRequestException(this.messges.TRAININGSECTOR_IS_NOT_EXIST);
				let totalClassByType = await this.ClassRepository.getCount({ trainingSectorID: data.trainingSectorID });
				data.status = 'OP';
				data.tag = data.prefixTag + (totalClassByType + 1);
				let create = await this.ClassRepository.create(data);
				res.json(create);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update class
	 * @param req
	 * @param res
	 * @param next
	 */

	async updateClass(req: any, res: any, next: any) {
		try {
			let data: IUpdateClass = req.body;
			const { ID } = req.params;
			const classData = await this.ClassRepository.getById(ID);
			if (!classData) {
				throw new NotFoundException(this.messges.NOT_FOUNT_CLASS_UPDATE);
			}
			if (classData && data.name && classData.name !== data.name) {
				let existNameInTrainingSector = await this.ClassRepository.existClassName(data.name);
				if (existNameInTrainingSector) throw new BadRequestException(this.messges.CLASS_IS_EXIST);
			}
			let isUpdate = await this.ClassRepository.update(ID, data);
			res.json({ isUpdated: isUpdate });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Remove Class
	 * @param req
	 * @param res
	 * @param next
	 */

	async deleteClass(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const exisitClass = await this.ClassRepository.getById(ID);
			if (!exisitClass) {
				throw new NotFoundException(this.messges.NOT_FOUNT_CLASS_DELETE);
			}
			const isDeleted = await this.ClassRepository.remove(ID);
			//verify
			if (isDeleted) {
				let exsitClassDetail = await this.classDetailRepository.findByOption({ classID: ID });
				let deleteClassDetail = await this.classDetailRepository.removeMany({ classID: ID });
				if (deleteClassDetail) {
					exsitClassDetail.forEach(async element => {
						await this.accountRepository.updateMany({ _id: element.accountID }, { status: false });
					});
				}
			}
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}

export default ClassController;
