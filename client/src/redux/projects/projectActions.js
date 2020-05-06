import { v4 as uuidv4 } from 'uuid'
import { notification } from 'antd'

// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export const createProject = (_newProject, { Name, ID }) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()
  let newProject = {
    ..._newProject,
    ID: uuidv4(),
    createdAt: Date.now(),
    deletedAt: null,
    updatedAt: Date.now(),
    active: true,

    tags: null,
    taskCategories: null,
    diaryCategories: null,
    spaceLimit: null,
    spaceUsed: null,
    userLimit: null,
    userUsed: null,
    attendanceKy: null,
    backupPeriod: null,
    subscriptionPlan: null,
    subscriptionPlanValidUntil: null,
    legacy: null,
    legacyId: null,
    legacyContent: null,
    roles: [
      {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deleted: false,
        roleName: 'ADMINISTRATOR',
        projectRule: 'WRITE',
        rolesRule: 'WRITE',
        diaryRule: 'WRITE',
        documentationRule: 'WRITE',
        versionsRule: 'WRITE',
        signingRule: 'WRITE',
        admin: true,
        superAdmin: false,
        usersID: [ID],
      },
      {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deleted: false,
        roleName: 'ORDINARY',
        projectRule: 'READ',
        rolesRule: 'READ',
        diaryRule: 'WRITE',
        documentationRule: 'WRITE',
        versionsRule: 'WRITE',
        signingRule: 'WRITE',
        admin: false,
        superAdmin: false,
        usersID: [],
      },
    ],
  }
  await firestore.collection('projects').add(newProject)

  await firestore
    .collection('users')
    .where('ID', '==', newProject.userID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const user = doc.data()
        let p = user.projects
        p.push(newProject.ID)

        firestore
          .collection('users')
          .doc(doc.id)
          .update({ projects: p })
      })
    })
  notification.success({ message: 'Project added successfully !' })
  dispatch(getAllProjects(newProject.userID))
}

export const getAllProjects = ID => (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()
  let projects = []
  let project = {}
  let user = []
  firestore
    .collection('users')
    .where('ID', '==', ID)
    .get()
    .then(_user => {
      user = _user.docs.map(doc => doc.data())
      return firestore.collection('projects').get()
    })
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let temp = doc.data()

        let _project = user[0].projects.filter(project => project === temp.ID)

        if (_project.length !== 0) {
          projects.push(temp)
          if (user[0].project === _project[0]) project = temp
        }
      })
      console.log(projects)
      dispatch({ type: 'PROJECTS', payload: { projects, project } })
    })
}

export const getThisProject = ID => async (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()
  let viewUser = []
  let project = []
  firestore
    .collection('projects')
    .where('ID', '==', ID)
    .get()
    .then(_project => {
      project = _project.docs.map(doc => doc.data())

      return firestore.collection('users').get()
    })
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let temp = doc.data()
        let newUser = project[0].users.filter(_user => _user === temp.ID)
        if (newUser.length !== 0) viewUser = [...viewUser, { ...temp }]
      })

      dispatch({
        type: 'GET_THIS_PROJECT',
        payload: { project: { ...project[0] }, viewUser: viewUser },
      })
    })
}

export const updateProject = _updateProject => async (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()
  firestore
    .collection('projects')
    .where('ID', '==', _updateProject.ID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        firestore
          .collection('projects')
          .doc(doc.id)
          .update(_updateProject)
      })
      dispatch(getThisProject(_updateProject.ID))
    })
}

export const deleteProject = ID => async (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()
  firestore
    .collection('projects')
    .where('ID', '==', ID)
    .get()
    .then(querySnapshot =>
      querySnapshot.forEach(doc =>
        doc.ref.delete().then(() => dispatch({ type: 'DELETE_PROJECT', payload: ID })),
      ),
    )
}

export const setCurrentProject = (ID, projectID) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()
  firestore
    .collection('users')
    .where('ID', '==', ID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        firestore
          .collection('users')
          .doc(doc.id)
          .update({ project: projectID })
      })
      dispatch(getAllProjects(ID))
    })
}

