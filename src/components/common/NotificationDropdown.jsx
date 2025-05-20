"use client"

import { Badge, ListGroup } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { markNotificationRead, markAllNotificationsRead } from "../../redux/actions/notificationActions"
import { Bell, EnvelopeOpen, CheckAll } from "react-bootstrap-icons"

const NotificationDropdown = ({ notifications, onClose }) => {
  const dispatch = useDispatch()

  const handleNotificationClick = (id) => {
    dispatch(markNotificationRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
  }

  return (
    <div
      className="bg-white shadow-lg rounded border"
      style={{
        position: "absolute",
        width: "280px",
        maxHeight: "350px",
        overflowY: "auto",
        bottom: "60px",
        left: "0",
        zIndex: 1000,
      }}
    >
      <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
        <h6 className="m-0 fw-bold d-flex align-items-center">
          <Bell className="me-2" /> Notifications
        </h6>
        <button className="btn btn-sm btn-outline-primary" onClick={handleMarkAllAsRead} title="Marquer tout comme lu">
          <CheckAll />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-3 text-center text-muted">
          <p className="mb-0">Aucune notification</p>
        </div>
      ) : (
        <ListGroup variant="flush">
          {notifications.map((notification) => (
            <ListGroup.Item
              key={notification.id}
              className={`py-2 px-3 ${!notification.read ? "bg-light" : ""}`}
              action
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="d-flex align-items-start">
                <div className="text-primary me-2 mt-1">
                  <EnvelopeOpen size={18} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 fw-bold">{notification.title}</p>
                  <p className="mb-1 small">{notification.message}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{new Date(notification.createdAt).toLocaleDateString()}</small>
                    {!notification.read && <Badge bg="primary">Nouveau</Badge>}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="p-2 border-top text-center">
        <button className="btn btn-sm btn-link" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
