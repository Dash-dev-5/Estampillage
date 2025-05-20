import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  ADD_NOTIFICATION,
} from "../types"

// Simulated data for now
let simulatedNotifications = [
  {
    id: 1,
    title: "Nouvelle déclaration",
    message: "Une nouvelle déclaration a été soumise par Entreprise XYZ",
    type: "declaration",
    createdAt: "2023-05-15T09:30:00Z",
    read: false,
  },
  {
    id: 2,
    title: "Note de perception générée",
    message: "La note de perception #1234 a été générée et est prête pour impression",
    type: "perception",
    createdAt: "2023-05-14T14:45:00Z",
    read: true,
  },
  {
    id: 3,
    title: "Signalement de fraude",
    message: "Un signalement de fraude a été enregistré pour la déclaration #5678",
    type: "fraud",
    createdAt: "2023-05-13T11:20:00Z",
    read: false,
  },
  {
    id: 4,
    title: "Nouvel utilisateur",
    message: "Un nouvel utilisateur a été créé : Jean Dupont (OPG)",
    type: "user",
    createdAt: "2023-05-12T16:10:00Z",
    read: true,
  },
]

// Fetch notifications
export const fetchNotifications = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST })

  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_API_URL}`, {
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 500))

    dispatch({
      type: FETCH_NOTIFICATIONS_SUCCESS,
      payload: simulatedNotifications,
    })
  } catch (error) {
    dispatch({
      type: FETCH_NOTIFICATIONS_FAILURE,
      payload: error.message,
    })
  }
}

// Mark notification as read
export const markNotificationRead = (id) => async (dispatch, getState) => {
  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_API_URL}/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Update the notification in the simulated data
    const index = simulatedNotifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      simulatedNotifications[index].read = true
    }

    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: id,
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

// Mark all notifications as read
export const markAllNotificationsRead = () => async (dispatch, getState) => {
  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_API_URL}/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().auth.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update all notifications in the simulated data
    simulatedNotifications = simulatedNotifications.map((n) => ({ ...n, read: true }))

    dispatch({
      type: MARK_ALL_NOTIFICATIONS_READ,
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
  }
}

// Add a new notification
export const addNotification = (notification) => async (dispatch, getState) => {
  try {
    // Simulate API call
    /*
    const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.token}`
      },
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      throw new Error('Failed to add notification');
    }

    const data = await response.json();
    */

    // Using simulated data
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Add to the simulated data
    simulatedNotifications.unshift(notification)

    dispatch({
      type: ADD_NOTIFICATION,
      payload: notification,
    })
  } catch (error) {
    console.error("Error adding notification:", error)
  }
}
