"use client"

import { useState, useEffect } from "react"
import { Form, Row, Col } from "react-bootstrap"

const OPGForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    manager: "",
    contactPhone: "",
    contactEmail: "",
    status: "active",
    ...initialData,
  })

  useEffect(() => {
    if (onChange) {
      onChange(formData)
    }
  }, [formData, onChange])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <Row className="g-3">
      <Col md={6}>
        <Form.Group controlId="name">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control type="text" name="code" value={formData.code} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group controlId="location">
          <Form.Label>Lieu</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group controlId="manager">
          <Form.Label>Gestionnaire</Form.Label>
          <Form.Control type="text" name="manager" value={formData.manager} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="contactPhone">
          <Form.Label>Téléphone</Form.Label>
          <Form.Control
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="contactEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group controlId="status">
          <Form.Label>Statut</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}

export default OPGForm
