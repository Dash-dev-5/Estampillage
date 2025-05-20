"use client"

import { useState, useEffect } from "react"
import { Form, Row, Col } from "react-bootstrap"

const SubjectForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    sector: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
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
          <Form.Label>Nom de l'entreprise</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="taxId">
          <Form.Label>ID Fiscal</Form.Label>
          <Form.Control type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="sector">
          <Form.Label>Secteur d'activité</Form.Label>
          <Form.Select name="sector" value={formData.sector} onChange={handleInputChange} required>
            <option value="">Sélectionner un secteur</option>
            <option value="Mining">Mines</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Manufacturing">Fabrication</option>
            <option value="Services">Services</option>
            <option value="Other">Autre</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="status">
          <Form.Label>Statut</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group controlId="address">
          <Form.Label>Adresse</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={12}>
        <hr />
        <h6>Informations de contact</h6>
      </Col>
      <Col md={12}>
        <Form.Group controlId="contactName">
          <Form.Label>Nom du contact</Form.Label>
          <Form.Control
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
          />
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
    </Row>
  )
}

export default SubjectForm
