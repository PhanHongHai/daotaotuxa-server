import express from 'express';
var router = express.Router();

import TrainingSectorRouter from './modules/trainingSector/trainingSector.router';
import ClassRouter from './modules/classes/class.router';
import ClassDetailRouter from './modules/classDetail/classDetail.router';
import AccountRouter from './modules/accounts/account.router';
import GeneralRouter from './general.router';
import RuleRouter from './modules/rules/rule.router';
import GroupRouter from './modules/groupRule/groupRule.route';
import ProFileRouter from './modules/proFiles/proFile.router';
import SubjectRouter from './modules/subjects/subject.route';
import DocumentRouter from './modules/documents/document.router';
import GroupSubject from './modules/groupSubject/groupSubject.router';
import TimeKeeping from './modules/timeKeeping/timeKeeping.router';
import Question from './modules/question/question.router';
import Exam from './modules/exam/exam.router';
import Schedule from './modules/schedule/schedule.router';
import SubjectProgress from './modules/subjectProgress/subjectProgress.route';
import Point from './modules/point/point.router';

var router = express.Router();

router.use('/accounts', AccountRouter);
router.use('/rules', RuleRouter);
router.use('/group-rules', GroupRouter);
router.use('/trainingSectors', TrainingSectorRouter);
router.use('/classes', ClassRouter);
router.use('/classeDetails', ClassDetailRouter);
router.use('/profiles', ProFileRouter);
router.use('/subjects', SubjectRouter);
router.use('/documents', DocumentRouter);
router.use('/group-subjects', GroupSubject);
router.use('/timeKeeping', TimeKeeping);
router.use('/questions', Question);
router.use('/exams', Exam);
router.use('/schedules', Schedule);
router.use('/subject-progress', SubjectProgress);
router.use('/points',Point);
router.use(GeneralRouter);

export default router;
