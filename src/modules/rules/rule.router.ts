import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import RuleController from './rule.controller';

// Validator Schemas
import { GetListValidatorSchemas } from '../../common/validatorSchemas';
import { authorize } from '../../middlewares/authorize';

const ruleController = new RuleController();
var router = express.Router();

router.use(authorize(['admin', 'employment']));

router
	.route('/')
	// get rules
	.get(validatorQuery(GetListValidatorSchemas), ruleController.getList)
export default router;
