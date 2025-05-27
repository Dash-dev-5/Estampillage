"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addNotification, markNotificationRead } from "../redux/actions/notificationActions"

export const useNotifications = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.notification.notifications)
  const [toastNotification, setToastNotification] = useState(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Demander la permission pour les notifications du navigateur
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Simuler des notifications en temps réel
    const interval = setInterval(() => {
      const mockNotifications = [
        {
          id: Date.now(),
          title: "Nouvelle déclaration",
          message: "Une nouvelle déclaration a été soumise par Entreprise ABC",
          type: "declaration",
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: Date.now() + 1,
          title: "Note de perception validée",
          message: "La note #12345 a été validée avec succès",
          type: "perception",
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: Date.now() + 2,
          title: "Nouvel utilisateur",
          message: "Un nouvel utilisateur s'est inscrit dans le système",
          type: "user",
          createdAt: new Date().toISOString(),
          read: false,
        },
      ]

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]

      // Ajouter à Redux
      dispatch(addNotification(randomNotification))

      // Afficher le toast
      setToastNotification(randomNotification)
      setShowToast(true)

      // Notification du navigateur
      if (Notification.permission === "granted") {
        new Notification(randomNotification.title, {
          body: randomNotification.message,
          icon: "/favicon.ico",
        })
      }
    }, 45000) // Toutes les 45 secondes

    return () => clearInterval(interval)
  }, [dispatch])

  const hideToast = () => {
    setShowToast(false)
    setTimeout(() => setToastNotification(null), 300)
  }

  const markAsRead = (id) => {
    dispatch(markNotificationRead(id))
  }

  return {
    notifications,
    toastNotification,
    showToast,
    hideToast,
    markAsRead,
  }
}
