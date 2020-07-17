import BaseController from '../../common/base/controller.base';
import RuleRepository from './rule.respository';

class RuleController extends BaseController {
  ruleRepository: RuleRepository;
  constructor() {
    super();
    this.ruleRepository = new RuleRepository();
  }
  /**
  * 
  * @param req 
  * @param res 
  * @param next 
  */
  async getList(req: any, res: any, next: any) {
    try {
      const rules = await this.ruleRepository.getAll();
      res.json(rules);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
}

export default RuleController;