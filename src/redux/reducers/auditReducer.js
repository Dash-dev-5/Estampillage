import { FETCH_AUDITS_REQUEST, FETCH_AUDITS_SUCCESS, FETCH_AUDITS_FAILURE, ADD_AUDIT } from "../types"

const initialState = {
  audits: [],
  loading: false,
  error: null,
}

// Simulated data
const simulatedAudits = [
  {
    id: 1,
    action: "LOGIN",
    userId: 1,
    details: "User admin logged in",
    timestamp: "2023-01-15T08:30:00Z",
  },
  {
    id: 2,
    action: "CREATE_DECLARATION",
    userId: 2,
    details: "User opg created declaration #1",
    timestamp: "2023-01-15T09:45:00Z",
  },
  {
    id: 3,
    action: "UPDATE_DECLARATION",
    userId: 3,
    details: "User dg updated declaration #1",
    timestamp: "2023-01-15T10:15:00Z",
  },
]

const auditReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUDITS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_AUDITS_SUCCESS:
      return {
        ...state,
        audits: action.payload,
        loading: false,
        error: null,
      }
    case FETCH_AUDITS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case ADD_AUDIT:
      // For now, we'll just add to the local state
      // In a real app, this would be sent to the server
      return {
        ...state,
        audits: [
          {
            id: Math.max(...state.audits.map((a) => a.id), 0) + 1,
            ...action.payload,
          },
          ...state.audits,
        ],
      }
    default:
      return state
  }
}

export default auditReducer
