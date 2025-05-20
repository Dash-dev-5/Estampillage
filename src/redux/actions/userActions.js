import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  SET_CURRENT_USER,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"

// Simulated data for users
const simulatedUsers = [
  {
    id: 1,
    username: "admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@estampillage.com",
    role: "admin",
    site: "Headquarters",
    permissions: ["all"],
    status: "active",
    createdAt: "2023-01-01T08:00:00Z",
  },
  {
    id: 2,
    username: "opg",
    firstName: "OPG",
    lastName: "User",
    email: "opg@estampillage.com",
    role: "opg",
    site: "Border Post 1",
    permissions: ["perceptions", "declarations", "fraud_report"],
    status: "active",
    createdAt: "2023-01-02T09:30:00Z",
  },
  {
    id: 3,
    username: "dg",
    firstName: "Direction",
    lastName: "Générale",
    email: "dg@estampillage.com",
    role: "dg",
    site: "Headquarters",
    permissions: ["perceptions", "declarations", "fraud_report", "statistics"],
    status: "active",
    createdAt: "2023-01-03T10:15:00Z",
  },
  {
    id: 4,
    username: "comptable",
    firstName: "Jean",
    lastName: "Comptable",
    email: "comptable@estampillage.com",
    role: "comptable",
    site: "Headquarters",
    permissions: ["statistics", "archives"],
    status: "inactive",
    createdAt: "2023-01-04T11:45:00Z",
  },
]

// Fetch users
export const fetchUsers = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_USERS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_USERS_SUCCESS,
      payload: simulatedUsers,
    })
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch users",
        type: "error",
      }),
    )
  }
}

// Create user
export const createUser = (userData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_USER_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Check if username already exists
    const existingUser = simulatedUsers.find((u) => u.username === userData.username)
    if (existingUser) {
      throw new Error(`Username "${userData.username}" is already taken`)
    }

    // Check if email already exists
    const existingEmail = simulatedUsers.find((u) => u.email === userData.email)
    if (existingEmail) {
      throw new Error(`Email "${userData.email}" is already registered`)
    }

    // Generate a unique ID
    const newId = Math.max(...simulatedUsers.map((u) => u.id), 0) + 1

    // Create a new user
    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date().toISOString(),
      // Remove password from returned object
      password: undefined,
    }

    // Add the new user to the simulated data
    simulatedUsers.push(newUser)

    dispatch({
      type: CREATE_USER_SUCCESS,
      payload: newUser,
    })

    dispatch(
      addAudit({
        action: "CREATE_USER",
        userId: user.id,
        details: `User ${user.username} created user ${userData.username} with role ${userData.role}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Utilisateur créé avec succès",
        type: "success",
      }),
    )

    return newUser
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to create user",
        type: "error",
      }),
    )

    return null
  }
}

// Update user
export const updateUser = (id, userData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_USER_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the user by ID
    const index = simulatedUsers.findIndex((u) => u.id === id)

    if (index === -1) {
      throw new Error("User not found")
    }

    // Check if username already exists (except for the current user)
    const existingUser = simulatedUsers.find((u) => u.username === userData.username && u.id !== id)
    if (existingUser) {
      throw new Error(`Username "${userData.username}" is already taken`)
    }

    // Check if email already exists (except for the current user)
    const existingEmail = simulatedUsers.find((u) => u.email === userData.email && u.id !== id)
    if (existingEmail) {
      throw new Error(`Email "${userData.email}" is already registered`)
    }

    // Update the user
    const updatedUser = {
      ...simulatedUsers[index],
      ...userData,
    }

    simulatedUsers[index] = updatedUser

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: updatedUser,
    })

    dispatch(
      addAudit({
        action: "UPDATE_USER",
        userId: user.id,
        details: `User ${user.username} updated user ${userData.username}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Utilisateur mis à jour avec succès",
        type: "success",
      }),
    )

    return updatedUser
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to update user",
        type: "error",
      }),
    )

    return null
  }
}

// Delete user
export const deleteUser = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_USER_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the user by ID
    const index = simulatedUsers.findIndex((u) => u.id === id)

    if (index === -1) {
      throw new Error("User not found")
    }

    // Prevent deleting yourself
    if (id === user.id) {
      throw new Error("You cannot delete your own account")
    }

    const deletedUser = simulatedUsers[index]

    // Remove the user from the simulated data
    simulatedUsers.splice(index, 1)

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "DELETE_USER",
        userId: user.id,
        details: `User ${user.username} deleted user ${deletedUser.username}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Utilisateur supprimé avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to delete user",
        type: "error",
      }),
    )
  }
}

// Reset user password
export const resetPassword = (id, passwordData) => async (dispatch, getState) => {
  dispatch({ type: RESET_PASSWORD_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/users/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the user by ID
    const index = simulatedUsers.findIndex((u) => u.id === id)

    if (index === -1) {
      throw new Error("User not found")
    }

    const targetUser = simulatedUsers[index]

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "RESET_PASSWORD",
        userId: user.id,
        details: `User ${user.username} reset password for user ${targetUser.username}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Mot de passe réinitialisé avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to reset password",
        type: "error",
      }),
    )
  }
}

// Set current user
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
})
