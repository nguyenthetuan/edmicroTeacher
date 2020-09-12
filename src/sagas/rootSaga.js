/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 11:29:06
 * @modify date 2018-04-17 11:29:06
 * @desc [description]
*/

import { fork, all } from 'redux-saga/effects';
import { watchNavigationRoute } from './navigationSagas';
import { watchApiPractice } from './apiPracticeSagas';
import { watchApiUser } from './apiUserSagas';
import { watchApiSla } from './apiSlaSagas';
import { wathchApiPractice2 } from './apiPracticeNewSaga';
import { watchApiSchool } from './apiSchoolOnlineSagas';
import { watchApiHomeworkTeacher } from './apiHomeworkTeacherSaga';
import { watchApiPaperTeacher } from './apiPaperSaga';
import {watchApiReport} from './apiReportSaga';

export default function* rootSaga() {
  yield all([
    fork(watchNavigationRoute),
    fork(watchApiPractice),
    fork(watchApiSla),
    fork(wathchApiPractice2),
    fork(watchApiUser),
    fork(watchApiSchool),
    fork(watchApiHomeworkTeacher),
    fork(watchApiPaperTeacher),
    fork(watchApiReport),
  ])
}