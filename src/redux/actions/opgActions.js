import {
  FETCH_OPGS_REQUEST,
  FETCH_OPGS_SUCCESS,
  FETCH_OPGS_FAILURE,
  CREATE_OPG_REQUEST,
  CREATE_OPG_SUCCESS,
  CREATE_OPG_FAILURE,
  UPDATE_OPG_REQUEST,
  UPDATE_OPG_SUCCESS,
  UPDATE_OPG_FAILURE,
  DELETE_OPG_REQUEST,
  DELETE_OPG_SUCCESS,
  DELETE_OPG_FAILURE,
  SET_CURRENT_OPG,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"

// Simulated data for OPGs
const simulatedOPGs = [
  {
    id: 1,
    name: "OPG Kinshasa Est",
    code: "KIN-E",
    location: "Kinshasa",
    manager: "Jean Dupont",
    contactPhone: "+243123456789",
    contactEmail: "jean.dupont@estampillage.com",
    status: "active",
    createdAt: "2023-01-10T08:00:00Z",
  },
  {
    id: 2,
    name: "OPG Lubumbashi",
    code: "LUB",
    location: "Lubumbashi",
    manager: "Marie Nzuzi",
    contactPhone: "+243987654321",
    contactEmail: "marie.nzuzi@estampillage.com",
    status: "active",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 3,
    name: "OPG Matadi",
    code: "MAT",
    location: "Matadi",
    manager: "Paul Kasa",
    contactPhone: "+243456789123",
    contactEmail: "paul.kasa@estampillage.com",
    status: "inactive",
    createdAt: "2023-01-20T14:15:00Z",
  },
]

// Fetch OPGs
export const fetchOPGs = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_OPGS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_OPG_API_URL}`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch OPGs');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_OPGS_SUCCESS,
      payload: simulatedOPGs,
    })
  } catch (error) {
    dispatch({
      type: FETCH_OPGS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch OPGs",
        type: "error",
      }),
    )
  }
}

// Create OPG
export const createOPG = (opgData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_OPG_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_OPG_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(opgData)
    });

    if (!response.ok) {
      throw new Error('Failed to create OPG');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Generate a unique ID
    const newId = Math.max(...simulatedOPGs.map((o) => o.id), 0) + 1

    // Create a new OPG
    const newOPG = {
      id: newId,
      ...opgData,
      createdAt: new Date().toISOString(),
    }

    // Add the new OPG to the simulated data
    simulatedOPGs.push(newOPG)

    dispatch({
      type: CREATE_OPG_SUCCESS,
      payload: newOPG,
    })

    dispatch(
      addAudit({
        action: "CREATE_OPG",
        userId: user.id,
        details: `User ${user.username} created OPG #${newId} (${opgData.name})`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "OPG créé avec succès",
        type: "success",
      }),
    )

    return newOPG
  } catch (error) {
    dispatch({
      type: CREATE_OPG_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to create OPG",
        type: "error",
      }),
    )

    return null
  }
}

// Update OPG
export const updateOPG = (id, opgData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_OPG_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_OPG_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(opgData)
    });

    if (!response.ok) {
      throw new Error('Failed to update OPG');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the OPG by ID
    const index = simulatedOPGs.findIndex((o) => o.id === id)

    if (index === -1) {
      throw new Error("OPG not found")
    }

    // Update the OPG
    const updatedOPG = {
      ...simulatedOPGs[index],
      ...opgData,
    }

    simulatedOPGs[index] = updatedOPG

    dispatch({
      type: UPDATE_OPG_SUCCESS,
      payload: updatedOPG,
    })

    dispatch(
      addAudit({
        action: "UPDATE_OPG",
        userId: user.id,
        details: `User ${user.username} updated OPG #${id} (${updatedOPG.name})`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "OPG mis à jour avec succès",
        type: "success",
      }),
    )

    return updatedOPG
  } catch (error) {
    dispatch({
      type: UPDATE_OPG_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to update OPG",
        type: "error",
      }),
    )

    return null
  }
}

// Delete OPG
export const deleteOPG = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_OPG_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_OPG_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete OPG');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the OPG by ID
    const index = simulatedOPGs.findIndex((o) => o.id === id)

    if (index === -1) {
      throw new Error("OPG not found")
    }

    const deletedOPG = simulatedOPGs[index]

    // Remove the OPG from the simulated data
    simulatedOPGs.splice(index, 1)

    dispatch({
      type: DELETE_OPG_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "DELETE_OPG",
        userId: user.id,
        details: `User ${user.username} deleted OPG #${id} (${deletedOPG.name})`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "OPG supprimé avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: DELETE_OPG_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to delete OPG",
        type: "error",
      }),
    )
  }
}

// Set current OPG
export const setCurrentOPG = (opg) => ({
  type: SET_CURRENT_OPG,
  payload: opg,
})
