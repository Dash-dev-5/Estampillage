"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Badge, InputGroup } from "react-bootstrap"
import {
  PeopleFill,
  Search,
  Pencil,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  GeoAlt,
  Telephone,
  Building,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchSubjects, createSubject, updateSubject, deleteSubject } from "../redux/actions/subjectActions"

const SubjectManagement = () => {
  const dispatch = useDispatch()
  const { subjects, loading, error } = useSelector((state) => state.subject)

  // State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [filter, setFilter] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    sector: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    status: "active",
  })

  useEffect(() => {
    dispatch(fetchSubjects())
  }, [dispatch])

  const handleCreateModalOpen = () => {
    setFormData({
      name: "",
      taxId: "",
      sector: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      status: "active",
    })
    setShowCreateModal(true)
  }

  const handleEditModalOpen = (subject) => {
    setSelectedSubject(subject)
    setFormData({
      name: subject.name,
      taxId: subject.taxId,
      sector: subject.sector,
      contactName: subject.contactName,
      contactPhone: subject.contactPhone,
      contactEmail: subject.contactEmail,
      address: subject.address,
      status: subject.status,
    })
    setShowEditModal(true)
  }

  const handleViewModalOpen = (subject) => {
    setSelectedSubject(subject)
    setShowViewModal(true)
  }

  const handleDeleteModalOpen = (subject) => {
    setSelectedSubject(subject)
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
      dispatch(createSubject(formData))
      setShowCreateModal(false)
    } else if (showEditModal) {
      dispatch(updateSubject(selectedSubject.id, formData))
      setShowEditModal(false)
    }
  }

  const handleDelete = () => {
    dispatch(deleteSubject(selectedSubject.id))
    setShowDeleteModal(false)
  }

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(filter.toLowerCase()) ||
      subject.taxId.toLowerCase().includes(filter.toLowerCase()) ||
      subject.sector.toLowerCase().includes(filter.toLowerCase()) ||
      subject.contactName.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Gestion des Assujettis"
          subtitle="Gérez les entreprises assujetties à l'estampillage"
          icon={<PeopleFill className="me-2" size={24} />}
          actionButton
          actionText="Nouvel Assujetti"
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
                    placeholder="Rechercher par nom, ID fiscal, secteur ou contact..."
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
                  <th>ID Fiscal</th>
                  <th>Nom</th>
                  <th>Secteur</th>
                  <th>Contact</th>
                  <th>Adresse</th>
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
                        <span>Chargement des assujettis...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Aucun assujetti trouvé
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="align-middle hover-lift">
                      <td>{subject.taxId}</td>
                      <td>{subject.name}</td>
                      <td>{subject.sector}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <small>{subject.contactName}</small>
                          <small>
                            <Telephone className="me-1" /> {subject.contactPhone}
                          </small>
                        </div>
                      </td>
                      <td>
                        <small>{subject.address}</small>
                      </td>
                      <td>
                        {subject.status === "active" ? (
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
                            onClick={() => handleViewModalOpen(subject)}
                            title="Voir"
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEditModalOpen(subject)}
                            title="Modifier"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteModalOpen(subject)}
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

      {/* Create Subject Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nouvel Assujetti</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer Assujetti
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifier Assujetti</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editName">
                  <Form.Label>Nom de l'entreprise</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editTaxId">
                  <Form.Label>ID Fiscal</Form.Label>
                  <Form.Control type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editSector">
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
                <Form.Group controlId="editStatus">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="editAddress">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <hr />
                <h6>Informations de contact</h6>
              </Col>
              <Col md={12}>
                <Form.Group controlId="editContactName">
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

      {/* View Subject Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'Assujetti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubject && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="mb-3">{selectedSubject.name}</h5>
                  <p className="mb-2">
                    <strong>ID Fiscal:</strong> {selectedSubject.taxId}
                  </p>
                  <p className="mb-2">
                    <strong>Secteur:</strong> {selectedSubject.sector}
                  </p>
                  <p className="mb-2">
                    <strong>Statut:</strong>{" "}
                    {selectedSubject.status === "active" ? (
                      <Badge bg="success">Actif</Badge>
                    ) : (
                      <Badge bg="danger">Inactif</Badge>
                    )}
                  </p>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="mb-2">
                      <GeoAlt className="me-2" /> Adresse
                    </h6>
                    <p>{selectedSubject.address}</p>
                  </div>
                  <div>
                    <h6 className="mb-2">
                      <Building className="me-2" /> Date de création
                    </h6>
                    <p>{new Date(selectedSubject.createdAt).toLocaleDateString()}</p>
                  </div>
                </Col>
              </Row>

              <hr />

              <h6 className="mb-3">Informations de contact</h6>
              <Row>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Nom:</strong> {selectedSubject.contactName}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Téléphone:</strong> {selectedSubject.contactPhone}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedSubject.contactEmail}
                  </p>
                </Col>
              </Row>
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
          {selectedSubject && (
            <>
              <p>
                Êtes-vous sûr de vouloir supprimer l'assujetti <strong>{selectedSubject.name}</strong> ?
              </p>
              <Alert variant="warning">
                Cette action est irréversible. Toutes les déclarations et notes de perception associées à cet assujetti
                seront également affectées.
              </Alert>
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
    </MainLayout>
  )
}

export default SubjectManagement
