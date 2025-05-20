"use client"

import { useState, useEffect } from "react"
import { Form, Row, Col } from "react-bootstrap"

const DeclarationForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState({
    subjectId: "",
    subjectName: "",
    quantityDeclared: "",
    bagsStamped: "",
    taxRate: "0.05",
    amountDue: "",
    ...initialData,
  })

  useEffect(() => {
    if (formData.quantityDeclared && formData.taxRate) {
      const amountDue = Number.parseFloat(formData.quantityDeclared) * Number.parseFloat(formData.taxRate)
      setFormData((prev) => ({ ...prev, amountDue }))
    }
  }, [formData.quantityDeclared, formData.taxRate])

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
        <Form.Group controlId="subjectId">
          <Form.Label>ID Assujetti</Form.Label>
          <Form.Control type="text" name="subjectId" value={formData.subjectId} onChange={handleInputChange} required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="subjectName">
          <Form.Label>Nom Assujetti</Form.Label>
          <Form.Control
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="quantityDeclared">
          <Form.Label>Quantité Déclarée</Form.Label>
          <Form.Control
            type="number"
            name="quantityDeclared"
            value={formData.quantityDeclared}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="bagsStamped">
          <Form.Label>Nombre de Sacs Estampillés</Form.Label>
          <Form.Control
            type="number"
            name="bagsStamped"
            value={formData.bagsStamped}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="taxRate">
          <Form.Label>Taux d'Imposition</Form.Label>
          <Form.Select name="taxRate" value={formData.taxRate} onChange={handleInputChange} required>
            <option value="0.05">5%</option>
            <option value="0.08">8%</option>
            <option value="0.10">10%</option>
            <option value="0.15">15%</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="amountDue">
          <Form.Label>Montant Dû</Form.Label>
          <Form.Control
            type="text"
            value={`${formData.amountDue ? formData.amountDue.toLocaleString() : 0} FC`}
            readOnly
          />
        </Form.Group>
      </Col>
    </Row>
  )
}

export default DeclarationForm
