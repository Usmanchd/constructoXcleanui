import { handleAddUser } from '../projects/projectActions'
import { notification } from 'antd'

export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    if (
      credentials.email === '' ||
      credentials.password === '' ||
      credentials.password.length <= 5
    ) {
      const err = { message: 'Password Must be 6 characters Long' }
      dispatch({ type: 'SIGNUP_ERROR', payload: err })
      setTimeout(() => dispatch({ type: 'REMOVE_ERR', payload: err }), 2000)
    } else {
      dispatch(loading())
      const firebase = getFirebase()

      firebase
        .auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          notification.success({
            message: 'Login Success',
          })
          dispatch({ type: 'LOGIN_SUCCESS' })
        })
        .catch(err => {
          notification.error({
            message: 'Login Failed',
            description: err.message,
          })
          dispatch({ type: 'LOGIN_ERROR', payload: err })
          setTimeout(() => dispatch({ type: 'REMOVE_ERR' }), 3000)
        })
    }
  }
}

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(loading())
    const firebase = getFirebase()

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: 'SIGNOUT_SUCCESS' })
      })
  }
}

export const signUp = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(loading())
    const firebase = getFirebase()
    const firestore = getFirestore()
    console.log(newUser)
    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(resp => {
        return firestore
          .collection('users')
          .doc(resp.user.uid)
          .set({
            ID: resp.user.uid,
            Name: newUser.Name,
            surName: newUser.surname,
            initials: newUser.Name[0] + newUser.surname[0],
            title: newUser.title,
            phone: newUser.phone,
            email: newUser.email,
            avatarURL: newUser.avatarURL,
            deleted: false,
            projects: [],
            project: '',
            createdAt: Date.now(),
          })
      })
      .then(() => {
        return firestore.collection('projects').get()
      })
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          let temp = doc.data()
          let PR = temp.pendingRegistrations.filter(pr => pr === newUser.email)

          if (PR.length > 0) {
            let newPR = temp.pendingRegistrations.filter(pr => pr !== newUser.email)

            firestore
              .collection('projects')
              .doc(doc.id)
              .update({ pendingRegistrations: newPR })
              .then(() => {
                dispatch(handleAddUser(newUser.email, temp.ID))
              })
          }
        })
        dispatch({ type: 'SIGNUP_SUCCESS' })
      })
      .catch(err => {
        dispatch({ type: 'SIGNUP_ERROR', payload: err })

        setTimeout(() => dispatch({ type: 'REMOVE_ERR' }), 2000)
      })
  }
}

export const getAllUsers = () => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore()
  firestore
    .collection('users')
    .get()
    .then(_users => {
      const users = _users.docs.map(doc => doc.data())
      dispatch({ type: 'GET_ALL_USERS', payload: users })
    })
}

export const loading = () => dispatch => {
  dispatch({ type: 'LOADING' })
}

export const handleTempEP = temp => (dispatch, getState, { getFirestore }) => {
  const { email, password } = temp
  if (email === '' || password === '' || password.length <= 5) {
    const err = { message: 'Password Must be 6 characters Long' }
    dispatch({ type: 'SIGNUP_ERROR', payload: err })
    setTimeout(() => dispatch({ type: 'REMOVE_ERR', payload: err }), 2000)
  } else {
    try {
      dispatch(loading())
      const firestore = getFirestore()
      firestore
        .collection('users')
        .get()
        .then(_users => {
          const users = _users.docs.map(doc => doc.data())
          const user = users.filter(_u => _u.email === email)

          if (user.length === 0) dispatch({ type: 'TEMP_E_P', payload: temp })
          else {
            const err = { message: 'Email Already Exists' }
            notification.error({
              message: 'Signup Failed',
              description: 'Email Already Exists',
            })
            dispatch({ type: 'SIGNUP_ERROR', payload: err })
          }

          setTimeout(() => dispatch({ type: 'REMOVE_ERR' }), 2000)
        })
    } catch (error) {
      dispatch(handleTempEP(temp))
    }
  }
}
