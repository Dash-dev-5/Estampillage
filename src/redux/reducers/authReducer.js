import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CHECK_AUTH_STATUS,
  AUTH_CHECK_START,
  AUTH_CHECK_SUCCESS,
  AUTH_CHECK_FAILURE,
} from "../types"

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case AUTH_CHECK_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case LOGIN_SUCCESS:
    case AUTH_CHECK_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case LOGIN_FAILURE:
    case AUTH_CHECK_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload?.error || "Authentication failed",
      }
    case LOGOUT:
      return {
        ...initialState,
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
