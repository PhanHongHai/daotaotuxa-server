import BaseController from '../../common/base/controller.base';
import ProFileRepository from './proFile.repository';
import AccountRepository from '../accounts/account.repository';
import { BadRequestException } from '../../common/error';
import fs from 'fs';

import { getMessages } from '../../common/messages/index';
import { uploadSingle } from './../upload/upload.services';
import { IUpdateProFile, ICreateProFile } from './proFile.interface';

class ProFileController extends BaseController {
	proFileRepository: ProFileRepository;
	accountRepository: AccountRepository;
	messges = getMessages('proFile', 'vi');
	constructor() {
		super();
		this.proFileRepository = new ProFileRepository();
		this.accountRepository = new AccountRepository();
	}

	async getProFileById(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const profiles = await this.proFileRepository.getProfileByStudentID(ID);
			if (!profiles) res.json({});
			else res.json(profiles);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create profile
	 * @param req
	 * @param res
	 * @param next
	 */
	async createProFile(req: any, res: any, next: any) {
		try {
			const profileData: ICreateProFile = req.body;
			// check accountID
			let existAccountID = await this.accountRepository.getById(profileData.accountID, { role: 'student' }, '');
			if (!existAccountID) throw new BadRequestException(this.messges.ACCOUNTID_NOT_EXIST);
			let existProfile = await this.proFileRepository.getByOption(
				{ accountID: profileData.accountID, title: profileData.title },
				'',
			);
			if (existProfile) throw new BadRequestException(this.messges.TITLE_IS_EXIST);
			let create = await this.proFileRepository.create(profileData);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * upload file
	 * @param req
	 * @param res
	 * @param next
	 */
	async uploadFile(req: any, res: any, next: any) {
		try {
			let file: any = await uploadSingle(req, res, 'file', 'profile');
			if (!file) throw new BadRequestException(this.messges.NO_FILE_SELECTED);
			res.json({ path: file.path, url: `uploads/profiles/${file.filename}` });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * updateProFile
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateProfile(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const data: IUpdateProFile = req.body;
			const { profileID } = req.body;
			let existAccountID = await this.accountRepository.getById(ID, { role: 'student' }, '');
			if (!existAccountID) throw new BadRequestException(this.messges.ACCOUNTID_NOT_EXIST);
			let existProfile = await this.proFileRepository.getByOption({ _id: profileID });
			if (!existProfile) throw new BadRequestException(this.messges.NOT_FOUND_PROFILE);
			if (data && data.title) {
				let isTitleExist = await this.proFileRepository.getByOption({ accountID: ID, title: data.title });
				if (isTitleExist) throw new BadRequestException(this.messges.TITLE_IS_EXIST);
			}
			let update = await this.proFileRepository.update(profileID, {
				...data,
			});
			if (data && data.path && update) fs.unlinkSync(existProfile.path);
			res.json(update);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * remove profile
	 * @param req
	 * @param res
	 * @param next
	 */
	async removeProfile(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			let existProfile = await this.proFileRepository.getByOption({ _id: ID });
			let isRemove = await this.proFileRepository.deleteProFile({ _id: ID });
			if (isRemove) fs.unlinkSync(existProfile.path);
			res.json(isRemove);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get all profiles
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAllProFiles(req: any, res: any, next: any) {
		try {
			let { limit, page } = req.query;
			let proFiles = await this.proFileRepository.getAll({}, limit, page);
			res.json(proFiles);
		} catch (error) {
			next(error);
		}
	}
}
export default ProFileController;
