"use client"

import { useState, useEffect } from "react"
import { Form, Row, Col } from "react-bootstrap"

const UserForm = ({ initialData, onChange, isEdit = false }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    site: "",
    password: "",
    confirmPassword: "",
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
        <Form.Group controlId="username">
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isEdit}
          />
          {isEdit && <Form.Text className="text-muted">Le nom d'utilisateur ne peut pas être modifié.</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="firstName">
          <Form.Label>Prénom</Form.Label>
          <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="lastName">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="role">
          <Form.Label>Rôle</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleInputChange} required>
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Administrateur</option>
            <option value="dg">Direction Générale</option>
            <option value="opg">OPG</option>
            <option value="comptable">Comptable</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="site">
          <Form.Label>Site</Form.Label>
          <Form.Control type="text" name="site" value={formData.site} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      {!isEdit && (
        <>
          <Col md={6}>
            <Form.Group controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </>
      )}
      <Col md={6}>
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

export default UserForm
