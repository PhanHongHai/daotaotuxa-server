import BaseController from './../../common/base/controller.base';
import GroupSubjectRepository from './groupSubject.repository';
import SubjectRepository from './../subjects/subject.repository';
import TrainingSectorRepository from './../trainingSector/TrainingSector.repository';
import ClassRepository from './../classes/class.repository';
import { BadRequestException } from '../../common/error';
import { getMessages } from './../../common/messages';
import { Types } from 'mongoose';
import { ICreateGroupSubject } from './groupSubject.interface';

class GroupSubjectController extends BaseController {
	groupSubjectRepository: GroupSubjectRepository;
	subjectRepository: SubjectRepository;
	trainingSectorRepository: TrainingSectorRepository;
	classRepository: ClassRepository;

	messges = getMessages('groupSubject', 'vi');

	constructor() {
		super();
		this.groupSubjectRepository = new GroupSubjectRepository();
		this.subjectRepository = new SubjectRepository();
		this.trainingSectorRepository = new TrainingSectorRepository();
		this.classRepository = new ClassRepository();
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
			let subjects = await this.groupSubjectRepository.getAndSearch(keyword, limit, page);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get list subject in sectorID
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async getListSubject(req: any, res: any, next: any) {
		try {
			let { limit, page, sectorID, keyword } = req.query;
			let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: sectorID });
			if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);
			let subjects = await this.groupSubjectRepository.getSubjectOfSector(sectorID, limit, page, keyword);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	
	/**
	 * get subject all by sectorID
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async getAllBySector(req: any, res: any, next: any) {
		try {
			let { sectorID,} = req.query;
			let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: sectorID });
			if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);
			let subjects = await this.groupSubjectRepository.getArrSubjectsOfSector(sectorID);
			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}


	/**
	 * get list subject in sectorID group file
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async getListSubjectGroupFile(req: any, res: any, next: any) {
		try {
			let { limit, page, sectorID, keyword } = req.query;
			const skip = Number(limit) * Number(page) - Number(limit);
			let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: sectorID });
			if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);
			let subjects = await this.groupSubjectRepository.getSubjectOfSectorGroupFile(
				sectorID,
				Number(limit),
				skip,
				keyword,
			);
			res.json({ docs: subjects, limit, page, total: subjects.length });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get list subject other by classID & subjectID
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async getListSubjectOther(req: any, res: any, next: any) {
		try {
			let { limit, page, subjectID, keyword, classID } = req.query;
			let existClass = await this.classRepository.getById(classID);
			if (existClass) {
				let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: existClass.trainingSectorID });
				if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);
				let subjects = await this.groupSubjectRepository.getSubjectOtherOfSector(
					exsitSectorID._id,
					subjectID,
					limit,
					page,
					keyword,
				);
				res.json(subjects);
			}
			if (!existClass) throw new BadRequestException(this.messges.NOT_EXSIT_CLASS);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * get all list subject except subject in sectorID
	 * @param req any
	 * @param res any
	 * @param next any
	 */
	async getAllListSubject(req: any, res: any, next: any) {
		try {
			let { keyword, limit, page, sectorID } = req.query;

			let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: sectorID });
			if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);

			let subjects = await this.groupSubjectRepository.findByOption({ sectorID }, 'subjectID');
			let listSubject: Types.ObjectId[] = [];
			subjects.forEach(element => {
				listSubject.push(element.subjectID);
			});
			let allSubject = await this.subjectRepository.getAllByOption({ _id: { $nin: listSubject } }, keyword, limit, page);
			res.json(allSubject);
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
	async createGroupSubject(req: any, res: any, next: any) {
		try {
			let data: ICreateGroupSubject = req.body;
			let exsitSectorID = await this.trainingSectorRepository.getByOption({ _id: data.sectorID });
			if (!exsitSectorID) throw new BadRequestException(this.messges.NOT_EXSIT_SECTOR);

			let exsitSubjecID = await this.subjectRepository.getByOption({ _id: data.subjectID });
			if (!exsitSubjecID) throw new BadRequestException(this.messges.NOT_EXSIT_SUBJECT);

			let exsitGroupSubject = await this.groupSubjectRepository.getByOption({
				sectorID: data.sectorID,
				subjectID: data.subjectID,
			});
			if (exsitGroupSubject) throw new BadRequestException(this.messges.GROUPSUBJECT_IS_EXSIT);
			let groupSubjects = await this.groupSubjectRepository.create(data);
			res.json(groupSubjects);
		} catch (error) {
			next(error);
		}
	}

	async deleteSubject(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let exsitSubject = await this.groupSubjectRepository.getById(ID);
			if (!exsitSubject) throw new BadRequestException(this.messges.NOT_EXSIT_GROUPSUBJECT);
			let isDeleted = await this.groupSubjectRepository.remove(ID);
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}
export default GroupSubjectController;
