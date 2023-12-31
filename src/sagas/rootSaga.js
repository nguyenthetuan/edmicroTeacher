import { fork, all } from 'redux-saga/effects';
import { watchApiUser } from './apiUserSagas';
import { watchApiHomeworkTeacher } from './apiHomeworkTeacherSaga';
import { watchApiPaperTeacher } from './apiPaperSaga';
import { watchApiReport } from './apiReportSaga';
import { watchApiMission } from './apiMissionSaga';
import { watchApiGift } from './apiGiftSaga';
import { watchApiStatistic } from './apiStatisticSaga';
export default function* rootSaga() {
  yield all([
    fork(watchApiUser),
    fork(watchApiHomeworkTeacher),
    fork(watchApiPaperTeacher),
    fork(watchApiReport),
    fork(watchApiMission),
    fork(watchApiGift),
    fork(watchApiStatistic),

  ])
}