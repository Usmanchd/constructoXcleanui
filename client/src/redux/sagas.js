import { all } from 'redux-saga/effects'
import menu from './menu/sagas'
import settings from './settings/sagas'

export default function* rootSaga() {
  yield all([menu(), settings()])
}
