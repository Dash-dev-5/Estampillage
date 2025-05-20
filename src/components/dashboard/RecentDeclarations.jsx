"use client"

import { Table, Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CheckCircle, XCircle, Clock } from "react-bootstrap-icons"

const RecentDeclarations = ({ declarations }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning">
            <Clock className="me-1" /> En attente
          </Badge>
        )
      case "approved":
        return (
          <Badge bg="success">
            <CheckCircle className="me-1" /> Approuvé
          </Badge>
        )
      case "rejected":
        return (
          <Badge bg="danger">
            <XCircle className="me-1" /> Rejeté
          </Badge>
        )
      default:
        return <Badge bg="secondary">Inconnu</Badge>
    }
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Déclarations Récentes</h5>
        <Link to="/declaration" className="btn btn-sm btn-outline-primary hover-lift">
          Voir tout
        </Link>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover responsive>
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Assujetti</th>
              <th>Montant</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {declarations.slice(0, 5).map((declaration) => (
              <tr key={declaration.id}>
                <td>#{declaration.id}</td>
                <td>{declaration.subjectName}</td>
                <td>{declaration.amountDue.toLocaleString()} FC</td>
                <td>{getStatusBadge(declaration.status)}</td>
                <td>{new Date(declaration.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {declarations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  Aucune déclaration trouvée
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default RecentDeclarations
