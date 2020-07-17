import GroupRuleModel from './groupRule.model';
import { IGroupRule, ICreateGroupRule } from './groupRule.interface';
import { Types } from 'mongoose';

class GroupRuleRepository {
	constructor() {}

	async create(data: ICreateGroupRule): Promise<IGroupRule> {
		return await GroupRuleModel.create(data);
	}
	async update(id: Types.ObjectId, dataUpdate: any) {
		const isUpdated = await GroupRuleModel.updateOne(
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
	async getUserRuleByData(data: any, selectOption: string) {
		return GroupRuleModel.find({
			...data,
		}).select(selectOption);
	}
	async getAll(limit: number = 12, page: number = 1) {
		return GroupRuleModel.paginate(
			{
				isDeleted: false,
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
			},
		);
	}
	async getGroupById(_id: string): Promise<ICreateGroupRule | null | any> {
		return GroupRuleModel.findOne({ _id });
	}
	async getGroupByName(name: string): Promise<ICreateGroupRule | null | any> {
		return GroupRuleModel.findOne({ name });
	}
	async search(keyword: string = '', limit: number = 12, page: number = 1) {
		const regex = new RegExp(keyword, 'i');
		return GroupRuleModel.paginate(
			{
				$or: [{ name: { $regex: regex } }],
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
			},
		);
	}
}

export default GroupRuleRepository;
