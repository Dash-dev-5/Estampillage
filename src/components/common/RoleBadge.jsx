"use client"

import { Badge } from "react-bootstrap"

const RoleBadge = ({ role }) => {
  switch (role) {
    case "admin":
      return <Badge bg="danger">Administrateur</Badge>
    case "dg":
      return <Badge bg="primary">Direction Générale</Badge>
    case "opg":
      return <Badge bg="success">OPG</Badge>
    case "comptable":
      return <Badge bg="info">Comptable</Badge>
    default:
      return <Badge bg="secondary">{role}</Badge>
  }
}

export default RoleBadge
