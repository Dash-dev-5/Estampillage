import { FETCH_AUDITS_REQUEST, FETCH_AUDITS_SUCCESS, FETCH_AUDITS_FAILURE, ADD_AUDIT } from "../types"
import { showToast } from "./uiActions"

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
  // Additional audit entries
  {
    id: 4,
    action: "VALIDATE_PERCEPTION",
    userId: 2,
    details: "User opg validated perception note #2",
    timestamp: "2023-01-16T11:20:00Z",
  },
  {
    id: 5,
    action: "CREATE_USER",
    userId: 1,
    details: "User admin created new user 'comptable'",
    timestamp: "2023-01-17T14:05:00Z",
  },
  {
    id: 6,
    action: "ARCHIVE_DOCUMENT",
    userId: 3,
    details: "User dg archived declaration #3",
    timestamp: "2023-01-18T16:30:00Z",
  },
  {
    id: 7,
    action: "LOGOUT",
    userId: 2,
    details: "User opg logged out",
    timestamp: "2023-01-19T17:45:00Z",
  },
]

// Fetch audits
export const fetchAudits = () => async (dispatch) => {
  dispatch({ type: FETCH_AUDITS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/audits`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }
    
    const data = await response.json();
    */

    // Using simulated data for now
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_AUDITS_SUCCESS,
      payload: simulatedAudits,
    })
  } catch (error) {
    dispatch({
      type: FETCH_AUDITS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch audit logs",
        type: "error",
      }),
    )
  }
}

// Add an audit entry
export const addAudit = (auditData) => ({
  type: ADD_AUDIT,
  payload: auditData,
})
