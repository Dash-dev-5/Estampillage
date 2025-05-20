import {
  FETCH_DECLARATIONS_REQUEST,
  FETCH_DECLARATIONS_SUCCESS,
  FETCH_DECLARATIONS_FAILURE,
  CREATE_DECLARATION_REQUEST,
  CREATE_DECLARATION_SUCCESS,
  CREATE_DECLARATION_FAILURE,
  UPDATE_DECLARATION_REQUEST,
  UPDATE_DECLARATION_SUCCESS,
  UPDATE_DECLARATION_FAILURE,
  DELETE_DECLARATION_REQUEST,
  DELETE_DECLARATION_SUCCESS,
  DELETE_DECLARATION_FAILURE,
  SET_CURRENT_DECLARATION,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"
import { addNotification } from "./notificationActions"

// Simulated data for now
const simulatedDeclarations = [
  {
    id: 1,
    subjectId: 3,
    subjectName: "Entreprise XYZ",
    quantityDeclared: 1000,
    bagsStamped: 50,
    taxRate: 0.05,
    amountDue: 50000,
    status: "pending",
    createdBy: 2,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    subjectId: 5,
    subjectName: "Compagnie ABC",
    quantityDeclared: 2500,
    bagsStamped: 125,
    taxRate: 0.05,
    amountDue: 125000,
    status: "approved",
    createdBy: 2,
    createdAt: "2023-02-20T14:15:00Z",
    updatedAt: "2023-02-21T09:45:00Z",
  },
  {
    id: 3,
    subjectId: 8,
    subjectName: "Société DEF",
    quantityDeclared: 800,
    bagsStamped: 40,
    taxRate: 0.05,
    amountDue: 40000,
    status: "rejected",
    createdBy: 2,
    createdAt: "2023-03-05T16:20:00Z",
    updatedAt: "2023-03-06T11:10:00Z",
  },
]

// Fetch declarations
export const fetchDeclarations = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_DECLARATIONS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_DECLARATION_API_URL}`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch declarations');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_DECLARATIONS_SUCCESS,
      payload: simulatedDeclarations,
    })
  } catch (error) {
    dispatch({
      type: FETCH_DECLARATIONS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch declarations",
        type: "error",
      }),
    )
  }
}

// Create declaration
export const createDeclaration = (declarationData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_DECLARATION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_DECLARATION_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(declarationData)
    });

    if (!response.ok) {
      throw new Error('Failed to create declaration');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Generate a unique ID
    const newId = Math.max(...simulatedDeclarations.map((d) => d.id), 0) + 1

    // Create a new declaration
    const newDeclaration = {
      id: newId,
      ...declarationData,
      status: "pending",
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add the new declaration to the simulated data
    simulatedDeclarations.push(newDeclaration)

    dispatch({
      type: CREATE_DECLARATION_SUCCESS,
      payload: newDeclaration,
    })

    dispatch(
      addAudit({
        action: "CREATE_DECLARATION",
        userId: user.id,
        details: `User ${user.username} created declaration #${newId}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Déclaration créée avec succès",
        type: "success",
      }),
    )

    // Notify relevant personnel
    dispatch(
      addNotification({
        id: Date.now(),
        title: "Nouvelle Déclaration",
        message: `Une nouvelle déclaration a été créée par ${user.firstName} ${user.lastName}`,
        type: "declaration",
        createdAt: new Date().toISOString(),
        read: false,
      }),
    )

    return newDeclaration
  } catch (error) {
    dispatch({
      type: CREATE_DECLARATION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to create declaration",
        type: "error",
      }),
    )

    return null
  }
}

// Update declaration
export const updateDeclaration = (id, declarationData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_DECLARATION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_DECLARATION_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(declarationData)
    });

    if (!response.ok) {
      throw new Error('Failed to update declaration');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the declaration by ID
    const index = simulatedDeclarations.findIndex((d) => d.id === id)

    if (index === -1) {
      throw new Error("Declaration not found")
    }

    // Update the declaration
    const updatedDeclaration = {
      ...simulatedDeclarations[index],
      ...declarationData,
      updatedAt: new Date().toISOString(),
    }

    simulatedDeclarations[index] = updatedDeclaration

    dispatch({
      type: UPDATE_DECLARATION_SUCCESS,
      payload: updatedDeclaration,
    })

    dispatch(
      addAudit({
        action: "UPDATE_DECLARATION",
        userId: user.id,
        details: `User ${user.username} updated declaration #${id}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Déclaration mise à jour avec succès",
        type: "success",
      }),
    )

    return updatedDeclaration
  } catch (error) {
    dispatch({
      type: UPDATE_DECLARATION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to update declaration",
        type: "error",
      }),
    )

    return null
  }
}

// Delete declaration
export const deleteDeclaration = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_DECLARATION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_DECLARATION_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete declaration');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the declaration by ID
    const index = simulatedDeclarations.findIndex((d) => d.id === id)

    if (index === -1) {
      throw new Error("Declaration not found")
    }

    // Remove the declaration from the simulated data
    simulatedDeclarations.splice(index, 1)

    dispatch({
      type: DELETE_DECLARATION_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "DELETE_DECLARATION",
        userId: user.id,
        details: `User ${user.username} deleted declaration #${id}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Déclaration supprimée avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: DELETE_DECLARATION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to delete declaration",
        type: "error",
      }),
    )
  }
}

// Set current declaration
export const setCurrentDeclaration = (declaration) => ({
  type: SET_CURRENT_DECLARATION,
  payload: declaration,
})
