import {
  FETCH_ARCHIVES_REQUEST,
  FETCH_ARCHIVES_SUCCESS,
  FETCH_ARCHIVES_FAILURE,
  ARCHIVE_DOCUMENT_SUCCESS,
  RESTORE_DOCUMENT_SUCCESS,
} from "../types"

const initialState = {
  archives: [],
  loading: false,
  error: null,
}

const archiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ARCHIVES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_ARCHIVES_SUCCESS:
      return {
        ...state,
        archives: action.payload,
        loading: false,
        error: null,
      }
    case FETCH_ARCHIVES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case ARCHIVE_DOCUMENT_SUCCESS:
      return {
        ...state,
        archives: [...state.archives, action.payload],
      }
    case RESTORE_DOCUMENT_SUCCESS:
      return {
        ...state,
        archives: state.archives.filter((archive) => archive.id !== action.payload),
      }
    default:
      return state
  }
}

export default archiveReducer
