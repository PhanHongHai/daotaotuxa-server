import excel from 'exceljs';

import BaseController from '../../common/base/controller.base';

import ClassDetailRepository from './classDetail.repository';
import AccountRepository from '../accounts/account.repository';
import ClassRepository from '../classes/class.repository';

import { BadRequestException, NotFoundException } from '../../common/error';

// interfaces

import { ICreateClassDetail } from './classDetail.interface';
import { getMessages } from '../../common/messages/index';
import moment from 'moment';

import countries from '../../utils/country';

function getNameCountry(arrValue: any[], itemKey: string) {
	let result = arrValue.find(ele => ele.key == itemKey);
	if (result) return result.name;
	return 'Không xác định';
}

class ClassDetailController extends BaseController {
	ClassDetailRepository: ClassDetailRepository;
	AccountRepository: AccountRepository;
	ClassRepository: ClassRepository;

	messges = getMessages('classDetail', 'vi');

	constructor() {
		super();
		this.ClassDetailRepository = new ClassDetailRepository();
		this.AccountRepository = new AccountRepository();
		this.ClassRepository = new ClassRepository();
	}

	/**
	 * export student of class to excel
	 * @param req
	 * @param res
	 * @param next
	 */
	async exportStudentListOfClassByTeacher(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let classDetail = await this.ClassRepository.getById(ID);
			if (!classDetail) throw new BadRequestException(this.messges.CLASS_IS_NOT_EXIST);
			let students = await this.ClassDetailRepository.getStudentsByOption({ classID: ID });
			let dataStudentsArr: object[] = [];
			students.forEach((ele: any, index: number) =>
				dataStudentsArr.push({
					stt: index + 1,
					tag: ele.accountID && ele.accountID.tag,
					name: ele.accountID && ele.accountID.name,
					email: ele.accountID && ele.accountID.email ? ele.accountID.email : '',
					sex: ele.accountID && ele.accountID.sex == 1 ? 'Nam' : 'Nữ',
					birthDay: ele.accountID && moment(ele.accountID.birthDay).format('DD-MM-YYYY'),
					idCard: ele.accountID && ele.accountID.idCard,
					phoneNumber: ele.accountID && ele.accountID.phoneNumber,
					address: ele.accountID && getNameCountry(countries, ele.accountID.country),
				}),
			);
			let workbook = new excel.Workbook();

			let worksheet = workbook.addWorksheet('Danh sách');
			const row = worksheet.getRow(1);
			row.hidden = true;
			worksheet.mergeCells('D4:F4');
			worksheet.mergeCells('G2:I2');
			//	worksheet.mergeCells('G2','H2','I2');
			worksheet.mergeCells('G3:I3');
			worksheet.getCell('C6').value = 'Mã lớp học :' + classDetail.tag;
			worksheet.getCell('C7').value = 'Tên lớp học :' + classDetail.name;
			worksheet.getCell('G2').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
			worksheet.getCell('G2').font = {
				family: 4,
				size: 17,
				bold: true,
			};
			worksheet.getCell('G2').alignment = { horizontal: 'center' };
			worksheet.getCell('G3').value = 'Độc lập - Tự do - Hạnh phúc';
			worksheet.getCell('G3').font = {
				family: 4,
				size: 14,
				underline: true,
			};
			worksheet.getCell('G3').alignment = { vertical: 'middle', horizontal: 'center' };
			worksheet.getCell('D4').value = 'DANH SÁCH HỌC VIÊN';
			worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
			worksheet.getCell('D4').font = {
				family: 4,
				size: 17,
				bold: true,
			};
			worksheet.getRow(9).values = [
				'STT',
				'MSHV',
				'Họ Tên',
				'Email',
				'Giới Tính',
				'Ngày Sinh',
				'CMND',
				'Số Điện Thoại',
				'Địa Chỉ',
			];
			worksheet.columns = [
				{ header: 'STT', key: 'stt', width: 10 },
				{ header: 'MSHV', key: 'tag', width: 10 },
				{ header: 'Họ Tên', key: 'name', width: 30 },
				{ header: 'Email', key: 'email', width: 30 },
				{ header: 'Giới Tính', key: 'sex', width: 15 },
				{ header: 'Ngày Sinh', key: 'birthDay', width: 20 },
				{ header: 'CMND', key: 'idCard', width: 15 },
				{ header: 'Số Điện Thoại', key: 'phoneNumber', width: 20 },
				{ header: 'Địa Chỉ', key: 'address', width: 35 },
			];

			// Add Array Rows
			worksheet.addRows(dataStudentsArr);
			worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
				if (rowNumber >= 9) {
					worksheet.getCell(`A${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					worksheet.getCell(`A${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };

					const insideColumns = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
					insideColumns.forEach(v => {
						worksheet.getCell(`${v}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
						worksheet.getCell(`${v}${rowNumber}`).border = {
							top: { style: 'thin' },
							bottom: { style: 'thin' },
							left: { style: 'thin' },
							right: { style: 'thin' },
						};
					});

					worksheet.getCell(`F${rowNumber}`).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				}
			});
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', 'attachment; filename=' + 'test.xlsx');

			workbook.xlsx
				.write(res)
				.then(function() {
					res.end();
					console.log('File write done........');
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({ errors: 'Lỗi hệ thống' });
				});
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get student of class by classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearchStudentOfClass(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID } = req.query;
			let students = await this.ClassDetailRepository.getAndSearchStudentClass(keyword, limit, page, classID);
			res.json(students);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get info teacher of class by classID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getInfoTeacherOfClass(req: any, res: any, next: any) {
		try {
			let { ID } = req.params;
			let infoTeacher = await this.ClassDetailRepository.getInfoTeacher(ID);
			if (infoTeacher) res.json(infoTeacher);
			res.json({});
		} catch (error) {
			next(error);
		}
	}

	async getStudentsOfClassByTeacher(req: any, res: any, next: any) {
		try {
			let { limit, page, keyword, classID } = req.query;
			const skip = Number(limit) * Number(page) - Number(limit);
			let total = await this.ClassDetailRepository.getStudentsByOption({ classID });
			let students = await this.ClassDetailRepository.getAndSearchStudentOfClassByTeacher(
				keyword,
				Number(limit),
				skip,
				classID,
			);
			if (students) res.json({ docs: students, limit, page, total: total != null ? total.length : 0 });
			else res.json({ docs: [], limit, page, total: 0 });
		} catch (error) {
			next(error);
		}
	}

	async addAccountToClassDetail(req: any, res: any, next: any) {
		try {
			let data: ICreateClassDetail = req.body;

			// verify class & account not exist
			let checkExist = await this.ClassDetailRepository.checkExist(data.accountID, data.classID);
			if (checkExist && checkExist.length > 0) throw new BadRequestException(this.messges.CLASSDETAIL_IS_EXIST);
			// verify account not exist
			let verifyAccountID = await this.AccountRepository.getAccountByOption({ _id: data.accountID });
			if (!verifyAccountID) throw new BadRequestException(this.messges.ACCOUNT_IS_NOT_EXIST);
			// verify classID not exist
			let verifyClassID = await this.ClassRepository.getByOption({ _id: data.classID }, '');
			if (!verifyClassID) throw new BadRequestException(this.messges.CLASS_ID_IS_NOT_EXIST);
			// verify role account teacher and student
			if (verifyAccountID && verifyAccountID.role !== 'teacher' && verifyAccountID.role !== 'student')
				throw new BadRequestException(this.messges.ROLE_ACCOUNT_IS_NOT_VALID);
			if (verifyAccountID && verifyAccountID.role === 'teacher') {
				let exsitTeacher = await this.ClassDetailRepository.getByOption({
					classID: data.classID,
					typeAccount: 'teacher',
				});
				if (exsitTeacher) {
					await this.ClassDetailRepository.remove(exsitTeacher._id);
					await this.AccountRepository.update(exsitTeacher.accountID, { isInClass: false });
					data.typeAccount = 'teacher';
					let create = await this.ClassDetailRepository.create(data);
					if (create) await this.AccountRepository.update(data.accountID, { isInClass: true });
					res.json(create);
				} else {
					data.typeAccount = 'teacher';
					let create = await this.ClassDetailRepository.create(data);
					if (create) await this.AccountRepository.update(data.accountID, { isInClass: true });
					res.json(create);
				}
			}
			if (verifyAccountID && verifyAccountID.role === 'student') {
				let create = await this.ClassDetailRepository.create(data);
				if (create) await this.AccountRepository.update(data.accountID, { isInClass: true });
				res.json(create);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Remove Class
	 * @param req
	 * @param res
	 * @param next
	 */

	async deleteClassDetail(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const exisitAccount = await this.ClassDetailRepository.getByID(ID);
			if (!exisitAccount) {
				throw new NotFoundException(this.messges.NOT_FOUNT_CLASS_DETAILE_DELETE);
			}
			const isDeleted = await this.ClassDetailRepository.remove(ID);
			if (isDeleted) await this.AccountRepository.update(exisitAccount.accountID, { isInClass: false });
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}

export default ClassDetailController;
