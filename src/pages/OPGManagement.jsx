"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Badge, InputGroup } from "react-bootstrap"
import {
  PersonBadge,
  Search,
  Pencil,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Telephone,
  Envelope,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchOPGs, createOPG, updateOPG, deleteOPG } from "../redux/actions/opgActions"

const OPGManagement = () => {
  const dispatch = useDispatch()
  const { opgs, loading, error } = useSelector((state) => state.opg)
  const { user } = useSelector((state) => state.auth)

  // State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOPG, setSelectedOPG] = useState(null)
  const [filter, setFilter] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    manager: "",
    contactPhone: "",
    contactEmail: "",
    status: "active",
  })

  useEffect(() => {
    dispatch(fetchOPGs())
  }, [dispatch])

  const handleCreateModalOpen = () => {
    setFormData({
      name: "",
      code: "",
      location: "",
      manager: "",
      contactPhone: "",
      contactEmail: "",
      status: "active",
    })
    setShowCreateModal(true)
  }

  const handleEditModalOpen = (opg) => {
    setSelectedOPG(opg)
    setFormData({
      name: opg.name,
      code: opg.code,
      location: opg.location,
      manager: opg.manager,
      contactPhone: opg.contactPhone,
      contactEmail: opg.contactEmail,
      status: opg.status,
    })
    setShowEditModal(true)
  }

  const handleViewModalOpen = (opg) => {
    setSelectedOPG(opg)
    setShowViewModal(true)
  }

  const handleDeleteModalOpen = (opg) => {
    setSelectedOPG(opg)
    setShowDeleteModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (showCreateModal) {
      dispatch(createOPG(formData))
      setShowCreateModal(false)
    } else if (showEditModal) {
      dispatch(updateOPG(selectedOPG.id, formData))
      setShowEditModal(false)
    }
  }

  const handleDelete = () => {
    dispatch(deleteOPG(selectedOPG.id))
    setShowDeleteModal(false)
  }

  const filteredOPGs = opgs.filter(
    (opg) =>
      opg.name.toLowerCase().includes(filter.toLowerCase()) ||
      opg.code.toLowerCase().includes(filter.toLowerCase()) ||
      opg.location.toLowerCase().includes(filter.toLowerCase()) ||
      opg.manager.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Gestion des OPG"
          subtitle="Gérez les Offices Provinciaux de Gestion"
          icon={<PersonBadge className="me-2" size={24} />}
          actionButton
          actionText="Nouvel OPG"
          actionOnClick={handleCreateModalOpen}
        />

        {error && (
          <Alert variant="danger" className="animate__animated animate__fadeIn">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par nom, code, lieu ou gestionnaire..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Code</th>
                  <th>Nom</th>
                  <th>Lieu</th>
                  <th>Gestionnaire</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement des OPGs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOPGs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Aucun OPG trouvé
                    </td>
                  </tr>
                ) : (
                  filteredOPGs.map((opg) => (
                    <tr key={opg.id} className="align-middle hover-lift">
                      <td>{opg.code}</td>
                      <td>{opg.name}</td>
                      <td>{opg.location}</td>
                      <td>{opg.manager}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <small>
                            <Telephone className="me-1" /> {opg.contactPhone}
                          </small>
                          <small>
                            <Envelope className="me-1" /> {opg.contactEmail}
                          </small>
                        </div>
                      </td>
                      <td>
                        {opg.status === "active" ? (
                          <Badge bg="success">
                            <CheckCircle className="me-1" /> Actif
                          </Badge>
                        ) : (
                          <Badge bg="danger">
                            <XCircle className="me-1" /> Inactif
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewModalOpen(opg)}
                            title="Voir"
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEditModalOpen(opg)}
                            title="Modifier"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteModalOpen(opg)}
                            title="Supprimer"
                          >
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Create OPG Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Nouvel OPG</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="manager">
                  <Form.Label>Gestionnaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="manager"
                    value={formData.manager}
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer OPG
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit OPG Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Modifier OPG</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editName">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editCode">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" name="code" value={formData.code} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="editLocation">
                  <Form.Label>Lieu</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="editManager">
                  <Form.Label>Gestionnaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editContactPhone">
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
                <Form.Group controlId="editContactEmail">
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
                <Form.Group controlId="editStatus">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer les modifications
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View OPG Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'OPG</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOPG && (
            <div>
              <h5 className="mb-3">{selectedOPG.name}</h5>
              <p>
                <strong>Code:</strong> {selectedOPG.code}
              </p>
              <p>
                <strong>Lieu:</strong> {selectedOPG.location}
              </p>
              <p>
                <strong>Gestionnaire:</strong> {selectedOPG.manager}
              </p>
              <p>
                <strong>Téléphone:</strong> {selectedOPG.contactPhone}
              </p>
              <p>
                <strong>Email:</strong> {selectedOPG.contactEmail}
              </p>
              <p>
                <strong>Statut:</strong>{" "}
                {selectedOPG.status === "active" ? (
                  <Badge bg="success">Actif</Badge>
                ) : (
                  <Badge bg="danger">Inactif</Badge>
                )}
              </p>
              <p>
                <strong>Date de création:</strong> {new Date(selectedOPG.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOPG && (
            <>
              <p>
                Êtes-vous sûr de vouloir supprimer l'OPG <strong>{selectedOPG.name}</strong> ?
              </p>
              <Alert variant="warning">Cette action est irréversible.</Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default OPGManagement
