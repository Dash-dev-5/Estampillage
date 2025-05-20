import { Container, Row, Col, Button } from "react-bootstrap"
import { ExclamationTriangle } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="text-center">
        <Col md={12} className="mb-4">
          <ExclamationTriangle className="text-warning" size={80} />
        </Col>
        <Col md={12}>
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Non Trouvée</h2>
          <p className="lead mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>
          <Button as={Link} to="/dashboard" variant="primary" size="lg" className="hover-lift">
            Retourner au tableau de bord
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
