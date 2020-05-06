import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import projectReducer from './projects/projectReducer'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    project: projectReducer,
    menu,
    settings,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
  })
