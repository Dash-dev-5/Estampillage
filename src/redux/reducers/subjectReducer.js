import {
  FETCH_SUBJECTS_REQUEST,
  FETCH_SUBJECTS_SUCCESS,
  FETCH_SUBJECTS_FAILURE,
  CREATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_SUCCESS,
  SET_CURRENT_SUBJECT,
} from "../types"

const initialState = {
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
}

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_SUBJECTS_SUCCESS:
      return {
        ...state,
        subjects: action.payload,
        loading: false,
        error: null,
      }
    case FETCH_SUBJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CREATE_SUBJECT_SUCCESS:
      return {
        ...state,
        subjects: [...state.subjects, action.payload],
        currentSubject: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_SUBJECT_SUCCESS:
      return {
        ...state,
        subjects: state.subjects.map((subject) => (subject.id === action.payload.id ? action.payload : subject)),
        currentSubject: action.payload,
        loading: false,
        error: null,
      }
    case DELETE_SUBJECT_SUCCESS:
      return {
        ...state,
        subjects: state.subjects.filter((subject) => subject.id !== action.payload),
        loading: false,
        error: null,
      }
    case SET_CURRENT_SUBJECT:
      return {
        ...state,
        currentSubject: action.payload,
      }
    default:
      return state
  }
}

export default subjectReducer
