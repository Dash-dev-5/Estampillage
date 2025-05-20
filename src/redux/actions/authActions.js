import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  AUTH_CHECK_START,
  AUTH_CHECK_SUCCESS,
  AUTH_CHECK_FAILURE,
  CHECK_AUTH_STATUS,
} from "../types"

// Fonction de connexion
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST })

    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Vérification des identifiants (à remplacer par une vraie API)
    const mockUsers = [
      { id: 1, username: "admin", password: "admin123", role: "admin" },
      { id: 2, username: "dg", password: "dg123", role: "dg" },
      { id: 3, username: "opg", password: "opg123", role: "opg" },
      { id: 4, username: "agent", password: "agent123", role: "industry_agent" },
    ]

    const user = mockUsers.find((u) => u.username === credentials.username && u.password === credentials.password)

    if (user) {
      // Stocker le token dans localStorage (simulé)
      const token = `mock-jwt-token-${user.id}`
      localStorage.setItem("token", token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        }),
      )

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          token,
        },
      })

      return true
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: "Identifiants invalides" },
      })

      return false
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: error.message || "Une erreur est survenue" },
    })

    return false
  }
}

// Fonction de déconnexion
export const logout = () => (dispatch) => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  dispatch({ type: LOGOUT })
}

// Fonction pour vérifier l'authentification
export const checkAuth = () => (dispatch) => {
  dispatch({ type: AUTH_CHECK_START })

  try {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (token && user) {
      dispatch({
        type: AUTH_CHECK_SUCCESS,
        payload: { user, token },
      })
      return true
    } else {
      dispatch({ type: AUTH_CHECK_FAILURE })
      return false
    }
  } catch (error) {
    dispatch({ type: AUTH_CHECK_FAILURE })
    return false
  }
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
    const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/validate`, {
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

  const simulatedUsers = [
    { id: 1, username: "admin", role: "admin" },
    { id: 2, username: "dg", role: "dg" },
    { id: 3, username: "opg", role: "opg" },
    { id: 4, username: "agent", role: "industry_agent" },
  ]

  // For simulation, check if the token starts with "simulated-jwt-token"
  if (token.startsWith("mock-jwt-token")) {
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
      //dispatch(fetchNotifications())
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
