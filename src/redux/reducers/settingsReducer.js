import {
  FETCH_SETTINGS_REQUEST,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_FAILURE,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../types"

const initialState = {
  settings: {
    revenueDistribution: {
      dgrkc: 45,
      estampi: 35,
      gouvernement: 20,
    },
    systemSettings: {
      currency: "FC",
      timezone: "UTC+1",
      language: "fr",
      autoArchive: true,
      notificationEmail: true,
    },
  },
  loading: false,
  error: null,
}

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SETTINGS_REQUEST:
    case UPDATE_SETTINGS_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_SETTINGS_SUCCESS:
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case FETCH_SETTINGS_FAILURE:
    case UPDATE_SETTINGS_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default settingsReducer
