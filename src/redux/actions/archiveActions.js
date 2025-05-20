import {
  FETCH_ARCHIVES_REQUEST,
  FETCH_ARCHIVES_SUCCESS,
  FETCH_ARCHIVES_FAILURE,
  ARCHIVE_DOCUMENT_REQUEST,
  ARCHIVE_DOCUMENT_SUCCESS,
  ARCHIVE_DOCUMENT_FAILURE,
  RESTORE_DOCUMENT_REQUEST,
  RESTORE_DOCUMENT_SUCCESS,
  RESTORE_DOCUMENT_FAILURE,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"

// Simulated data
const simulatedArchives = [
  {
    id: 1,
    documentType: "Declaration",
    documentId: 3,
    name: "Declaration #3 - Société DEF",
    archivedBy: 1,
    archivedAt: "2023-02-15T14:30:00Z",
    reason: "Rejected declaration",
    file: "declaration_3.pdf",
  },
  {
    id: 2,
    documentType: "PerceptionNote",
    documentId: 5,
    name: "Note de Perception #5 - Entreprise GHI",
    archivedBy: 3,
    archivedAt: "2023-03-10T09:45:00Z",
    reason: "Completed perception",
    file: "perception_5.pdf",
  },
  {
    id: 3,
    documentType: "Report",
    documentId: 7,
    name: "Rapport Mensuel - Janvier 2023",
    archivedBy: 1,
    archivedAt: "2023-02-05T11:20:00Z",
    reason: "Monthly archive",
    file: "report_jan_2023.pdf",
  },
]

// Fetch archives
export const fetchArchives = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_ARCHIVES_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_ADMIN_API_URL}/archives`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch archives');
    }
    
    const data = await response.json();
    */

    // Using simulated data for now
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch({
      type: FETCH_ARCHIVES_SUCCESS,
      payload: simulatedArchives,
    })
  } catch (error) {
    dispatch({
      type: FETCH_ARCHIVES_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to fetch archives",
        type: "error",
      }),
    )
  }
}

// Archive a document
export const archiveDocument = (documentData) => async (dispatch, getState) => {
  dispatch({ type: ARCHIVE_DOCUMENT_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_ADMIN_API_URL}/archives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(documentData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to archive document');
    }
    
    const data = await response.json();
    */

    // Using simulated data for now
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { user } = getState().auth

    // Generate a unique ID
    const newId = Math.max(...simulatedArchives.map((a) => a.id), 0) + 1

    // Create a new archive
    const newArchive = {
      id: newId,
      ...documentData,
      archivedBy: user.id,
      archivedAt: new Date().toISOString(),
    }

    // Add the new archive to the simulated data
    simulatedArchives.push(newArchive)

    dispatch({
      type: ARCHIVE_DOCUMENT_SUCCESS,
      payload: newArchive,
    })

    dispatch(
      addAudit({
        action: "ARCHIVE_DOCUMENT",
        userId: user.id,
        details: `User ${user.username} archived ${documentData.documentType} #${documentData.documentId}`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Document archivé avec succès",
        type: "success",
      }),
    )

    return newArchive
  } catch (error) {
    dispatch({
      type: ARCHIVE_DOCUMENT_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to archive document",
        type: "error",
      }),
    )

    return null
  }
}

// Restore an archived document
export const restoreDocument = (id) => async (dispatch, getState) => {
  dispatch({ type: RESTORE_DOCUMENT_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${import.meta.env.REACT_APP_ADMIN_API_URL}/archives/${id}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to restore document');
    }
    */

    // Using simulated data for now
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Find the archive by ID
    const index = simulatedArchives.findIndex((a) => a.id === id)

    if (index === -1) {
      throw new Error("Archive not found")
    }

    // Get the archive details before removing
    const archive = simulatedArchives[index]

    // Remove the archive from the simulated data
    simulatedArchives.splice(index, 1)

    dispatch({
      type: RESTORE_DOCUMENT_SUCCESS,
      payload: id,
    })

    dispatch(
      addAudit({
        action: "RESTORE_DOCUMENT",
        userId: user.id,
        details: `User ${user.username} restored ${archive.documentType} #${archive.documentId} from archives`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Document restauré avec succès",
        type: "success",
      }),
    )
  } catch (error) {
    dispatch({
      type: RESTORE_DOCUMENT_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Failed to restore document",
        type: "error",
      }),
    )
  }
}
