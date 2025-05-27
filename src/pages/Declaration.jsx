"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Form, Button, Table, Badge, Modal, Alert, Dropdown, InputGroup } from "react-bootstrap"
import {
  FileEarmarkText,
  Search,
  Filter,
  Printer,
  ThreeDots,
  Pencil,
  Trash,
  Eye,
  Check2Circle,
  XCircle,
  Clock,
  FileEarmarkPdf,
  Download,
  Plus,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import {
  fetchDeclarations,
  createDeclaration,
  updateDeclaration,
  deleteDeclaration,
} from "../redux/actions/declarationActions"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { canCreateDeclaration } from "../utils/permissions"
import { useNavigate } from "react-router-dom"

const Declaration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { declarations, loading, error } = useSelector((state) => state.declaration)
  const { user } = useSelector((state) => state.auth)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    subjectId: "",
    subjectName: "",
    quantityDeclared: "",
    bagsStamped: "",
    taxRate: "0.05",
    amountDue: "",
  })

  // Selected declaration
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)

  // Filter state
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Check permissions
  useEffect(() => {
    if (!canCreateDeclaration(user)) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  // Calculate amount due on change
  useEffect(() => {
    if (formData.quantityDeclared && formData.taxRate) {
      const amountDue = Number.parseFloat(formData.quantityDeclared) * Number.parseFloat(formData.taxRate)
      setFormData((prev) => ({ ...prev, amountDue }))
    }
  }, [formData.quantityDeclared, formData.taxRate])

  useEffect(() => {
    dispatch(fetchDeclarations())
  }, [dispatch])

  const handleCreateModalOpen = () => {
    setFormData({
      subjectId: "",
      subjectName: "",
      quantityDeclared: "",
      bagsStamped: "",
      taxRate: "0.05",
      amountDue: "",
    })
    setShowCreateModal(true)
  }

  const handleViewModalOpen = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowViewModal(true)
  }

  const handleEditModalOpen = (declaration) => {
    setSelectedDeclaration(declaration)
    setFormData({
      subjectId: declaration.subjectId,
      subjectName: declaration.subjectName,
      quantityDeclared: declaration.quantityDeclared,
      bagsStamped: declaration.bagsStamped,
      taxRate: declaration.taxRate,
      amountDue: declaration.amountDue,
    })
    setShowEditModal(true)
  }

  const handleDeleteModalOpen = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowDeleteModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (showCreateModal) {
      dispatch(createDeclaration(formData))
      setShowCreateModal(false)
    } else if (showEditModal) {
      dispatch(updateDeclaration(selectedDeclaration.id, formData))
      setShowEditModal(false)
    }
  }

  const handleDelete = () => {
    dispatch(deleteDeclaration(selectedDeclaration.id))
    setShowDeleteModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const filteredDeclarations = declarations.filter((declaration) => {
    const matchesFilter =
      declaration.subjectName.toLowerCase().includes(filter.toLowerCase()) || declaration.id.toString().includes(filter)

    const matchesStatus = !statusFilter || declaration.status === statusFilter

    return matchesFilter && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning" className="mac-badge">
            <Clock className="me-1" /> En attente
          </Badge>
        )
      case "approved":
        return (
          <Badge bg="success" className="mac-badge">
            <Check2Circle className="me-1" /> Approuvé
          </Badge>
        )
      case "rejected":
        return (
          <Badge bg="danger" className="mac-badge">
            <XCircle className="me-1" /> Rejeté
          </Badge>
        )
      default:
        return (
          <Badge bg="secondary" className="mac-badge">
            Inconnu
          </Badge>
        )
    }
  }

  const generatePDF = (declaration) => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Déclaration d'Estampillage", 105, 15, { align: "center" })

    // Add info
    doc.setFontSize(12)
    doc.text("Numéro de déclaration: " + declaration.id, 14, 30)
    doc.text("Date: " + new Date(declaration.createdAt).toLocaleDateString(), 14, 37)
    doc.text("Assujetti: " + declaration.subjectName, 14, 44)
    doc.text("Status: " + declaration.status, 14, 51)

    // Add table
    doc.autoTable({
      startY: 60,
      head: [["Description", "Quantité", "Sacs", "Taux", "Montant"]],
      body: [
        [
          "Déclaration d'estampillage",
          declaration.quantityDeclared,
          declaration.bagsStamped,
          declaration.taxRate * 100 + "%",
          declaration.amountDue.toLocaleString() + " FC",
        ],
      ],
      theme: "grid",
    })

    // Add totals
    const finalY = doc.lastAutoTable.finalY
    doc.text("Montant Total: " + declaration.amountDue.toLocaleString() + " FC", 130, finalY + 10)

    // Add footer
    doc.setFontSize(10)
    doc.text(import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE", 105, 280, { align: "center" })

    // Save the PDF
    doc.save("declaration-" + declaration.id + ".pdf")
  }

  return (
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Gestion des Déclarations"
          subtitle="Créez et gérez les déclarations d'estampillage"
          icon={<FileEarmarkText className="me-2" size={24} />}
          actionButton
          actionText="Nouvelle Déclaration"
          actionOnClick={handleCreateModalOpen}
        />

        {error && (
          <Alert variant="danger" className="animate__animated animate__fadeIn glass-alert metric-card">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm border-0 mb-4 glass-card scale-in metric-card">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par ID ou nom d'assujetti..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="glass-input border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={3}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0">
                    <Filter />
                  </InputGroup.Text>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="glass-input border-start-0"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Rejeté</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col lg={5} className="ms-auto text-end">
                <Button variant="outline-secondary" className="me-2 hover-lift mac-btn">
                  <Printer className="me-1" /> Imprimer
                </Button>
                <Button variant="outline-primary" className="hover-lift mac-btn">
                  <Download className="me-1" /> Exporter
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0 glass-card slide-in metric-card">
          <div className="table-responsive">
            <Table hover className="mb-0 mac-table chart-container">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Assujetti</th>
                  <th>Quantité</th>
                  <th>Sacs</th>
                  <th>Montant</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement des déclarations...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDeclarations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Aucune déclaration trouvée
                    </td>
                  </tr>
                ) : (
                  filteredDeclarations.map((declaration) => (
                    <tr key={declaration.id} className="align-middle hover-lift">
                      <td>#{declaration.id}</td>
                      <td>{declaration.subjectName}</td>
                      <td>{declaration.quantityDeclared}</td>
                      <td>{declaration.bagsStamped}</td>
                      <td>{declaration.amountDue.toLocaleString()} FC</td>
                      <td>{getStatusBadge(declaration.status)}</td>
                      <td>{new Date(declaration.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Dropdown align="end">
                          <Dropdown.Toggle as={Button} variant="light" size="sm" className="border-0 mac-btn-sm">
                            <ThreeDots />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleViewModalOpen(declaration)}>
                              <Eye className="me-2" /> Voir
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleEditModalOpen(declaration)}>
                              <Pencil className="me-2" /> Modifier
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => generatePDF(declaration)}>
                              <FileEarmarkPdf className="me-2" /> Générer PDF
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => handleDeleteModalOpen(declaration)} className="text-danger">
                              <Trash className="me-2" /> Supprimer
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Create Declaration Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        backdrop="static"
        size="lg"
        className="mac-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Déclaration</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="subjectId">
                  <Form.Label>ID Assujetti</Form.Label>
                  <Form.Control
                    type="text"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  />
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
                    className="glass-input"
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
                    className="glass-input"
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
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="taxRate">
                  <Form.Label>Taux d'Imposition</Form.Label>
                  <Form.Select
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  >
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
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="mac-btn">
              Annuler
            </Button>
            <Button variant="primary" type="submit" className="mac-btn mac-btn-primary">
              <Plus className="me-2" /> Créer Déclaration
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Declaration Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Déclaration #{selectedDeclaration?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDeclaration && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Status</p>
                  <h5>{getStatusBadge(selectedDeclaration.status)}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Date de Création</p>
                  <h5>{new Date(selectedDeclaration.createdAt).toLocaleString()}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">ID Assujetti</p>
                  <h5>{selectedDeclaration.subjectId}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Nom Assujetti</p>
                  <h5>{selectedDeclaration.subjectName}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Quantité Déclarée</p>
                  <h5>{selectedDeclaration.quantityDeclared}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Nombre de Sacs Estampillés</p>
                  <h5>{selectedDeclaration.bagsStamped}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Taux d'Imposition</p>
                  <h5>{selectedDeclaration.taxRate * 100}%</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Montant Dû</p>
                  <h5>{selectedDeclaration.amountDue.toLocaleString()} FC</h5>
                </Col>
              </Row>

              <hr />

              <p className="mb-1 text-muted">Créé par</p>
              <h5>Utilisateur #{selectedDeclaration.createdBy}</h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)} className="mac-btn">
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={() => selectedDeclaration && generatePDF(selectedDeclaration)}
            className="mac-btn mac-btn-primary"
          >
            <FileEarmarkPdf className="me-1" /> Générer PDF
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Declaration Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop="static"
        size="lg"
        className="mac-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier Déclaration #{selectedDeclaration?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editSubjectId">
                  <Form.Label>ID Assujetti</Form.Label>
                  <Form.Control
                    type="text"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editSubjectName">
                  <Form.Label>Nom Assujetti</Form.Label>
                  <Form.Control
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editQuantityDeclared">
                  <Form.Label>Quantité Déclarée</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantityDeclared"
                    value={formData.quantityDeclared}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editBagsStamped">
                  <Form.Label>Nombre de Sacs Estampillés</Form.Label>
                  <Form.Control
                    type="number"
                    name="bagsStamped"
                    value={formData.bagsStamped}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editTaxRate">
                  <Form.Label>Taux d'Imposition</Form.Label>
                  <Form.Select
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    required
                    className="glass-input"
                  >
                    <option value="0.05">5%</option>
                    <option value="0.08">8%</option>
                    <option value="0.10">10%</option>
                    <option value="0.15">15%</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAmountDue">
                  <Form.Label>Montant Dû</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${formData.amountDue ? formData.amountDue.toLocaleString() : 0} FC`}
                    readOnly
                    className="glass-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} className="mac-btn">
              Annuler
            </Button>
            <Button variant="primary" type="submit" className="mac-btn mac-btn-primary">
              <Pencil className="me-2" /> Enregistrer les Modifications
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer la déclaration #{selectedDeclaration?.id} pour{" "}
          {selectedDeclaration?.subjectName} ?
          <Alert variant="warning" className="mt-3 glass-alert">
            Cette action est irréversible.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="mac-btn">
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} className="mac-btn">
            <Trash className="me-2" /> Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Declaration
