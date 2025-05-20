import {
  FETCH_PERCEPTIONS_REQUEST,
  FETCH_PERCEPTIONS_SUCCESS,
  FETCH_PERCEPTIONS_FAILURE,
  CREATE_PERCEPTION_REQUEST,
  CREATE_PERCEPTION_SUCCESS,
  CREATE_PERCEPTION_FAILURE,
  UPDATE_PERCEPTION_REQUEST,
  UPDATE_PERCEPTION_SUCCESS,
  UPDATE_PERCEPTION_FAILURE,
  DELETE_PERCEPTION_REQUEST,
  DELETE_PERCEPTION_SUCCESS,
  DELETE_PERCEPTION_FAILURE,
  SET_CURRENT_PERCEPTION,
} from "../types"

const initialState = {
  perceptions: [],
  currentPerception: null,
  loading: false,
  error: null,
}

const perceptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PERCEPTIONS_REQUEST:
    case CREATE_PERCEPTION_REQUEST:
    case UPDATE_PERCEPTION_REQUEST:
    case DELETE_PERCEPTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_PERCEPTIONS_SUCCESS:
      return {
        ...state,
        perceptions: action.payload,
        loading: false,
        error: null,
      }
    case CREATE_PERCEPTION_SUCCESS:
      return {
        ...state,
        perceptions: [...state.perceptions, action.payload],
        currentPerception: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_PERCEPTION_SUCCESS:
      return {
        ...state,
        perceptions: state.perceptions.map((perception) =>
          perception.id === action.payload.id ? action.payload : perception,
        ),
        currentPerception: action.payload,
        loading: false,
        error: null,
      }
    case DELETE_PERCEPTION_SUCCESS:
      return {
        ...state,
        perceptions: state.perceptions.filter((perception) => perception.id !== action.payload),
        loading: false,
        error: null,
      }
    case FETCH_PERCEPTIONS_FAILURE:
    case CREATE_PERCEPTION_FAILURE:
    case UPDATE_PERCEPTION_FAILURE:
    case DELETE_PERCEPTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case SET_CURRENT_PERCEPTION:
      return {
        ...state,
        currentPerception: action.payload,
      }
    default:
      return state
  }
}

export default perceptionReducer
