"use client"

import { Badge } from "react-bootstrap"
import { CheckCircle, XCircle, Clock } from "react-bootstrap-icons"

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Badge bg="warning">
          <Clock className="me-1" /> En attente
        </Badge>
      )
    case "approved":
    case "validated":
    case "active":
      return (
        <Badge bg="success">
          <CheckCircle className="me-1" />{" "}
          {status === "active" ? "Actif" : status === "approved" ? "Approuvé" : "Validé"}
        </Badge>
      )
    case "rejected":
    case "inactive":
      return (
        <Badge bg="danger">
          <XCircle className="me-1" /> {status === "inactive" ? "Inactif" : "Rejeté"}
        </Badge>
      )
    default:
      return <Badge bg="secondary">{status}</Badge>
  }
}

export default StatusBadge
