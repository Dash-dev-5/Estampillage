"use client"

import { Container, Row, Col } from "react-bootstrap"

const EmptyState = ({ icon, title, message, children }) => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {icon && <div className="mb-4">{icon}</div>}
          <h4 className="mb-3">{title || "Aucun élément trouvé"}</h4>
          <p className="text-muted mb-4">{message || "Il n'y a aucun élément à afficher pour le moment."}</p>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default EmptyState
