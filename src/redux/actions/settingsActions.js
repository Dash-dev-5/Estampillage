import {
  FETCH_SETTINGS_REQUEST,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_FAILURE,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../types"
import { addAudit } from "./auditActions"
import { showToast } from "./uiActions"

// Données simulées pour les paramètres
const simulatedSettings = {
  revenueDistribution: {
    dgrkc: 45,
    estampi: 35,
    gouvernement: 20,
  },
  systemSettings: {
    currency: "FC",
    timezone: "UTC+1",
    language: "fr",
    autoArchive: true,
    notificationEmail: true,
  },
}

// Récupérer les paramètres
export const fetchSettings = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_SETTINGS_REQUEST })

  try {
    // Simulation API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    dispatch({
      type: FETCH_SETTINGS_SUCCESS,
      payload: simulatedSettings,
    })
  } catch (error) {
    dispatch({
      type: FETCH_SETTINGS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Erreur lors du chargement des paramètres",
        type: "error",
      }),
    )
  }
}

// Mettre à jour les paramètres (DG/Admin seulement)
export const updateSettings = (settingsData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_SETTINGS_REQUEST })

  try {
    // Simulation API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Vérifier que la somme des pourcentages = 100
    const { dgrkc, estampi, gouvernement } = settingsData.revenueDistribution
    if (dgrkc + estampi + gouvernement !== 100) {
      throw new Error("La somme des pourcentages doit être égale à 100%")
    }

    // Mettre à jour les données simulées
    Object.assign(simulatedSettings, settingsData)

    dispatch({
      type: UPDATE_SETTINGS_SUCCESS,
      payload: simulatedSettings,
    })

    dispatch(
      addAudit({
        action: "UPDATE_SETTINGS",
        userId: user.id,
        details: `User ${user.username} updated system settings`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Paramètres mis à jour avec succès",
        type: "success",
      }),
    )

    return simulatedSettings
  } catch (error) {
    dispatch({
      type: UPDATE_SETTINGS_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Erreur lors de la mise à jour des paramètres",
        type: "error",
      }),
    )

    return null
  }
}

// Mettre à jour le profil utilisateur
export const updateProfile = (profileData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST })

  try {
    // Simulation API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { user } = getState().auth

    // Simuler la mise à jour du profil
    const updatedUser = {
      ...user,
      ...profileData,
    }

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: updatedUser,
    })

    dispatch(
      addAudit({
        action: "UPDATE_PROFILE",
        userId: user.id,
        details: `User ${user.username} updated their profile`,
        timestamp: new Date().toISOString(),
      }),
    )

    dispatch(
      showToast({
        message: "Profil mis à jour avec succès",
        type: "success",
      }),
    )

    return updatedUser
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: error.message,
    })

    dispatch(
      showToast({
        message: error.message || "Erreur lors de la mise à jour du profil",
        type: "error",
      }),
    )

    return null
  }
}
