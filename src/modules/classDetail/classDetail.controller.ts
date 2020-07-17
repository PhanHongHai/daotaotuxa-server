import BaseController from '../../common/base/controller.base';

import ClassDetailRepository from './classDetail.repository';
import AccountRepository from '../accounts/account.repository';
import ClassRepository from '../classes/class.repository';

import { BadRequestException, NotFoundException } from '../../common/error';

// interfaces

import { ICreateClassDetail } from './classDetail.interface';
import { getMessages } from '../../common/messages/index';

class ClassDetailController extends BaseController {
	ClassDetailRepository: ClassDetailRepository;
	AccountRepository: AccountRepository;
	ClassRepository: ClassRepository;

	messges = getMessages('classDetail', 'vi');

	constructor() {
		super();
		this.ClassDetailRepository = new ClassDetailRepository();
		this.AccountRepository = new AccountRepository();
		this.ClassRepository = new ClassRepository();
	}

	/**
	 * get student of class by classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearchStudentOfClass(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID } = req.query;
			let students = await this.ClassDetailRepository.getAndSearchStudentClass(keyword, limit, page, classID);
			res.json(students);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get info teacher of class by classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getInfoTeacherOfClass(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let infoTeacher = await this.ClassDetailRepository.getInfoTeacher(ID);
			if (infoTeacher) res.json(infoTeacher);
			res.json({});
		} catch (error) {
			next(error);
		}
	}

	async getStudentsOfClassByTeacher(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID } = req.query;
			const skip = Number(limit) * Number(page) - Number(limit);
			let students = await this.ClassDetailRepository.getAndSearchStudentOfClassByTeacher(
				keyword,
				Number(limit),
				skip,
				classID,
			);
			if (students) res.json({ docs: students, limit, page, total: students.length });
			else res.json({ docs: [], limit, page, total: 0 });
		} catch (error) {
			next(error);
		}
	}

	async addAccountToClassDetail(req: any, res: any, next: any) {
		try {
			let data: ICreateClassDetail = req.body;

			// verify class & account not exist
			let checkExist = await this.ClassDetailRepository.checkExist(data.accountID, data.classID);
			if (checkExist && checkExist.length > 0) throw new BadRequestException(this.messges.CLASSDETAIL_IS_EXIST);
			// verify account not exist
			let verifyAccountID = await this.AccountRepository.getAccountByOption({ _id: data.accountID });
			if (!verifyAccountID) throw new BadRequestException(this.messges.ACCOUNT_IS_NOT_EXIST);
			// verify classID not exist
			let verifyClassID = await this.ClassRepository.getByOption({ _id: data.classID }, '');
			if (!verifyClassID) throw new BadRequestException(this.messges.CLASS_ID_IS_NOT_EXIST);
			// verify role account teacher and student
			if (verifyAccountID && verifyAccountID.role !== 'teacher' && verifyAccountID.role !== 'student')
				throw new BadRequestException(this.messges.ROLE_ACCOUNT_IS_NOT_VALID);
			if (verifyAccountID && verifyAccountID.role === 'teacher') {
				let exsitTeacher = await this.ClassDetailRepository.getByOption({
					classID: data.classID,
					typeAccount: 'teacher',
				});
				if (exsitTeacher) {
					await this.ClassDetailRepository.remove(exsitTeacher._id);
					await this.AccountRepository.update(exsitTeacher.accountID, { status: false });
					data.typeAccount = 'teacher';
					let create = await this.ClassDetailRepository.create(data);
					if (create) await this.AccountRepository.update(data.accountID, { status: true });
					res.json(create);
				} else {
					data.typeAccount = 'teacher';
					let create = await this.ClassDetailRepository.create(data);
					if (create) await this.AccountRepository.update(data.accountID, { status: true });
					res.json(create);
				}
			}
			if (verifyAccountID && verifyAccountID.role === 'student') {
				let create = await this.ClassDetailRepository.create(data);
				if (create) await this.AccountRepository.update(data.accountID, { status: true });
				res.json(create);
			}
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

	async deleteClassDetail(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const exisitAccount = await this.ClassDetailRepository.getByID(ID);
			if (!exisitAccount) {
				throw new NotFoundException(this.messges.NOT_FOUNT_CLASS_DETAILE_DELETE);
			}
			const isDeleted = await this.ClassDetailRepository.remove(ID);
			if (isDeleted) await this.AccountRepository.update(exisitAccount.accountID, { status: false });
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}

export default ClassDetailController;