export const handleAddUser = (userEmail, projectID) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()
  firestore
    .collection('users')
    .where('email', '==', userEmail)
    .get()
    .then(function(querySnapshot) {
      let temp
      if (querySnapshot.docs.length === 0) {
        firestore
          .collection('projects')
          .where('ID', '==', projectID)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
              temp = doc.data()
              let index = temp.pendingRegistrations.filter(email => email === userEmail)

              if (index.length > 0) {
                notification.error({
                  message: 'Email already Exists in pending Registrations!',
                })
                return
              } else {
                temp.pendingRegistrations.push(userEmail)
                return firestore
                  .collection('projects')
                  .doc(doc.id)
                  .update({ pendingRegistrations: temp.pendingRegistrations })
              }
            })
          })
          .then(() => {
            dispatch(getThisProject(projectID))
            notification.error({
              message: 'User not Found Added to Pending Registrations !',
            })
          })
      } else {
        let user
        querySnapshot.forEach(function(doc) {
          user = doc.data()
        })

        firestore
          .collection('projects')
          .where('ID', '==', projectID)
          .get()
          .then(querySnapshot => {
            let temp

            querySnapshot.forEach(function(doc) {
              temp = doc.data()

              let index = temp.users.filter(u => u === user.ID)

              if (index.length > 0) {
                notification.error({
                  message: 'Email already Exists in pending Registrations!',
                })
                return
              }

              temp.users.push(user.ID)

              temp.roles.forEach(role => {
                if (role.roleName === 'ORDINARY') role.usersID.push(user.ID)
              })

              firestore
                .collection('projects')
                .doc(doc.id)
                .update({ users: temp.users, roles: temp.roles })
            })

            firestore
              .collection('users')
              .where('ID', '==', user.ID)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(function(doc) {
                  let _temp = doc.data()
                  let index = _temp.projects.filter(project => project === temp.ID)

                  if (index.length > 0) return
                  _temp.projects.push(temp.ID)

                  firestore
                    .collection('users')
                    .doc(doc.id)
                    .update({ projects: _temp.projects })
                    .then(() => notification.success({ message: 'User Added !' }))
                })
                dispatch(getThisProject(projectID))
              })
            // dispatch(getThisProject(projectID));
          })
      }
    })
}

export const handleRole = (newRole, projectID) => async (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()

  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let temp = doc.data()
        let index = temp.roles.filter(role => role.roleName === newRole.roleName)
        if (index.length > 0) {
          notification.error({ message: 'Role with this Name already exists!' })
          return
        }
        temp.roles.push({ ...newRole, usersID: [] })
        firestore
          .collection('projects')
          .doc(doc.id)
          .update({ roles: temp.roles })
          .then(() => notification.success({ message: 'Role Created !' }))
      })

      dispatch(getThisProject(projectID))
    })
}

export const handleUpdateRole = (updatedRole, projectID, index) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()
  console.log(updatedRole)
  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let temp = doc.data()
        temp.roles[index] = updatedRole

        return firestore
          .collection('projects')
          .doc(doc.id)
          .update({ roles: temp.roles })
      })
    })
    .then(() => {
      console.log('hello!')
      dispatch(getThisProject(projectID))
      notification.success({ message: 'Role Updated !' })
    })
}

export const changeUserRole = (updatedRole, userID, projectID) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()

  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let temp = doc.data()
        temp.roles.forEach(role => {
          if (role.usersID.includes(userID)) {
            role.usersID = role.usersID.filter(id => id !== userID)
          }
          if (role.roleName === updatedRole.roleName) {
            role.usersID.push(userID)
          }
        })
        console.log(temp.roles)
        return firestore
          .collection('projects')
          .doc(doc.id)
          .update({ roles: temp.roles })
      })
    })
    .then(() => {
      dispatch(getThisProject(projectID))
      notification.success({ message: 'User Role Updated !' })
    })
}

export const deleteUserFromProject = (userID, projectID) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()
  let temp
  let newUsers
  let _temp
  let newProjects
  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        temp = doc.data()
        temp.roles.forEach(role => {
          role.usersID = role.usersID.filter(id => id !== userID)
        })
        newUsers = temp.users.filter(user => user !== userID)

        return firestore
          .collection('projects')
          .doc(doc.id)
          .update({ roles: temp.roles, users: newUsers })
      })
    })
    .then(() => {
      return firestore
        .collection('users')
        .where('ID', '==', userID)
        .get()
    })
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        _temp = doc.data()
        newProjects = _temp.projects.filter(project => project !== projectID)

        return firestore
          .collection('users')
          .doc(doc.id)
          .update({ projects: newProjects })
      })
    })
    .then(() => {
      dispatch(getThisProject(projectID))
      notification.success({ message: 'User Deleted from Project !' })
    })
}

export const deleteRole = (roleName, projectID) => async (dispatch, getState, { getFirestore }) => {
  dispatch({ type: 'P_LOADING' })
  const firestore = getFirestore()

  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let temp = doc.data()
        // let newdefinedRoles = temp.definedRoles.filter(
        //   (role) => role.roleName !== roleName
        // );
        let usersids
        let newRoles = temp.roles.filter(role => {
          usersids = role.usersID
          return role.roleName !== roleName
        })
        console.log(newRoles)
        newRoles.forEach(role => {
          if (role.roleName === 'ORDINARY') role.usersID = [...role.usersID, ...usersids]
        })

        return firestore
          .collection('projects')
          .doc(doc.id)
          .update({ roles: newRoles })
      })
    })
    .then(() => {
      dispatch(getThisProject(projectID))
      notification.success({ message: 'Role Deleted from Project !' })
    })
}

export const deleteEmailFromPenReg = (email, projectID) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  dispatch({ type: 'P_LOADING' })

  const firestore = getFirestore()

  firestore
    .collection('projects')
    .where('ID', '==', projectID)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let temp = doc.data()
        let newPR = temp.pendingRegistrations.filter(pr => pr !== email)

        return firestore
          .collection('projects')
          .doc(doc.id)
          .update({ pendingRegistrations: newPR })
      })
    })
    .then(() => {
      dispatch(getThisProject(projectID))
      notification.success({ message: 'User Removed !' })
    })
}
