import BaseController from './../../common/base/controller.base';
import SubjectRepository from './subject.repository';
import DocumentRepository from './../documents/document.repository';

import { ICreateSubject, IUpdateSubject } from './subject.inteface';
import { BadRequestException } from '../../common/error';
import { getMessages } from './../../common/messages';
class SubjectController extends BaseController {
	subjectRepository: SubjectRepository;
	documentRepository: DocumentRepository;
	messges = getMessages('subject', 'vi');

	constructor() {
		super();
		this.subjectRepository = new SubjectRepository();
		this.documentRepository = new DocumentRepository();
	}
	/**
	 * get and search Subject
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getAll(req: any, res: any, next: any) {
		try {
			let subjects = await this.subjectRepository.getAll();
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get and search Subject
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword } = req.query;
			let subjects = await this.subjectRepository.getAndSearch(keyword, limit, page);
			console.log(subjects);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	async getAndSearchSubjectGroupBy(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword } = req.query;
			const skip = Number(page) * Number(limit) - Number(limit);
			let documents = await this.subjectRepository.getAndSearchSubjectGroupDocument(keyword, Number(limit), skip);
			res.json({ docs: documents, total: documents.length, limit, page });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get detail Subject
	 * @param res any
	 * @param req any
	 * @param next any
	 */
	async getDetailSubject(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let subjects = await this.subjectRepository.getById(ID);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	async getInfoBySubject(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let returnData = {};
			let subject = await this.subjectRepository.getById(ID);
			if (!subject) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT);
			if (subject) {
				let countDocument = await this.documentRepository.getCount({ subjectID: ID, type: 'document' });
				let countLesson = await this.documentRepository.getCount({ subjectID: ID, type: 'lesson' });
				let countHomeWork = await this.documentRepository.getCount({ subjectID: ID, type: 'homework' });
				returnData = { subject, countDocument, countLesson, countHomeWork };
			}
			res.json(returnData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create Subject
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async createSubject(req: any, res: any, next: any) {
		try {
			let subjectData: ICreateSubject = req.body;
			let exsitName = await this.subjectRepository.getByOption({
				name: subjectData.name,
			});
			let exsitTag = await this.subjectRepository.getByOption({
				tag: subjectData.tag,
			});
			if (exsitName) throw new BadRequestException(this.messges.NAME_IS_EXSIT);
			if (exsitTag) throw new BadRequestException(this.messges.TAG_IS_EXSIT);
			let subjects = await this.subjectRepository.create(subjectData);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update Subject by ID
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateSubject(req: any, res: any, next: any) {
		try {
			let subjectData: IUpdateSubject = req.body;
			let { ID } = req.params;
			let exsitSubject = await this.subjectRepository.getById(ID);
			if (!exsitSubject) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT);
			if (subjectData.tag) {
				let exsitTag = await this.subjectRepository.getByOption({
					tag: subjectData.tag,
				});
				if (exsitTag) throw new BadRequestException(this.messges.TAG_IS_EXSIT);
			}
			if (subjectData.name) {
				let exsitName = await this.subjectRepository.getByOption({
					name: subjectData.name,
				});
				if (exsitName) throw new BadRequestException(this.messges.NAME_IS_EXSIT);
			}
			let updateSubject = await this.subjectRepository.update(ID, subjectData);
			res.json({ isUpdated: updateSubject });
		} catch (error) {
			next(error);
		}
	}

	async deleteSubject(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let exsitSubject = await this.subjectRepository.getById(ID);
			if (!exsitSubject) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT);
			let isDeleted = await this.subjectRepository.remove(ID);
			if (isDeleted) {
				await this.documentRepository.removeMany({ subjectID: ID });
			}
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}
export default SubjectController;
