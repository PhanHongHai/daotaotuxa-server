import multer from 'multer';
import UploadRepository from './upload.repository';
import { BadRequestException } from '../../common/error';
import { getMessages } from '../../common/messages/index';

const messges = getMessages('proFile', 'vi');
const uploadRepository = new UploadRepository();
const storageProfile = multer.diskStorage({
	destination: (req, file, cb) => {
		// if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
		// 	cb(null, `src/uploads/images`);
		// else if (file.mimetype === 'application/pdf')
		cb(null, `src/uploads/profiles`);
	},
	filename: (req, file, cb) => {
		let filename = uploadRepository.FormatPathFile(file.originalname);
		cb(null, filename);
		//   cb(null, file.fieldname + '-' + Date.now())
	},
});
const storageDocument = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `src/uploads/documents`);
	},
	filename: (req, file, cb) => {
		let filename = uploadRepository.FormatPathFile(file.originalname);
		cb(null, filename);
	},
});
const storageImage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `src/uploads/images`);
	},
	filename: (req, file, cb) => {
		let filename = uploadRepository.FormatPathFile(file.originalname);
		cb(null, filename);
	},
});

const uploadProfile = multer({
	storage: storageProfile,
	limits: {
		fileSize: 1024 * 1024 * 15,
		files: 1,
	},
	fileFilter: (req: any, file: any, cb: any) => {
		if (
			// file.mimetype === 'image/jpeg' ||
			// file.mimetype === 'image/png' ||
			// file.mimetype === 'image/gif' ||
			file.mimetype === 'application/pdf'
		)
			cb(null, true);
		else cb(messges.FILE_INVALID, false);
	},
});
const uploadDocument = multer({
	storage: storageDocument,
	limits: {
		fileSize: 1024 * 1024 * 15,
		files: 1,
	},
	fileFilter: (req: any, file: any, cb: any) => {
		if (
			// file.mimetype === 'image/jpeg' ||
			// file.mimetype === 'image/png' ||
			// file.mimetype === 'image/gif' ||
			file.mimetype === 'application/pdf'
		)
			cb(null, true);
		else cb(messges.FILE_INVALID, false);
	},
});
const uploadImage = multer({
	storage: storageImage,
	limits: {
		fileSize: 2 * 1024 * 1024,
		files: 1,
	},
	fileFilter: (req: any, file: any, cb: any) => {
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
			cb(null, true);
		else cb(messges.FILE_INVALID, false);
	},
});
const uploadSingle = (req: any, res: any, name: any, type: string) => {
	if (type === 'profile')
		return new Promise((resolve: any, reject: any) => {
			uploadProfile.single(name)(req, res, (err: any) => {
				if (err instanceof multer.MulterError) {
					reject(new BadRequestException(err.message));
				} else if (err) {
					reject(new BadRequestException(err));
				} else {
					resolve(req.file);
				}
			});
		});
	if (type === 'image')
		return new Promise((resolve: any, reject: any) => {
			uploadImage.single(name)(req, res, (err: any) => {
				if (err instanceof multer.MulterError) {
					reject(new BadRequestException(err.message));
				} else if (err) {
					reject(new BadRequestException(err));
				} else {
					resolve(req.file);
				}
			});
		});
	return new Promise((resolve: any, reject: any) => {
		uploadDocument.single(name)(req, res, (err: any) => {
			if (err instanceof multer.MulterError) {
				reject(new BadRequestException(err.message));
			} else if (err) {
				reject(new BadRequestException(err));
			} else {
				resolve(req.file);
			}
		});
	});
};
export { uploadSingle };
