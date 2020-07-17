import express from 'express';
import fs from 'fs';
import AccountController from './modules/accounts/account.controller';
import ClassDetailController from './modules/classDetail/classDetail.controller';
import { validatorBody, validatorParam } from './middlewares';
import { authorize } from './middlewares/authorize';
// validate schema
import { LoginAccountValidatorSchema } from './modules/accounts/validatorSchemas/account.login.validatorSchemas';
import { IdMongoValidatorSchemas } from './common/validatorSchemas/IdMongo.validatorSchemas';
import { UpdateAccountValidatorSchema } from './modules/accounts/validatorSchemas/account.update.validatorSchemas';
import {
	VerifyAccountValidatorSchema,
	ResetPasswordValidatorSchema,
} from './modules/accounts/validatorSchemas/account.sendMail.validatorSchemas';
import { ChangePasswordValidatorSchemas } from './modules/accounts/validatorSchemas/account.changePassword.validatorSchemas';
import { BadRequestException } from './common/error';

var router = express.Router();

const accountController = new AccountController();
const classDetailController = new ClassDetailController();
// general route

// login
router.post('/login', validatorBody(LoginAccountValidatorSchema), accountController.login);

// router.get('/detail-class',authorize(['student']),classDetailController.getInfoClassByStudentID);
// get account data
router.get('/fetch-profile', authorize(), accountController.getProfile);
// send request forgot password
router.post('/resend-forgot-password', accountController.sendForgotPassword);
// update new password
router.patch('/reset-password', validatorBody(ResetPasswordValidatorSchema), accountController.resetPassword);

// check active account
router.get('/check-active/:verifyToken', accountController.checkActivedAccount);
// active account
router.patch('/active/:verifyToken', accountController.activedAccount);

// resend verify mail
router.post('/resend-verify', validatorBody(VerifyAccountValidatorSchema), accountController.resendVerifyMail);
// upload avatar
router.post('/upload-avatar', accountController.uploadFile);
// change-Password
router.patch(
	'/change-password',
	authorize(),
	validatorBody(ChangePasswordValidatorSchemas),
	accountController.changePassword,
);

// update account data
router.patch(
	'/update-account',
	authorize(),
	validatorParam(IdMongoValidatorSchemas),
	validatorBody(UpdateAccountValidatorSchema),
	accountController.updateAccount,
);

// remove temp file
router.patch('/remove-file', authorize(), (req: any, res: any, next: any) => {
	try {
		const { path } = req.body;
		if (!path) throw new BadRequestException('Không tìm thấy đường dẫn tệp');
		fs.unlinkSync(path);
		res.json({ isRemoved: true });
	} catch (error) {
		next(error);
	}
});

export default router;
