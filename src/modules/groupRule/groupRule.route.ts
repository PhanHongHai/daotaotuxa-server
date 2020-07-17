import express from 'express';
import { validatorBody, validatorParam } from '../../middlewares';
import GroupRuleController from './groupRule.controller';

// Validator Schemas
import { CreateAndUpdateGroupRuleValidatorSchema } from './groupRule.validatorSchemas';
import { IdMongoValidatorSchemas } from '../../common/validatorSchemas';

import { authorize } from '../../middlewares/authorize';

const groupRuleController = new GroupRuleController();
var router = express.Router();

router.use(authorize(['admin', 'employment']));

router.post('/', validatorBody(CreateAndUpdateGroupRuleValidatorSchema), groupRuleController.update);
router.get('/', groupRuleController.getRuleByUser);
router.get('/:ID', validatorParam(IdMongoValidatorSchemas), groupRuleController.getRuleById);


export default router;
