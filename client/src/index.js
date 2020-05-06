import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createHashHistory } from 'history'
import reducers from 'redux/reducers'
import sagas from 'redux/sagas'
import Router from 'router'
import { createFirestoreInstance, reduxFirestore, getFirestore } from 'redux-firestore'
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import Localization from 'components/LayoutComponents/Localization'
import firebase from './config/fbConfig'
import * as serviceWorker from './serviceWorker'

// app styles
import './global.scss'

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  enableClaims: true, // Get custom claims along with the profile
}

const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [
  thunk.withExtraArgument({ getFirebase, getFirestore }),
  sagaMiddleware,
  routeMiddleware,
]
// if (process.env.NODE_ENV === 'development' && true) {
//   middlewares.push(logger)
// }
const store = createStore(
  reducers(history),
  compose(applyMiddleware(...middlewares), reduxFirestore(firebase)),
)
sagaMiddleware.run(sagas)

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Localization>
        <Router history={history} />
      </Localization>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.register()
export { store, history }
