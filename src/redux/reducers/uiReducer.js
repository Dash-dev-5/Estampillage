import { SHOW_TOAST, HIDE_TOAST, SET_LOADING } from "../types"

const initialState = {
  toast: null,
  loading: false,
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        toast: action.payload,
      }
    case HIDE_TOAST:
      return {
        ...state,
        toast: null,
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

export default uiReducer
