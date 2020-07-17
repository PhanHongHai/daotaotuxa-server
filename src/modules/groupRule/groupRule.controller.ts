import BaseController from '../../common/base/controller.base';
import GroupRuleRepository from './groupRule.respository';
import { UnauthorizedException, BadRequestException, NotFoundException } from '../../common/error';

// message
import { getMessages } from '../../common/messages/index';
import RuleRepository from './../rules/rule.respository';

class RuleController extends BaseController {
	groupRuleRepository: GroupRuleRepository;
	ruleRepository: RuleRepository;
	messges = getMessages('groupRule', 'vi');

	constructor() {
		super();
		this.groupRuleRepository = new GroupRuleRepository();
		this.ruleRepository = new RuleRepository();
	}
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	async update(req: any, res: any, next: any) {
		try {
			let { accountID, name } = req.body;
			let rules = await this.ruleRepository.getAll();
			let ruleNotExist = rules.indexOf(name);
			if (ruleNotExist < 0) {
				throw new BadRequestException(this.messges.RULE_NOT_EXIST);
			}
			let list = await this.groupRuleRepository.getUserRuleByData({ accountID, name },"name READ WRITE _id");
			if (list.length > 0) {
				let create = await this.groupRuleRepository.update(list[0]._id, req.body);
				res.json(create);
			} else {
				let create = await this.groupRuleRepository.create(req.body);
				res.json(create);
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get group rule by account
	 * @param req
	 * @param res
	 * @param next
	 */
	async getRuleByUser(req: any, res: any, next: any) {
		try {
			let { userID } = req;
			let list = await this.groupRuleRepository.getUserRuleByData({ accountID: userID },"name READ WRITE -_id");
			res.json(list);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get group rule by id
	 * @param req
	 * @param res
	 * @param next
	 */
	async getRuleById(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let list = await this.groupRuleRepository.getUserRuleByData({ accountID: ID },"name READ WRITE -_id");
			res.json(list);
		} catch (error) {
			next(error);
		}
	}
}

export default RuleController;
