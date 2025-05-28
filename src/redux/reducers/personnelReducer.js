import * as types from "../types"

const initialState = {
  personnel: [],
  loading: false,
  error: null,
  filter: {
    search: "",
    poste: "",
    departement: "",
    statut: "",
  },
}

const personnelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PERSONNEL_REQUEST:
    case types.ADD_PERSONNEL_REQUEST:
    case types.UPDATE_PERSONNEL_REQUEST:
    case types.DELETE_PERSONNEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case types.FETCH_PERSONNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        personnel: action.payload,
        error: null,
      }

    case types.ADD_PERSONNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        personnel: [...state.personnel, action.payload],
        error: null,
      }

    case types.UPDATE_PERSONNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        personnel: state.personnel.map((p) => (p.id === action.payload.id ? action.payload : p)),
        error: null,
      }

    case types.DELETE_PERSONNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        personnel: state.personnel.filter((p) => p.id !== action.payload),
        error: null,
      }

    case types.FETCH_PERSONNEL_FAILURE:
    case types.ADD_PERSONNEL_FAILURE:
    case types.UPDATE_PERSONNEL_FAILURE:
    case types.DELETE_PERSONNEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case types.SET_PERSONNEL_FILTER:
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      }

    default:
      return state
  }
}

export default personnelReducer
