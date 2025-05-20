import {
  FETCH_PERCEPTIONS_REQUEST,
  FETCH_PERCEPTIONS_SUCCESS,
  FETCH_PERCEPTIONS_FAILURE,
  CREATE_PERCEPTION_REQUEST,
  CREATE_PERCEPTION_SUCCESS,
  CREATE_PERCEPTION_FAILURE,
  UPDATE_PERCEPTION_REQUEST,
  UPDATE_PERCEPTION_SUCCESS,
  UPDATE_PERCEPTION_FAILURE,
  DELETE_PERCEPTION_REQUEST,
  DELETE_PERCEPTION_SUCCESS,
  DELETE_PERCEPTION_FAILURE,
  SET_CURRENT_PERCEPTION,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"
import { addNotification } from "./notificationActions"

// Simulated data for notes de perception
const simulatedPerceptions = [
  {
    id: 1,
    declarationId: 1,
    subjectName: "Entreprise XYZ",
    valueNumber: "VN-00123",
    amount: 50000,
    status: "pending",
    createdBy: 2,
    createdAt: "2023-01-16T09:45:00Z",
    printed: false,
  },
  {
    id: 2,
    declarationId: 2,
    subjectName: "Compagnie ABC",
    valueNumber: "VN-00124",
    amount: 125000,
    status: "validated",
    createdBy: 3,
    createdAt: "2023-02-22T10:30:00Z",
    printed: true,
  },
  {
    id: 3,
    declarationId: 3,
    subjectName: "Société DEF",
    valueNumber: "VN-00125",
    amount: 40000,
    status: "rejected",
    createdBy: 2,
    createdAt: "2023-03-07T14:15:00Z",
    printed: false,
  },
]

// Fetch perceptions
export const fetchPerceptions = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_PERCEPTIONS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_PERCEPTION_API_URL}`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch perception notes');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_PERCEPTIONS_SUCCESS,
      payload: simulatedPerceptions,
    })
  } catch (error) {
    dispatch({
      type: FETCH_PERCEPTIONS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch perception notes",
        type: "error",
      }),
    )
  }
}

// Create perception
export const createPerception = (perceptionData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_PERCEPTION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_PERCEPTION_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(perceptionData)
    });

    if (!response.ok) {
      throw new Error('Failed to create perception note');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Generate a unique ID
    const newId = Math.max(...simulatedPerceptions.map((p) => p.id), 0) + 1

    // Create a new perception
    const newPerception = {
      id: newId,
      ...perceptionData,
      status: "pending",
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      printed: false,
    }

    // Add the new perception to the simulated data
    simulatedPerceptions.push(newPerception)

    dispatch({
      type: CREATE_PERCEPTION_SUCCESS,
      payload: newPerception,
    })

    dispatch(
      addAudit({
        action: "CREATE_PERCEPTION",
        userId: user.id,
        details: `User ${user.username} created perception note #${newId}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Note de perception créée avec succès",
        type: "success",
      }),
    )

    // Notify relevant personnel
    dispatch(
      addNotification({
        id: Date.now(),
        title: "Nouvelle Note de Perception",
        message: `Une nouvelle note de perception a été créée par ${user.firstName} ${user.lastName}`,
        type: "perception",
        createdAt: new Date().toISOString(),
        read: false,
      }),
    )

    return newPerception
  } catch (error) {
    dispatch({
      type: CREATE_PERCEPTION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to create perception note",
        type: "error",
      }),
    )

    return null
  }
}

// Update perception
export const updatePerception = (id, perceptionData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_PERCEPTION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_PERCEPTION_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(perceptionData)
    });

    if (!response.ok) {
      throw new Error('Failed to update perception note');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the perception by ID
    const index = simulatedPerceptions.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error("Perception note not found")
    }

    // Update the perception
    const updatedPerception = {
      ...simulatedPerceptions[index],
      ...perceptionData,
    }

    simulatedPerceptions[index] = updatedPerception

    dispatch({
      type: UPDATE_PERCEPTION_SUCCESS,
      payload: updatedPerception,
    })

    dispatch(
      addAudit({
        action: "UPDATE_PERCEPTION",
        userId: user.id,
        details: `User ${user.username} updated perception note #${id}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Note de perception mise à jour avec succès",
        type: "success",
      }),
    )

    return updatedPerception
  } catch (error) {
    dispatch({
      type: UPDATE_PERCEPTION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to update perception note",
        type: "error",
      }),
    )

    return null
  }
}

// Delete perception
export const deletePerception = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_PERCEPTION_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_PERCEPTION_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete perception note');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the perception by ID
    const index = simulatedPerceptions.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error("Perception note not found")
    }

    // Remove the perception from the simulated data
    simulatedPerceptions.splice(index, 1)

    dispatch({
      type: DELETE_PERCEPTION_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "DELETE_PERCEPTION",
        userId: user.id,
        details: `User ${user.username} deleted perception note #${id}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Note de perception supprimée avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: DELETE_PERCEPTION_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to delete perception note",
        type: "error",
      }),
    )
  }
}

// Set current perception
export const setCurrentPerception = (perception) => ({
  type: SET_CURRENT_PERCEPTION,
  payload: perception,
})
