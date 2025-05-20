import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, LOGOUT, CHECK_AUTH_STATUS } from "../types"

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
  loading: true,
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case AUTH_SUCCESS:
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      }
    case AUTH_FAILURE:
      localStorage.removeItem("token")
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      }
    case LOGOUT:
      localStorage.removeItem("token")
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      }
    case CHECK_AUTH_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        loading: false,
      }
    default:
      return state
  }
}

export default authReducer
