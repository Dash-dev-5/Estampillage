import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  SET_CURRENT_USER,
} from "../types"

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      }
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        currentUser: action.payload,
        loading: false,
        error: null,
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        loading: false,
        error: null,
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      }
    default:
      return state
  }
}

export default userReducer
