import BaseController from './../../common/base/controller.base';
import SubjectProgressRepository from './subjectProgress.repository';

import { ICreateSubjectProgress } from './subjectProgress.inteface';
import { BadRequestException } from '../../common/error';
import { getMessages } from './../../common/messages';
class SubjectProgressController extends BaseController {
	subjectProgressRepository: SubjectProgressRepository;
	messges = getMessages('subjectProgress', 'vi');

	constructor() {
		super();
		this.subjectProgressRepository = new SubjectProgressRepository();
	}
	/**
	 * get Subject progress by accountID
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getAll(req: any, res: any, next: any) {
		try {
			let { accountID, subjectID } = req.params;
			let subjectsProgress = await this.subjectProgressRepository.getManyByOption(
				{ accountID, subjectID },
				'subjectID progress',
			);
			res.json(subjectsProgress);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get Subject progress by accountID
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getAllByAccountID(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let subjectsProgress = await this.subjectProgressRepository.getByAccountID(ID, 'subjectID progress');
			res.json(subjectsProgress);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get Subject progress by accountID
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getProgressByStudentID(req: any, res: any, next: any) {
		try {
			let { userID } = req;
			let subjectsProgress = await this.subjectProgressRepository.getManyByOption(
				{ accountID: userID },
				'subjectID progress',
			);
			res.json(subjectsProgress);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get detail Subject progress by subjectID & accountID
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getDetailSubjectProgress(req: any, res: any, next: any) {
		try {
			let { subjectID } = req.query;
			let { userID } = req;
			let subjectProgress = await this.subjectProgressRepository.getDetailProgress(subjectID, userID);
			if (subjectProgress !== null) res.json(subjectProgress);
			else res.json({});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create Subject progress
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async createSubjectProgress(req: any, res: any, next: any) {
		try {
			let { userID } = req;
			let subjectProgressData: ICreateSubjectProgress = req.body;
			subjectProgressData.accountID = userID;
			let exsitSubject = await this.subjectProgressRepository.getByOption({
				subjectID: subjectProgressData.subjectID,
				accountID: subjectProgressData.accountID,
			});
			if (exsitSubject) {
				let updateSubject = await this.subjectProgressRepository.update(exsitSubject._id, {
					documents: subjectProgressData.documents,
					progress: subjectProgressData.progress,
				});
				res.json({ isProcessed: updateSubject });
			}
			let subjectsProgress = await this.subjectProgressRepository.create(subjectProgressData);
			res.json({ isProcessed: true, data: subjectsProgress });
		} catch (error) {
			next(error);
		}
	}

	// /**
	//  * Update Subject Progress by ID
	//  * @param req any
	//  * @param res any
	//  * @param next any
	//  */
	// async updateSubjectProgress(req: any, res: any, next: any) {
	// 	try {
	// 		let subjectProgressData: IUpdateSubjectProgress = req.body;
	// 		let { ID } = req.params;
	// 		let exsitSubjectProgress = await this.subjectProgressRepository.getByOption({ _id: ID });
	// 		if (!exsitSubjectProgress) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT_PROGRESS);
	// 		let updateSubject = await this.subjectProgressRepository.update(ID, subjectProgressData);
	// 		res.json({ isUpdated: updateSubject });
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }

	async deleteSubjectProgress(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let exsitSubjectProgress = await this.subjectProgressRepository.getByOption({ _id: ID });
			if (!exsitSubjectProgress) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT_PROGRESS);
			let isDeleted = await this.subjectProgressRepository.remove(ID);
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}
export default SubjectProgressController;
