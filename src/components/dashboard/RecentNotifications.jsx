"use client"

import { Card, Button } from "react-bootstrap"

const RecentNotifications = ({ notifications }) => {
  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications Récentes</h5>
        <Button variant="outline-primary" size="sm" className="hover-lift">
          Voir tout
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="list-group list-group-flush">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`list-group-item list-group-item-action ${notification.read ? "bg-light" : ""}`}
            >
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">{notification.title}</h6>
                <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">{notification.message}</p>
              <small className={`${notification.read ? "text-muted" : "text-primary"}`}>
                {notification.read ? "Lu" : "Non lu"}
              </small>
            </div>
          ))}
          {notifications.length === 0 && <div className="list-group-item text-center py-3">Aucune notification</div>}
        </div>
      </Card.Body>
    </Card>
  )
}

export default RecentNotifications
