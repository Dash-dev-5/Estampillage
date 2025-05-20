"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Alert,
  InputGroup,
  Badge,
  Spinner,
  Dropdown,
} from "react-bootstrap"
import {
  FileEarmarkRuled,
  Search,
  Plus,
  Printer,
  Eye,
  ThreeDots,
  CheckCircle,
  XCircle,
  ExclamationTriangle,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { toast } from "react-toastify"
import { isAdmin, isDG } from "../utils/permissions"

// Simulated data for value prints
const initialValuePrints = [
  {
    id: 1,
    valueNumber: "VN-00001",
    status: "used",
    createdAt: "2023-01-10T08:30:00Z",
    createdBy: 1,
    usedAt: "2023-01-15T10:45:00Z",
    usedBy: 2,
    perceptionId: 2,
  },
  {
    id: 2,
    valueNumber: "VN-00002",
    status: "used",
    createdAt: "2023-01-10T08:31:00Z",
    createdBy: 1,
    usedAt: "2023-02-22T14:20:00Z",
    usedBy: 3,
    perceptionId: 5,
  },
  {
    id: 3,
    valueNumber: "VN-00003",
    status: "available",
    createdAt: "2023-01-10T08:32:00Z",
    createdBy: 1,
    usedAt: null,
    usedBy: null,
    perceptionId: null,
  },
  {
    id: 4,
    valueNumber: "VN-00004",
    status: "available",
    createdAt: "2023-01-10T08:33:00Z",
    createdBy: 1,
    usedAt: null,
    usedBy: null,
    perceptionId: null,
  },
  {
    id: 5,
    valueNumber: "VN-00005",
    status: "used",
    createdAt: "2023-01-10T08:34:00Z",
    createdBy: 1,
    usedAt: "2023-03-05T09:15:00Z",
    usedBy: 2,
    perceptionId: 8,
  },
  {
    id: 6,
    valueNumber: "VN-00006",
    status: "available",
    createdAt: "2023-02-15T10:30:00Z",
    createdBy: 3,
    usedAt: null,
    usedBy: null,
    perceptionId: null,
  },
  {
    id: 7,
    valueNumber: "VN-00007",
    status: "available",
    createdAt: "2023-02-15T10:31:00Z",
    createdBy: 3,
    usedAt: null,
    usedBy: null,
    perceptionId: null,
  },
]

const ValuePrintManagement = () => {
  const { user } = useSelector((state) => state.auth)

  // State
  const [valuePrints, setValuePrints] = useState([])
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedValuePrint, setSelectedValuePrint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [startNumber, setStartNumber] = useState("")

  useEffect(() => {
    // Filter value prints based on user role
    if (isAdmin(user) || isDG(user)) {
      // Admins and DG can see all value prints
      setValuePrints(initialValuePrints)
    } else {
      // OPGs can only see their own value prints
      const filteredValuePrints = initialValuePrints.filter((vp) => vp.createdBy === user.id || vp.usedBy === user.id)
      setValuePrints(filteredValuePrints)
    }
  }, [user])

  const handleViewModalOpen = (valuePrint) => {
    setSelectedValuePrint(valuePrint)
    setShowViewModal(true)
  }

  const handleCreateValuePrints = () => {
    setLoading(true)

    setTimeout(() => {
      // Validate inputs
      if (!startNumber) {
        toast.error("Veuillez entrer un numéro de départ.")
        setLoading(false)
        return
      }

      // Generate new value prints
      const newValuePrints = []
      const lastId = valuePrints.length > 0 ? Math.max(...valuePrints.map((vp) => vp.id)) : 0

      for (let i = 0; i < quantity; i++) {
        const newId = lastId + i + 1
        const newValueNumber = `VN-${(Number.parseInt(startNumber) + i).toString().padStart(5, "0")}`

        newValuePrints.push({
          id: newId,
          valueNumber: newValueNumber,
          status: "available",
          createdAt: new Date().toISOString(),
          createdBy: user.id,
          usedAt: null,
          usedBy: null,
          perceptionId: null,
        })
      }

      setValuePrints([...valuePrints, ...newValuePrints])
      setShowCreateModal(false)
      setLoading(false)
      setQuantity(1)
      setStartNumber("")

      toast.success(
        `${quantity} imprimé${quantity > 1 ? "s" : ""} de valeur créé${quantity > 1 ? "s" : ""} avec succès.`,
      )
    }, 1000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <Badge bg="success" className="d-flex align-items-center mac-badge">
            <CheckCircle className="me-1" /> Disponible
          </Badge>
        )
      case "used":
        return (
          <Badge bg="secondary" className="d-flex align-items-center mac-badge">
            <XCircle className="me-1" /> Utilisé
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

  const filteredValuePrints = valuePrints.filter((valuePrint) => {
    const matchesFilter =
      valuePrint.valueNumber.toLowerCase().includes(filter.toLowerCase()) || valuePrint.id.toString().includes(filter)

    const matchesStatus = !statusFilter || valuePrint.status === statusFilter

    return matchesFilter && matchesStatus
  })

  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Gestion des Imprimés de Valeur"
          subtitle="Créez et gérez les imprimés de valeur pour les notes de perception"
          icon={<FileEarmarkRuled className="me-2" size={24} />}
        />

        <Card className="shadow-sm border-0 mb-4 glass-card scale-in">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par ID ou numéro de valeur..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="glass-input border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-input"
                >
                  <option value="">Tous les statuts</option>
                  <option value="available">Disponible</option>
                  <option value="used">Utilisé</option>
                </Form.Select>
              </Col>
              <Col lg={5} className="ms-auto text-end">
                <Button variant="outline-secondary" className="me-2 hover-lift mac-btn">
                  <Printer className="me-1" /> Imprimer la liste
                </Button>
                <Button
                  variant="primary"
                  className="hover-lift mac-btn mac-btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="me-1" /> Créer des imprimés
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 glass-card dashboard-card slide-in">
              <Card.Body className="p-4">
                <h3 className="mb-0">{valuePrints.filter((vp) => vp.status === "available").length}</h3>
                <p className="text-muted mb-0">Imprimés disponibles</p>
                <div className="icon-bg">
                  <CheckCircle />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 glass-card dashboard-card slide-in">
              <Card.Body className="p-4">
                <h3 className="mb-0">{valuePrints.filter((vp) => vp.status === "used").length}</h3>
                <p className="text-muted mb-0">Imprimés utilisés</p>
                <div className="icon-bg">
                  <XCircle />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 glass-card dashboard-card slide-in">
              <Card.Body className="p-4">
                <h3 className="mb-0">{valuePrints.length}</h3>
                <p className="text-muted mb-0">Total des imprimés</p>
                <div className="icon-bg">
                  <FileEarmarkRuled />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 glass-card dashboard-card slide-in">
              <Card.Body className="p-4">
                <h3 className="mb-0">
                  {Math.round((valuePrints.filter((vp) => vp.status === "used").length / valuePrints.length) * 100) ||
                    0}
                  %
                </h3>
                <p className="text-muted mb-0">Taux d'utilisation</p>
                <div className="icon-bg">
                  <Printer />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm border-0 glass-card slide-in">
          <div className="table-responsive">
            <Table hover className="mb-0 mac-table">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Numéro de Valeur</th>
                  <th>Status</th>
                  <th>Créé le</th>
                  <th>Créé par</th>
                  <th>Utilisé le</th>
                  <th>Utilisé par</th>
                  <th>Note de Perception</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredValuePrints.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Aucun imprimé de valeur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredValuePrints.map((valuePrint) => (
                    <tr key={valuePrint.id} className="align-middle hover-lift">
                      <td>#{valuePrint.id}</td>
                      <td>
                        <span className="value-print-number">{valuePrint.valueNumber}</span>
                      </td>
                      <td>{getStatusBadge(valuePrint.status)}</td>
                      <td>{new Date(valuePrint.createdAt).toLocaleDateString()}</td>
                      <td>Utilisateur #{valuePrint.createdBy}</td>
                      <td>{valuePrint.usedAt ? new Date(valuePrint.usedAt).toLocaleDateString() : "-"}</td>
                      <td>{valuePrint.usedBy ? `Utilisateur #${valuePrint.usedBy}` : "-"}</td>
                      <td>{valuePrint.perceptionId ? `#${valuePrint.perceptionId}` : "-"}</td>
                      <td>
                        <Dropdown align="end">
                          <Dropdown.Toggle as={Button} variant="light" size="sm" className="border-0 mac-btn-sm">
                            <ThreeDots />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleViewModalOpen(valuePrint)}>
                              <Eye className="me-2" /> Voir les détails
                            </Dropdown.Item>
                            {valuePrint.status === "available" && (
                              <Dropdown.Item>
                                <Printer className="me-2" /> Imprimer
                              </Dropdown.Item>
                            )}
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

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} backdrop="static" className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Créer des Imprimés de Valeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Quantité</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)))}
              className="glass-input"
            />
            <Form.Text className="text-muted">Nombre d'imprimés de valeur à créer (maximum 100 à la fois).</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Numéro de départ</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Ex: 1"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              className="glass-input"
            />
            <Form.Text className="text-muted">
              Le numéro à partir duquel les imprimés seront générés (VN-00001, VN-00002, etc.).
            </Form.Text>
          </Form.Group>

          <Alert variant="info" className="d-flex align-items-center glass-alert">
            <ExclamationTriangle className="me-2" />
            <div>
              Les imprimés de valeur seront générés avec des numéros séquentiels à partir du numéro de départ spécifié.
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="mac-btn">
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateValuePrints}
            disabled={loading || !startNumber}
            className="d-flex align-items-center mac-btn mac-btn-primary"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Création...
              </>
            ) : (
              <>
                <Plus className="me-2" /> Créer
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'Imprimé de Valeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedValuePrint && (
            <>
              <div className="text-center mb-4">
                <h2 className="value-print-number">{selectedValuePrint.valueNumber}</h2>
                <div>{getStatusBadge(selectedValuePrint.status)}</div>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">ID</p>
                  <h5>#{selectedValuePrint.id}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Date de Création</p>
                  <h5>{new Date(selectedValuePrint.createdAt).toLocaleString()}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Créé par</p>
                  <h5>Utilisateur #{selectedValuePrint.createdBy}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Status</p>
                  <h5>{getStatusBadge(selectedValuePrint.status)}</h5>
                </Col>
              </Row>

              {selectedValuePrint.status === "used" && (
                <>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-1 text-muted">Utilisé le</p>
                      <h5>{new Date(selectedValuePrint.usedAt).toLocaleString()}</h5>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1 text-muted">Utilisé par</p>
                      <h5>Utilisateur #{selectedValuePrint.usedBy}</h5>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <p className="mb-1 text-muted">Note de Perception</p>
                      <h5>#{selectedValuePrint.perceptionId}</h5>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)} className="mac-btn">
            Fermer
          </Button>
          {selectedValuePrint && selectedValuePrint.status === "available" && (
            <Button variant="primary" className="mac-btn mac-btn-primary">
              <Printer className="me-1" /> Imprimer
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </MainLayout>
  )
}

export default ValuePrintManagement
