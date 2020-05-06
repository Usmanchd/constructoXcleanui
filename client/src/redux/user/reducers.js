const initState = {
  authError: null,
  loading: false,
  role: 'admin',
}

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_ERROR':
      console.log('login error')
      return {
        ...state,
        authError: action.payload.message,
        loading: false,
      }

    case 'LOGIN_SUCCESS':
      console.log('login success')
      return {
        ...state,
        authError: null,
        loading: false,
      }

    case 'SIGNOUT_SUCCESS':
      console.log('signout success')
      return { ...state, loading: false }

    case 'SIGNUP_SUCCESS':
      console.log('signup success')
      return {
        ...state,
        authError: null,
        loading: false,
      }

    case 'SIGNUP_ERROR':
      return {
        ...state,
        authError: action.payload.message,
        loading: false,
      }

    case 'GET_ALL_USERS':
      return {
        ...state,
        users: [...action.payload],
        loading: false,
      }

    case 'TEMP_E_P':
      return {
        ...state,
        tempEP: action.payload,
        loading: false,
      }

    case 'LOADING':
      return {
        ...state,
        loading: true,
      }

    case 'REMOVE_ERR':
      return {
        ...state,
        authError: null,
      }
    default:
      return state
  }
}

export default authReducer
