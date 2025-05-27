class NotificationService {
  constructor() {
    this.permission = null
    this.init()
  }

  async init() {
    // Vérifier si les notifications sont supportées
    if (!("Notification" in window)) {
      console.log("Ce navigateur ne supporte pas les notifications")
      return
    }

    // Demander la permission
    if (Notification.permission === "default") {
      this.permission = await Notification.requestPermission()
    } else {
      this.permission = Notification.permission
    }
  }

  // Envoyer une notification du navigateur
  sendBrowserNotification(title, options = {}) {
    if (this.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })

      // Auto-fermer après 5 secondes
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  // Simuler des notifications en temps réel
  startRealTimeNotifications(callback) {
    const notifications = [
      {
        title: "Nouvelle déclaration",
        message: "Une nouvelle déclaration a été soumise",
        type: "declaration",
      },
      {
        title: "Note de perception validée",
        message: "La note #NP-2023-046 a été validée",
        type: "perception",
      },
      {
        title: "Alerte système",
        message: "Maintenance programmée dans 30 minutes",
        type: "system",
      },
      {
        title: "Nouveau utilisateur",
        message: "Un nouvel OPG a été créé",
        type: "user",
      },
    ]

    // Envoyer une notification aléatoire toutes les 30 secondes
    const interval = setInterval(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      const notification = {
        ...randomNotification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      }

      callback(notification)

      // Envoyer aussi une notification du navigateur
      this.sendBrowserNotification(notification.title, {
        body: notification.message,
        tag: notification.type,
      })
    }, 30000) // 30 secondes

    return interval
  }

  stopRealTimeNotifications(interval) {
    if (interval) {
      clearInterval(interval)
    }
  }
}

export default new NotificationService()
