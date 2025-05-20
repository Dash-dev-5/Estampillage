"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, Badge, Row, Col, Form, Button, Table, Modal, Alert, InputGroup, Nav, Spinner } from "react-bootstrap"
import {
  Receipt,
  CheckCircle,
  XCircle,
  Calendar3,
  Search,
  Filter,
  Printer,
  Eye,
  FileEarmarkPdf,
  Download,
  ExclamationTriangle,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchDeclarations } from "../redux/actions/declarationActions"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { toast } from "react-toastify"
import { isAdmin, isDG } from "../utils/permissions"

// Simulated data for notes de perception
const simulatedPerceptions = [
  {
    id: 1,
    declarationId: 1,
    subjectName: "Entreprise XYZ",
    valueNumber: "",
    amount: 50000,
    status: "pending",
    createdBy: 2,
    createdAt: "2023-01-16T09:45:00Z",
    printed: false,
    opgId: 2,
  },
  {
    id: 2,
    declarationId: 2,
    subjectName: "Compagnie ABC",
    valueNumber: "VN-00002",
    amount: 125000,
    status: "validated",
    createdBy: 3,
    createdAt: "2023-02-22T10:30:00Z",
    printed: true,
    opgId: 3,
  },
  {
    id: 3,
    declarationId: 3,
    subjectName: "Société DEF",
    valueNumber: "VN-00005",
    amount: 40000,
    status: "rejected",
    createdBy: 2,
    createdAt: "2023-03-07T14:15:00Z",
    printed: false,
    opgId: 2,
  },
]

// Simulated data for value prints
const simulatedValuePrints = [
  {
    id: 1,
    valueNumber: "VN-00001",
    status: "available",
  },
  {
    id: 3,
    valueNumber: "VN-00003",
    status: "available",
  },
  {
    id: 4,
    valueNumber: "VN-00004",
    status: "available",
  },
]

