import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, LOGOUT, CHECK_AUTH_STATUS } from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"
import { fetchNotifications } from "./notificationActions"

// Simulated data for now
const simulatedUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    email: "admin@estampillage.com",
    role: "admin",
    site: "Headquarters",
    permissions: ["all"],
  },
  {
    id: 2,
    username: "opg",
    password: "opg123",
    firstName: "OPG",
    lastName: "User",
    email: "opg@estampillage.com",
    role: "opg",
    site: "Border Post 1",
    permissions: ["perceptions", "declarations", "fraud_report"],
  },
  {
    id: 3,
    username: "dg",
    password: "dg123",
    firstName: "Direction",
    lastName: "Générale",
    email: "dg@estampillage.com",
    role: "dg",
    site: "Headquarters",
    permissions: ["perceptions", "declarations", "fraud_report", "statistics"],
  },
]

// Login action
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: AUTH_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const user = simulatedUsers.find(
      (user) => user.username === credentials.username && user.password === credentials.password,
    )

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const data = {
      token: `simulated-jwt-token-${user.id}-${Date.now()}`,
      user: { ...user, password: undefined }, // Remove password from the user object
    }

    dispatch({
      type: AUTH_SUCCESS,
      payload: data,
    })

    dispatch(
      addAudit({
        action: "LOGIN",
        userId: data.user.id,
        details: `User ${data.user.username} logged in`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Connexion réussie",
        type: "success",
      }),
    )

    dispatch(fetchNotifications())
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Authentication failed",
        type: "error",
      }),
    )
  }
}

// Logout action
export const logout = () => (dispatch, getState) => {
  const { user } = getState().auth

  dispatch({
    type: LOGOUT,
  })

  if (user) {
    dispatch(
      addAudit({
        action: "LOGOUT",
        userId: user.id,
        details: `User ${user.username} logged out`,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  dispatch(
    showToast({
      message: "Vous avez été déconnecté",
      type: "info",
    }),
  )
}

// Check authentication status
export const checkAuthStatus = () => (dispatch) => {
  const token = localStorage.getItem("token")

  if (!token) {
    dispatch({
      type: CHECK_AUTH_STATUS,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    })
    return
  }

  // Simulate token validation
  /* 
  try {
    const response = await fetch(`${import.meta.env.REACT_APP_AUTH_API_URL}/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    const data = await response.json();
    
    dispatch({
      type: CHECK_AUTH_STATUS,
      payload: {
        isAuthenticated: true,
        user: data.user
      }
    });
  } catch (error) {
    localStorage.removeItem('token');
    
    dispatch({
      type: CHECK_AUTH_STATUS,
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
  }
  */

  // For simulation, check if the token starts with "simulated-jwt-token"
  if (token.startsWith("simulated-jwt-token")) {
    const userId = Number.parseInt(token.split("-")[3])
    const user = simulatedUsers.find((user) => user.id === userId)

    if (user) {
      dispatch({
        type: CHECK_AUTH_STATUS,
        payload: {
          isAuthenticated: true,
          user: { ...user, password: undefined },
        },
      })

      // Fetch notifications
      dispatch(fetchNotifications())
      return
    }
  }

  // If token is invalid
  localStorage.removeItem("token")

  dispatch({
    type: CHECK_AUTH_STATUS,
    payload: {
      isAuthenticated: false,
      user: null,
    },
  })
}
