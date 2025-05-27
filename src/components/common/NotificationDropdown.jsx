"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dropdown, Badge, ListGroup } from "react-bootstrap"
import { Bell, BellFill, Check2All } from "react-bootstrap-icons"
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../redux/actions/notificationActions"

const NotificationDropdown = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state) => state.notification)
  const [show, setShow] = useState(false)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "declaration":
        return "📄"
      case "perception":
        return "💰"
      case "user":
        return "👤"
      case "system":
        return "⚙️"
      case "fraud":
        return "⚠️"
      default:
        return "📢"
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now - time
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}m`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days}j`
  }

  return (
    <Dropdown show={show} onToggle={setShow} align="end">
      <Dropdown.Toggle as="button" className="header-action notification-toggle" id="notification-dropdown">
        {unreadCount > 0 ? <BellFill size={18} /> : <Bell size={18} />}
        {unreadCount > 0 && <Badge className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</Badge>}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-dropdown-menu">
        <div className="notification-header">
          <h6 className="mb-0">Notifications</h6>
          {unreadCount > 0 && (
            <button className="btn-link" onClick={handleMarkAllAsRead}>
              <Check2All size={16} />
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Bell size={32} className="text-muted" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.slice(0, 10).map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                    <div className="notification-body">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {formatTime(notification.createdAt || notification.timestamp)}
                      </div>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {notifications.length > 10 && (
          <div className="notification-footer">
            <button className="btn-link">Voir toutes les notifications</button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default NotificationDropdown
