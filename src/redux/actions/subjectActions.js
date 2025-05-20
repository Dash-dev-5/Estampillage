import {
  FETCH_SUBJECTS_REQUEST,
  FETCH_SUBJECTS_SUCCESS,
  FETCH_SUBJECTS_FAILURE,
  CREATE_SUBJECT_REQUEST,
  CREATE_SUBJECT_SUCCESS,
  CREATE_SUBJECT_FAILURE,
  UPDATE_SUBJECT_REQUEST,
  UPDATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_FAILURE,
  DELETE_SUBJECT_REQUEST,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILURE,
  SET_CURRENT_SUBJECT,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"

// Simulated data for subjects
const simulatedSubjects = [
  {
    id: 1,
    name: "Entreprise XYZ",
    taxId: "XYZ12345",
    sector: "Mining",
    contactName: "John Doe",
    contactPhone: "+243123456789",
    contactEmail: "john.doe@xyz.com",
    address: "123 Avenue de la République, Kinshasa",
    status: "active",
    createdAt: "2023-01-05T08:30:00Z",
  },
  {
    id: 2,
    name: "Compagnie ABC",
    taxId: "ABC67890",
    sector: "Agriculture",
    contactName: "Jane Smith",
    contactPhone: "+243987654321",
    contactEmail: "jane.smith@abc.com",
    address: "456 Avenue du Commerce, Lubumbashi",
    status: "active",
    createdAt: "2023-01-10T10:15:00Z",
  },
  {
    id: 3,
    name: "Société DEF",
    taxId: "DEF54321",
    sector: "Manufacturing",
    contactName: "Bob Johnson",
    contactPhone: "+243456789123",
    contactEmail: "bob.johnson@def.com",
    address: "789 Avenue de l'Industrie, Matadi",
    status: "inactive",
    createdAt: "2023-01-15T14:45:00Z",
  },
]

// Fetch subjects
export const fetchSubjects = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_SUBJECTS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/subjects`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_SUBJECTS_SUCCESS,
      payload: simulatedSubjects,
    })
  } catch (error) {
    dispatch({
      type: FETCH_SUBJECTS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch subjects",
        type: "error",
      }),
    )
  }
}

// Create subject
export const createSubject = (subjectData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_SUBJECT_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(subjectData)
    });

    if (!response.ok) {
      throw new Error('Failed to create subject');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Check if taxId already exists
    const existingTaxId = simulatedSubjects.find((s) => s.taxId === subjectData.taxId)
    if (existingTaxId) {
      throw new Error(`Tax ID "${subjectData.taxId}" is already registered`)
    }

    // Generate a unique ID
    const newId = Math.max(...simulatedSubjects.map((s) => s.id), 0) + 1

    // Create a new subject
    const newSubject = {
      id: newId,
      ...subjectData,
      createdAt: new Date().toISOString(),
    }

    // Add the new subject to the simulated data
    simulatedSubjects.push(newSubject)

    dispatch({
      type: CREATE_SUBJECT_SUCCESS,
      payload: newSubject,
    })

    dispatch(
      addAudit({
        action: "CREATE_SUBJECT",
        userId: user.id,
        details: `User ${user.username} created subject ${subjectData.name}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Assujetti créé avec succès",
        type: "success",
      }),
    )

    return newSubject
  } catch (error) {
    dispatch({
      type: CREATE_SUBJECT_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to create subject",
        type: "error",
      }),
    )

    return null
  }
}

// Update subject
export const updateSubject = (id, subjectData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_SUBJECT_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(subjectData)
    });

    if (!response.ok) {
      throw new Error('Failed to update subject');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the subject by ID
    const index = simulatedSubjects.findIndex((s) => s.id === id)

    if (index === -1) {
      throw new Error("Subject not found")
    }

    // Check if taxId already exists (except for the current subject)
    const existingTaxId = simulatedSubjects.find((s) => s.taxId === subjectData.taxId && s.id !== id)
    if (existingTaxId) {
      throw new Error(`Tax ID "${subjectData.taxId}" is already registered`)
    }

    // Update the subject
    const updatedSubject = {
      ...simulatedSubjects[index],
      ...subjectData,
    }

    simulatedSubjects[index] = updatedSubject

    dispatch({
      type: UPDATE_SUBJECT_SUCCESS,
      payload: updatedSubject,
    })

    dispatch(
      addAudit({
        action: "UPDATE_SUBJECT",
        userId: user.id,
        details: `User ${user.username} updated subject ${updatedSubject.name}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Assujetti mis à jour avec succès",
        type: "success",
      }),
    )

    return updatedSubject
  } catch (error) {
    dispatch({
      type: UPDATE_SUBJECT_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to update subject",
        type: "error",
      }),
    )

    return null
  }
}

// Delete subject
export const deleteSubject = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_SUBJECT_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_ADMIN_API_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete subject');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the subject by ID
    const index = simulatedSubjects.findIndex((s) => s.id === id)

    if (index === -1) {
      throw new Error("Subject not found")
    }

    const deletedSubject = simulatedSubjects[index]

    // Remove the subject from the simulated data
    simulatedSubjects.splice(index, 1)

    dispatch({
      type: DELETE_SUBJECT_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "DELETE_SUBJECT",
        userId: user.id,
        details: `User ${user.username} deleted subject ${deletedSubject.name}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Assujetti supprimé avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: DELETE_SUBJECT_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to delete subject",
        type: "error",
      }),
    )
  }
}

// Set current subject
export const setCurrentSubject = (subject) => ({
  type: SET_CURRENT_SUBJECT,
  payload: subject,
})
