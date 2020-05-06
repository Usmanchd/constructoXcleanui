const initState = {
  projects: [],
  project: {},
  loading: false,
  viewUser: [],
  currentProject: {},
}

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case 'PROJECTS':
      return {
        ...state,
        projects: [...action.payload.projects],
        currentProject: { ...action.payload.project },
        loading: false,
      }
    case 'GET_THIS_PROJECT':
      return {
        ...state,
        project: action.payload.project,
        viewUser: action.payload.viewUser,
        loading: false,
      }
    case 'P_LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'TOGGLE_P_LOADING':
      return {
        ...state,
        loading: false,
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.ID !== action.payload),
      }
    default:
      return state
  }
}

export default projectReducer
