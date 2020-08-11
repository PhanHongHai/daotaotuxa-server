import ClassModel from './class.model';
import { IClass, IClassInfo, ICreateClass, IGetReportTotalOptions } from './class.interface';
import { Types } from 'mongoose';
import moment from 'moment';

class ClassRepository {
	constructor() {}

	// count number class
	async countNumberClass(option: object = {}): Promise<number> {
		return await ClassModel.count({ isDeleted: false, ...option });
	}

	// search class with keyword: name or status
	async getAndSearch(
		keyword: string = '',
		limit: number = 10,
		page: number = 1,
		status: string = '',
	): Promise<IClass | null | any> {
		const regex = new RegExp(keyword, 'i');
		const regexStatus = new RegExp(status, 'i');
		return ClassModel.paginate(
			{
				isDeleted: false,
				name: { $regex: regex },
				status: { $regex: regexStatus },
			},
			{
				populate: [
					{
						path: 'trainingSectorID',
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	// get and search by training sector
	async getAndSearchByTrainingSector(
		keyword: string = '',
		limit: number = 10,
		page: number = 1,
		sectorID: Types.ObjectId,
	): Promise<IClass | null | any> {
		const regex = new RegExp(keyword, 'i');
		return ClassModel.paginate(
			{
				isDeleted: false,
				name: { $regex: regex },
				status: 'HP',
				trainingSectorID: sectorID,
			},
			{
				populate: [
					{
						path: 'trainingSectorID',
					},
				],
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	async existClassName(name: String, select: string = ''): Promise<IClass | null> {
		return ClassModel.findOne({
			name,
			isDeleted: false,
		}).select(select);
	}

	// analysis class
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCount(option: object): Promise<IClass | any> {
		return await ClassModel.count({
			...option,
			isDeleted: false,
		});
	}

	/**
	 * exist class: exist Class and TrainingSector
	 * @param name
	 * @param select
	 */
	async existClass(name: String, trainingSectorID: Types.ObjectId, select: string = ''): Promise<IClass | null> {
		return ClassModel.findOne({
			name: name,
			trainingSectorID: trainingSectorID,
			isDeleted: false,
		}).select(select);
	}

	async getById(targetId: Types.ObjectId, select: string = ''): Promise<any | null> {
		return ClassModel.findOne({
			_id: targetId,
			isDeleted: false,
		})
			.select(select)
			.populate('trainingSectorID');
	}

	/**
	 * get by option
	 * @param option object
	 * @param select
	 */
	async getByOption(option: object, select: string = ''): Promise<IClass | any> {
		return await ClassModel.findOne({
			...option,
			isDeleted: false,
		}).select(select);
	}

	async getManyByOption(limit: number = 10, page: number = 1, option: object) {
		return ClassModel.paginate(
			{
				isDeleted: false,
				...option,
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}
	async create(data: ICreateClass): Promise<IClass | any> {
		return ClassModel.create(data);
	}

	async update(id: string, dataUpdate: any) {
		const isUpdated = await ClassModel.updateOne(
			{
				_id: id,
			},
			{
				...dataUpdate,
			},
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}

	async getAll(data: any = {}, limit: number = 12, page: number = 1) {
		return ClassModel.paginate(
			{
				isDeleted: false,
				...data,
			},
			{
				populate: 'trainingSectorID',
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '',
			},
		);
	}

	async remove(targetId: string): Promise<Boolean> {
		const isUpdated = await ClassModel.updateOne(
			{
				_id: targetId,
			},
			{ isDeleted: true },
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}
	/**
	 * xoa nhieu thang`
	 * @param option dieu kien
	 */
	async removeMany(option: object): Promise<Boolean> {
		const isUpdated = await ClassModel.updateMany(
			{
				...option,
			},
			{ isDeleted: true },
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}

	async getReportsTotals() {
		const reports = await ClassModel.aggregate([
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$group: {
					_id: 0,
					totalClass: {
						$sum: 1,
					},
					totalClassOpening: {
						$sum: {
							$cond: [{ $eq: ['$status', 'OP'] }, 1, 0],
						},
					},
					totalClassEnd: {
						$sum: {
							$cond: [{ $eq: ['$status', 'END'] }, 1, 0],
						},
					},
					totalClassProcess: {
						$sum: {
							$cond: [{ $eq: ['$status', 'HP'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					totalClass: 1,
					totalClassOpening: 1,
					totalClassEnd: 1,
					totalClassProcess: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					totalClass: 1,
					totalClassOpening: 1,
					totalClassEnd: 1,
					totalClassProcess: 1,
			  };
	}
	async getReportsTotals30day(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await ClassModel.aggregate([
			{
				$match: {
					isDeleted: false,
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: 0,
					totalClass: {
						$sum: 1,
					},
					totalClassOpening: {
						$sum: {
							$cond: [{ $eq: ['$status', 'OP'] }, 1, 0],
						},
					},
					totalClassEnd: {
						$sum: {
							$cond: [{ $eq: ['$status', 'END'] }, 1, 0],
						},
					},
					totalClassProcess: {
						$sum: {
							$cond: [{ $eq: ['$status', 'HP'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					totalClass: 1,
					totalClassOpening: 1,
					totalClassEnd: 1,
					totalClassProcess: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					totalClass: 1,
					totalClassOpening: 1,
					totalClassEnd: 1,
					totalClassProcess: 1,
			  };
	}
	async reportTotalClassByTrainingType(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await ClassModel.aggregate([
			{
				$match: {
					isDeleted: false,
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$lookup: { from: 'trainingsectors', localField: 'trainingSectorID', foreignField: '_id', as: 'sector' },
			},
			{ $unwind: '$sector' },
			{
				$group: {
					_id: '$sector.type',
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					key: '$_id',
					total: 1,
				},
			},
		]);
		return reports;
	}
	async reportTotalClassByTrainingSector(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await ClassModel.aggregate([
			{
				$match: {
					isDeleted: false,
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$lookup: { from: 'trainingsectors', localField: 'trainingSectorID', foreignField: '_id', as: 'sector' },
			},
			{ $unwind: '$sector' },
			{
				$group: {
					_id: '$sector.name',
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					key: '$_id',
					total: 1,
				},
			},
		]);
		return reports;
	}
	async getReportsTotalClassByYear(year: number) {
		const reports = await ClassModel.aggregate([
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$group: {
					_id: 0,
					january: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '01'] },
									],
								},
								1,
								0,
							],
						},
					},
					febraury: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '02'] },
									],
								},
								1,
								0,
							],
						},
					},
					march: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '03'] },
									],
								},
								1,
								0,
							],
						},
					},
					april: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '04'] },
									],
								},
								1,
								0,
							],
						},
					},
					may: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '05'] },
									],
								},
								1,
								0,
							],
						},
					},
					june: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '06'] },
									],
								},
								1,
								0,
							],
						},
					},
					july: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '07'] },
									],
								},
								1,
								0,
							],
						},
					},
					august: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '08'] },
									],
								},
								1,
								0,
							],
						},
					},
					september: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '09'] },
									],
								},
								1,
								0,
							],
						},
					},
					october: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '10'] },
									],
								},
								1,
								0,
							],
						},
					},
					november: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '11'] },
									],
								},
								1,
								0,
							],
						},
					},
					december: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '12'] },
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					january: 1,
					febraury: 1,
					march: 1,
					april: 1,
					may: 1,
					june: 1,
					july: 1,
					august: 1,
					september: 1,
					october: 1,
					november: 1,
					december: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					january: 1,
					febraury: 1,
					march: 1,
					april: 1,
					may: 1,
					june: 1,
					july: 1,
					august: 1,
					september: 1,
					october: 1,
					november: 1,
					december: 1,
			  };
	}
}

export default ClassRepository;
