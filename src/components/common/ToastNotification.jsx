"use client"

import { useEffect } from "react"
import { Toast, ToastContainer } from "react-bootstrap"
import { CheckCircle, ExclamationTriangle, InfoCircle, XCircle } from "react-bootstrap-icons"

const ToastNotification = ({ show, onClose, notification }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-success" />
      case "warning":
        return <ExclamationTriangle className="text-warning" />
      case "error":
        return <XCircle className="text-danger" />
      case "info":
      default:
        return <InfoCircle className="text-info" />
    }
  }

  const getVariant = (type) => {
    switch (type) {
      case "success":
        return "success"
      case "warning":
        return "warning"
      case "error":
        return "danger"
      case "info":
      default:
        return "info"
    }
  }

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast show={show} onClose={onClose} className={`toast-notification toast-${getVariant(notification?.type)}`}>
        <Toast.Header>
          <div className="d-flex align-items-center">
            {getIcon(notification?.type)}
            <strong className="me-auto ms-2">{notification?.title}</strong>
            <small className="text-muted">À l'instant</small>
          </div>
        </Toast.Header>
        <Toast.Body>{notification?.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default ToastNotification
