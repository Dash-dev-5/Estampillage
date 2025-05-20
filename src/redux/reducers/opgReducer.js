import {
  FETCH_OPGS_REQUEST,
  FETCH_OPGS_SUCCESS,
  FETCH_OPGS_FAILURE,
  CREATE_OPG_SUCCESS,
  UPDATE_OPG_SUCCESS,
  DELETE_OPG_SUCCESS,
  SET_CURRENT_OPG,
} from "../types"

const initialState = {
  opgs: [],
  currentOpg: null,
  loading: false,
  error: null,
}

const opgReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OPGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_OPGS_SUCCESS:
      return {
        ...state,
        opgs: action.payload,
        loading: false,
        error: null,
      }
    case FETCH_OPGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CREATE_OPG_SUCCESS:
      return {
        ...state,
        opgs: [...state.opgs, action.payload],
        currentOpg: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_OPG_SUCCESS:
      return {
        ...state,
        opgs: state.opgs.map((opg) => (opg.id === action.payload.id ? action.payload : opg)),
        currentOpg: action.payload,
        loading: false,
        error: null,
      }
    case DELETE_OPG_SUCCESS:
      return {
        ...state,
        opgs: state.opgs.filter((opg) => opg.id !== action.payload),
        loading: false,
        error: null,
      }
    case SET_CURRENT_OPG:
      return {
        ...state,
        currentOpg: action.payload,
      }
    default:
      return state
  }
}

export default opgReducer