const NotePerception = () => {
  const dispatch = useDispatch()
  const { declarations } = useSelector((state) => state.declaration)
  const { user } = useSelector((state) => state.auth)

  // State
  const [perceptions, setPerceptions] = useState([])
  const [valuePrints, setValuePrints] = useState(simulatedValuePrints)
  const [selectedPerception, setSelectedPerception] = useState(null)
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedValuePrint, setSelectedValuePrint] = useState(null)
  const [showValidateModal, setShowValidateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchDeclarations())

    // Filter perceptions based on user role
    if (isAdmin(user) || isDG(user)) {
      // Admins and DG can see all perceptions
      setPerceptions(simulatedPerceptions)
    } else {
      // OPGs can only see their own perceptions
      const filteredPerceptions = simulatedPerceptions.filter((p) => p.opgId === user.id)
      setPerceptions(filteredPerceptions)
    }
  }, [dispatch, user])

  const handleViewModalOpen = (perception) => {
    setSelectedPerception(perception)
    setShowViewModal(true)
  }

  const handleValidateModalOpen = (perception) => {
    setSelectedPerception(perception)
    setSelectedValuePrint(null)
    setShowValidateModal(true)
  }

  const handlePrintModalOpen = (perception) => {
    setSelectedPerception(perception)
    setShowPrintModal(true)
  }

  const validatePerception = () => {
    // Validate value number (simulate API call)
    setLoading(true)

    setTimeout(() => {
      if (!selectedValuePrint) {
        toast.error("Veuillez sélectionner un imprimé de valeur.")
        setLoading(false)
        return
      }

      // Update perception with selected value print
      const updatedPerceptions = perceptions.map((p) =>
        p.id === selectedPerception.id
          ? {
              ...p,
              status: "validated",
              valueNumber: selectedValuePrint.valueNumber,
              printed: false,
            }
          : p,
      )

      // Remove the used value print from available ones
      const updatedValuePrints = valuePrints.filter((vp) => vp.id !== selectedValuePrint.id)

      setPerceptions(updatedPerceptions)
      setValuePrints(updatedValuePrints)
      setShowValidateModal(false)
      setLoading(false)

      // Automatically open print modal after validation
      const updatedPerception = updatedPerceptions.find((p) => p.id === selectedPerception.id)
      setSelectedPerception(updatedPerception)
      setShowPrintModal(true)

      toast.success("La note de perception a été validée avec succès.")
    }, 1000)
  }

  const printPerception = () => {
    // Simulate printing process
    setLoading(true)

    setTimeout(() => {
      generatePDF(selectedPerception)

      const updatedPerceptions = perceptions.map((p) => (p.id === selectedPerception.id ? { ...p, printed: true } : p))

      setPerceptions(updatedPerceptions)
      setShowPrintModal(false)
      setLoading(false)
      toast.success("La note de perception a été imprimée avec succès.")
    }, 1000)
  }

  const filteredPerceptions = perceptions.filter((perception) => {
    const matchesFilter =
      perception.subjectName.toLowerCase().includes(filter.toLowerCase()) ||
      perception.id.toString().includes(filter) ||
      (perception.valueNumber && perception.valueNumber.toLowerCase().includes(filter.toLowerCase()))

    const matchesStatus = !statusFilter || perception.status === statusFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && perception.status === "pending") ||
      (activeTab === "validated" && perception.status === "validated") ||
      (activeTab === "rejected" && perception.status === "rejected")

    return matchesFilter && matchesStatus && matchesTab
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning" className="d-flex align-items-center mac-badge">
            <Calendar3 className="me-1" /> En attente
          </Badge>
        )
      case "validated":
        return (
          <Badge bg="success" className="d-flex align-items-center mac-badge">
            <CheckCircle className="me-1" /> Validé
          </Badge>
        )
      case "rejected":
        return (
          <Badge bg="danger" className="d-flex align-items-center mac-badge">
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

  const generatePDF = (perception) => {
    const doc = new jsPDF()

    // Add unique number in top right corner
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("#" + perception.id.toString().padStart(3, "0"), 195, 10, { align: "right" })

    // Add title
    doc.setFontSize(18)
    doc.text("Note de Perception", 105, 15, { align: "center" })

    // Add info
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Numéro de note: " + perception.id, 14, 30)
    doc.text("Date: " + new Date(perception.createdAt).toLocaleDateString(), 14, 37)
    doc.text("Assujetti: " + perception.subjectName, 14, 44)
    doc.text("Numéro de valeur: " + perception.valueNumber, 14, 51)
    doc.text("Déclaration associée: #" + perception.declarationId, 14, 58)

    // Add table
    doc.autoTable({
      startY: 65,
      head: [["Description", "Montant"]],
      body: [["Montant à percevoir", perception.amount.toLocaleString() + " FC"]],
      theme: "grid",
    })

    // Add signature area
    const finalY = doc.lastAutoTable.finalY
    doc.line(14, finalY + 30, 80, finalY + 30)
    doc.text("Signature OPG", 14, finalY + 35)

    doc.line(120, finalY + 30, 196, finalY + 30)
    doc.text("Signature Assujetti", 120, finalY + 35)

    // Add footer
    doc.setFontSize(10)
    doc.text(import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE", 105, 280, { align: "center" })

    // Save the PDF
    doc.save("note-perception-" + perception.id + ".pdf")
  }

  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Notes de Perception"
          subtitle="Validez et imprimez les notes de perception"
          icon={<Receipt className="me-2" size={24} />}
        />

        <Card className="shadow-sm border-0 mb-4 glass-card scale-in">
          <Card.Body>
            <Nav variant="tabs" className="mb-3 mac-tabs">
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "pending"}
                  onClick={() => setActiveTab("pending")}
                  className="d-flex align-items-center"
                >
                  <Calendar3 className="me-1" /> En attente
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "validated"}
                  onClick={() => setActiveTab("validated")}
                  className="d-flex align-items-center"
                >
                  <CheckCircle className="me-1" /> Validées
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "rejected"}
                  onClick={() => setActiveTab("rejected")}
                  className="d-flex align-items-center"
                >
                  <XCircle className="me-1" /> Rejetées
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                  className="d-flex align-items-center"
                >
                  Toutes
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Row className="g-3 align-items-center">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par ID, nom ou numéro de valeur..."
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
                    <option value="validated">Validé</option>
                    <option value="rejected">Rejeté</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col lg={5} className="ms-auto text-end">
                <Button variant="outline-secondary" className="me-2 hover-lift mac-btn">
                  <Printer className="me-1" /> Imprimer la liste
                </Button>
                <Button variant="outline-primary" className="hover-lift mac-btn">
                  <Download className="me-1" /> Exporter
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0 glass-card slide-in">
          <div className="table-responsive">
            <Table hover className="mb-0 mac-table">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Déclaration</th>
                  <th>Assujetti</th>
                  <th>Numéro de Valeur</th>
                  <th>Montant</th>
                  <th>Status</th>
                  <th>Imprimé</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerceptions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Aucune note de perception trouvée
                    </td>
                  </tr>
                ) : (
                  filteredPerceptions.map((perception) => (
                    <tr key={perception.id} className="align-middle hover-lift">
                      <td>#{perception.id}</td>
                      <td>#{perception.declarationId}</td>
                      <td>{perception.subjectName}</td>
                      <td>{perception.valueNumber || "-"}</td>
                      <td>{perception.amount.toLocaleString()} FC</td>
                      <td>{getStatusBadge(perception.status)}</td>
                      <td>
                        {perception.printed ? (
                          <Badge bg="success" className="mac-badge">
                            Oui
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="mac-badge">
                            Non
                          </Badge>
                        )}
                      </td>
                      <td>{new Date(perception.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewModalOpen(perception)}
                            title="Voir"
                            className="mac-btn-sm"
                          >
                            <Eye />
                          </Button>
                          {perception.status === "pending" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleValidateModalOpen(perception)}
                              title="Valider"
                              className="mac-btn-sm"
                            >
                              <CheckCircle />
                            </Button>
                          )}
                          {perception.status === "validated" && !perception.printed && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handlePrintModalOpen(perception)}
                              title="Imprimer"
                              className="mac-btn-sm"
                            >
                              <Printer />
                            </Button>
                          )}
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => generatePDF(perception)}
                            title="Générer PDF"
                            className="mac-btn-sm"
                          >
                            <FileEarmarkPdf />
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

      {/* Validate Modal */}
      <Modal
        show={showValidateModal}
        onHide={() => setShowValidateModal(false)}
        backdrop="static"
        className="mac-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Valider la Note de Perception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerception && (
            <>
              <p>
                Vous êtes sur le point de valider la note de perception #{selectedPerception.id} pour{" "}
                <strong>{selectedPerception.subjectName}</strong>.
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Sélectionner un Imprimé de Valeur</Form.Label>
                <Form.Select
                  value={selectedValuePrint ? selectedValuePrint.id : ""}
                  onChange={(e) => {
                    const id = Number.parseInt(e.target.value)
                    const valuePrint = valuePrints.find((vp) => vp.id === id)
                    setSelectedValuePrint(valuePrint || null)
                  }}
                  required
                  className="glass-input"
                >
                  <option value="">Sélectionnez un imprimé de valeur</option>
                  {valuePrints.map((vp) => (
                    <option key={vp.id} value={vp.id}>
                      {vp.valueNumber}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Sélectionnez un imprimé de valeur disponible pour cette note de perception.
                </Form.Text>
              </Form.Group>

              {valuePrints.length === 0 && (
                <Alert variant="warning" className="d-flex align-items-center glass-alert">
                  <ExclamationTriangle className="me-2" />
                  <div>
                    Aucun imprimé de valeur disponible. Veuillez en créer dans la section "Gestion des Imprimés de
                    Valeur".
                  </div>
                </Alert>
              )}

              <Alert variant="info" className="d-flex align-items-center glass-alert">
                <ExclamationTriangle className="me-2" />
                <div>Une fois validée, la note de perception pourra être imprimée et ne pourra plus être modifiée.</div>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowValidateModal(false)} className="mac-btn">
            Annuler
          </Button>
          <Button
            variant="success"
            onClick={validatePerception}
            disabled={loading || !selectedValuePrint}
            className="d-flex align-items-center mac-btn mac-btn-primary"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Validation...
              </>
            ) : (
              <>
                <CheckCircle className="me-2" /> Valider
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Note de Perception #{selectedPerception?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerception && (
            <>
              <div className="text-end mb-3">
                <h2 className="value-print-number">#{selectedPerception.id.toString().padStart(3, "0")}</h2>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Status</p>
                  <h5>{getStatusBadge(selectedPerception.status)}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Date de Création</p>
                  <h5>{new Date(selectedPerception.createdAt).toLocaleString()}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Déclaration Associée</p>
                  <h5>#{selectedPerception.declarationId}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Assujetti</p>
                  <h5>{selectedPerception.subjectName}</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Numéro de Valeur</p>
                  <h5>{selectedPerception.valueNumber || "Non assigné"}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Montant</p>
                  <h5>{selectedPerception.amount.toLocaleString()} FC</h5>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-muted">Imprimé</p>
                  <h5>{selectedPerception.printed ? "Oui" : "Non"}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted">Créé par</p>
                  <h5>Utilisateur #{selectedPerception.createdBy}</h5>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)} className="mac-btn">
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={() => selectedPerception && generatePDF(selectedPerception)}
            className="mac-btn mac-btn-primary"
          >
            <FileEarmarkPdf className="me-1" /> Générer PDF
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Modal */}
      <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} backdrop="static" className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Imprimer la Note de Perception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerception && (
            <>
              <div className="text-end mb-3">
                <h2 className="value-print-number">#{selectedPerception.id.toString().padStart(3, "0")}</h2>
              </div>

              <p>
                Vous êtes sur le point d'imprimer la note de perception #{selectedPerception.id} pour{" "}
                <strong>{selectedPerception.subjectName}</strong>.
              </p>

              <div className="perception-preview p-4 mb-3 border rounded">
                <h4 className="text-center mb-3">Aperçu de la Note de Perception</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Numéro de note:</span>
                  <span>#{selectedPerception.id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Assujetti:</span>
                  <span>{selectedPerception.subjectName}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Numéro de valeur:</span>
                  <span>{selectedPerception.valueNumber}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Montant:</span>
                  <span>{selectedPerception.amount.toLocaleString()} FC</span>
                </div>
              </div>

              <Alert variant="info" className="d-flex align-items-center glass-alert">
                <ExclamationTriangle className="me-2" />
                <div>
                  Assurez-vous que l'imprimante est connectée et prête. Une fois imprimée, la note sera marquée comme
                  telle dans le système.
                </div>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrintModal(false)} className="mac-btn">
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={printPerception}
            disabled={loading}
            className="d-flex align-items-center mac-btn mac-btn-primary"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Impression...
              </>
            ) : (
              <>
                <Printer className="me-2" /> Imprimer
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  )
}

export default NotePerception
