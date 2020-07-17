import BaseController from './../../common/base/controller.base';
import DocumentRepository from './document.repository';
import SubjectRepository from './../subjects/subject.repository';
import { BadRequestException, NotFoundException } from './../../common/error';
import fs from 'fs';
import { getMessages } from './../../common/messages/index';
import { uploadSingle } from './../upload/upload.services';
import { ICreateDocument, IUpdateDocument } from './document.interface';

class DocumentController extends BaseController {
	documentRepository: DocumentRepository;
	subjectRepository: SubjectRepository;
	message = getMessages('document', 'vi');
	constructor() {
		super();
		this.documentRepository = new DocumentRepository();
		this.subjectRepository = new SubjectRepository();
	}

	/**
	 * upload file
	 * @param req
	 * @param res
	 * @param next
	 */
	async uploadFile(req: any, res: any, next: any) {
		try {
			let file: any = await uploadSingle(req, res, 'file', 'documents');
			if (!file) throw new BadRequestException(this.message.NO_FILE_SELECTED);
			res.json({ path: file.path, url: `uploads/documents/${file.filename}`, size: file.size });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * create document
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async createDocument(req: any, res: any, next: any) {
		try {
			const documentData: ICreateDocument = req.body;
			// verify SubjecID
			let existSubjectID = await this.subjectRepository.getByOption({ _id: documentData.subjectID });
			if (!existSubjectID) throw new NotFoundException(this.message.NOT_EXSIT_SUBJECT);
			let existTitle = await this.documentRepository.getByOption({
				subjectID: documentData.subjectID,
				title: documentData.title,
				type: documentData.type,
			});
			if (existTitle) throw new BadRequestException(this.message.TITLE_IS_EXIST);
			let create = await this.documentRepository.create(documentData);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * update document
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async updateDocument(req: any, res: any, next: any) {
		try {
			const { ID } = req.params; // subject id
			const documentData: IUpdateDocument = req.body;
			const { documentID } = req.body;
			// check
			let existSubjectID = await this.subjectRepository.getByOption({ _id: ID });
			if (!existSubjectID) throw new NotFoundException(this.message.NOT_EXSIT_SUBJECT);
			let existDocument = await this.documentRepository.getByOption({ _id: documentID });
			if (!existDocument) throw new NotFoundException(this.message.DOCUMENT_IS_NOT_EXIST);
			if (documentData.title) {
				let existTitle = await this.documentRepository.getByOption({
					subjectID: ID,
					title: documentData.title,
					type: existDocument.type,
				});
				if (existTitle) throw new BadRequestException(this.message.TITLE_IS_EXIST);
			}

			let update = await this.documentRepository.update(documentID, documentData);
			res.json(update);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * remove document
	 * @param req
	 * @param res
	 * @param next
	 */
	async removeDocument(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			let existDocument = await this.documentRepository.getByOption({ _id: ID });
			if (!existDocument) throw new NotFoundException(this.message.DOCUMENT_IS_NOT_EXIST);
			let isDelete = await this.documentRepository.remove(ID);
			res.json(isDelete);
		} catch (error) {}
	}
	/**
	 * get document by id
	 * @param req anyy
	 * @param res any
	 * @param next any
	 */
	async getDocumentById(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const document = await this.documentRepository.getByOption({ _id: ID });
			if (!document) throw new NotFoundException(this.message.DOCUMENT_IS_NOT_EXIST);
			else res.json(document);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get and search by keyword && subjectID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearch(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, subjectID, type } = req.query;
			let documents = await this.documentRepository.getAll({ subjectID, type }, keyword, limit, page);
			res.json(documents);
		} catch (error) {
			next(error);
		}
	}

}
export default DocumentController;
