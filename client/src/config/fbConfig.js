import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
// import 'firebase/analytics';
import 'firebase/remote-config'
// Replace this with your own config details
const config = {
  apiKey: process.env.REACT_APP_API_KEY || 'AIzaSyBYGDQc-sjJJT_YqNhUJsxVkFN7GakWb8w',
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || 'abstract-lane-269917.firebaseapp.com',
  databaseURL: process.env.REACT_APP_DATABASE_URL || 'https://abstract-lane-269917.firebaseio.com',
  projectId: process.env.REACT_APP_PROJECT_ID || 'abstract-lane-269917',
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || 'abstract-lane-269917.appspot.com',
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || '359798242190',
  appId: process.env.REACT_APP_APP_ID || '1:359798242190:web:341bc749f03b14133902df',
  // measurementId: 'G-BD2PWF933P',
}
firebase.initializeApp(config)
firebase.firestore()
// .settings({ timestampsInSnapshots: true })
// firebase.analytics();
firebase.remoteConfig()

export default firebase
