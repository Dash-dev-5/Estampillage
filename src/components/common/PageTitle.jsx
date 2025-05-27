"use client"

import { Row, Col, Button } from "react-bootstrap"

const PageTitle = ({ title, subtitle, icon, actionButton, actionText, actionOnClick }) => {
  return (
    <Row className="mb-4 align-items-center metric-card">
      <Col>
        <h1 className="h3 mb-1 d-flex align-items-center fade-in metric-value">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="mb-0 fade-in metric-subtitle">{subtitle}</p>}
      </Col>
      {actionButton && (
        <Col xs="auto">
          <Button variant="primary" onClick={actionOnClick} className="animate__animated animate__fadeIn hover-lift">
            {actionText || "Action"}
          </Button>
        </Col>
      )}
    </Row>
  )
}

export default PageTitle
