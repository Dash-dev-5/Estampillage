"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Dropdown, Tab, Nav } from "react-bootstrap"
import { CalendarCheck, Plus, Eye, Check, X, Clock, Calendar, Person, Download } from "react-bootstrap-icons"
import { fetchLeaves, createLeave, updateLeave, deleteLeave } from "../../redux/actions/hrActions"
import SearchFilter from "../common/SearchFilter"
import ConfirmationModal from "../common/ConfirmationModal"
import { formatDate } from "../../utils/formatters"

const LeaveManagement = () => {
  const dispatch = useDispatch()
  const { leaves, loading, error } = useSelector((state) => state.hr)
  const { user } = useSelector((state) => state.auth)

  const [showModal, setShowModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState("")
  const [activeTab, setActiveTab] = useState("requests")

  const [formData, setFormData] = useState({
    employeeId: "",
    type: "annual",
    startDate: "",
    endDate: "",
    days: 0,
    reason: "",
    status: "pending",
  })

  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  const leaveTypes = [
    { value: "annual", label: "Congé Annuel", color: "primary" },
    { value: "sick", label: "Congé Maladie", color: "warning" },
    { value: "maternity", label: "Congé Maternité", color: "info" },
    { value: "paternity", label: "Congé Paternité", color: "info" },
    { value: "emergency", label: "Congé Exceptionnel", color: "danger" },
    { value: "unpaid", label: "Congé Sans Solde", color: "secondary" },
  ]

  const statusTypes = [
    { value: "pending", label: "En Attente", color: "warning" },
    { value: "approved", label: "Approuvé", color: "success" },
    { value: "rejected", label: "Rejeté", color: "danger" },
    { value: "cancelled", label: "Annulé", color: "secondary" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedLeave) {
      dispatch(updateLeave(selectedLeave.id, formData))
    } else {
      dispatch(createLeave(formData))
    }
    setShowModal(false)
    resetForm()
  }

  const handleAction = (leave, action) => {
    setSelectedLeave(leave)
    setActionType(action)
    setShowConfirmModal(true)
  }

  const confirmAction = () => {
    if (actionType === "approve") {
      dispatch(updateLeave(selectedLeave.id, { status: "approved" }))
    } else if (actionType === "reject") {
      dispatch(updateLeave(selectedLeave.id, { status: "rejected" }))
    } else if (actionType === "delete") {
      dispatch(deleteLeave(selectedLeave.id))
    }
    setShowConfirmModal(false)
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      type: "annual",
      startDate: "",
      endDate: "",
      days: 0,
      reason: "",
      status: "pending",
    })
    setSelectedLeave(null)
  }

  const calculateDays = (start, end) => {
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = Math.abs(endDate - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const filteredLeaves =
    leaves?.filter((leave) => {
      const matchesSearch =
        leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || leave.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  const leaveStats = {
    total: leaves?.length || 0,
    pending: leaves?.filter((l) => l.status === "pending").length || 0,
    approved: leaves?.filter((l) => l.status === "approved").length || 0,
    rejected: leaves?.filter((l) => l.status === "rejected").length || 0,
  }

  const getLeaveTypeInfo = (type) => {
    return leaveTypes.find((t) => t.value === type) || leaveTypes[0]
  }

  const getStatusInfo = (status) => {
    return statusTypes.find((s) => s.value === status) || statusTypes[0]
  }

  return (
    <div>
      {/* En-tête avec statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <CalendarCheck size={24} className="text-primary mb-2" />
              <h4 className="mb-1">{leaveStats.total}</h4>
              <small className="text-muted">Total Demandes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Clock size={24} className="text-warning mb-2" />
              <h4 className="mb-1">{leaveStats.pending}</h4>
              <small className="text-muted">En Attente</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Check size={24} className="text-success mb-2" />
              <h4 className="mb-1">{leaveStats.approved}</h4>
              <small className="text-muted">Approuvées</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <X size={24} className="text-danger mb-2" />
              <h4 className="mb-1">{leaveStats.rejected}</h4>
              <small className="text-muted">Rejetées</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation par onglets */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="pills" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="requests">
                  <CalendarCheck className="me-2" size={16} />
                  Demandes de Congés
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="calendar">
                  <Calendar className="me-2" size={16} />
                  Calendrier des Congés
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="balances">
                  <Person className="me-2" size={16} />
                  Soldes de Congés
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="requests">
                {/* Barre d'actions */}
                <Row className="mb-3">
                  <Col md={6}>
                    <SearchFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      placeholder="Rechercher par employé ou motif..."
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="all">Tous les statuts</option>
                      {statusTypes.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
                      <Plus className="me-2" size={16} />
                      Nouvelle Demande
                    </Button>
                    <Button variant="outline-secondary">
                      <Download className="me-2" size={16} />
                      Export
                    </Button>
                  </Col>
                </Row>

                {/* Tableau des demandes */}
                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Employé</th>
                      <th>Type</th>
                      <th>Période</th>
                      <th>Durée</th>
                      <th>Statut</th>
                      <th>Date Demande</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((leave) => {
                      const typeInfo = getLeaveTypeInfo(leave.type)
                      const statusInfo = getStatusInfo(leave.status)

                      return (
                        <tr key={leave.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                <Person size={16} />
                              </div>
                              <div>
                                <div className="fw-semibold">{leave.employee?.name}</div>
                                <small className="text-muted">{leave.employee?.department}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg={typeInfo.color} className="px-2 py-1">
                              {typeInfo.label}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              <div>
                                {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">{leave.days} jour(s)</span>
                          </td>
                          <td>
                            <Badge bg={statusInfo.color} className="px-2 py-1">
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td>{formatDate(leave.createdAt)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleAction(leave, "view")}>
                                  <Eye className="me-2" size={14} />
                                  Voir Détails
                                </Dropdown.Item>
                                {leave.status === "pending" && (
                                  <>
                                    <Dropdown.Item onClick={() => handleAction(leave, "approve")}>
                                      <Check className="me-2" size={14} />
                                      Approuver
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAction(leave, "reject")}>
                                      <X className="me-2" size={14} />
                                      Rejeter
                                    </Dropdown.Item>
                                  </>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => handleAction(leave, "delete")} className="text-danger">
                                  <X className="me-2" size={14} />
                                  Supprimer
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Tab.Pane>

              <Tab.Pane eventKey="calendar">
                <div className="text-center py-5">
                  <Calendar size={48} className="text-muted mb-3" />
                  <h5>Calendrier des Congés</h5>
                  <p className="text-muted">Vue calendrier en cours de développement</p>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="balances">
                <div className="text-center py-5">
                  <Person size={48} className="text-muted mb-3" />
                  <h5>Soldes de Congés</h5>
                  <p className="text-muted">Gestion des soldes en cours de développement</p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedLeave ? "Modifier la Demande" : "Nouvelle Demande de Congé"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de Congé</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employé</Form.Label>
                  <Form.Select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un employé</option>
                    {/* Liste des employés à charger */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de Début</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      const newFormData = { ...formData, startDate: e.target.value }
                      newFormData.days = calculateDays(e.target.value, formData.endDate)
                      setFormData(newFormData)
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      const newFormData = { ...formData, endDate: e.target.value }
                      newFormData.days = calculateDays(formData.startDate, e.target.value)
                      setFormData(newFormData)
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Jours</Form.Label>
                  <Form.Control type="number" value={formData.days} readOnly className="bg-light" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statusTypes.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Motif/Commentaire</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Motif de la demande de congé..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {selectedLeave ? "Modifier" : "Créer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de confirmation */}
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        title="Confirmer l'action"
        message={`Êtes-vous sûr de vouloir ${actionType === "approve" ? "approuver" : actionType === "reject" ? "rejeter" : "supprimer"} cette demande ?`}
        variant={actionType === "delete" ? "danger" : "primary"}
      />

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  )
}

export default LeaveManagement
