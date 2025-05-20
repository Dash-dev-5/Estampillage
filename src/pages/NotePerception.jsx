"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Card,
  Badge,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Alert,
  InputGroup,
  Nav,
  Spinner,
} from "react-bootstrap"
import {
  Receipt,
  CheckCircle,
  XCircle,
  Calendar3,
  Search,
  Filter,
  Printer,
  ThreeDots,
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

// Simulated data for notes de perception
const simulatedPerceptions = [
  {
    id: 1,
    declarationId: 1,
    subjectName: "Entreprise XYZ",
    valueNumber: "VN-00123",
    amount: 50000,
    status: "pending",
    createdBy: 2,
    createdAt: "2023-01-16T09:45:00Z",
    printed: false,
  },
  {
    id: 2,
    declarationId: 2,
    subjectName: "Compagnie ABC",
    valueNumber: "VN-00124",
    amount: 125000,
    status: "validated",
    createdBy: 3,
    createdAt: "2023-02-22T10:30:00Z",
    printed: true,
  },
  {
    id: 3,
    declarationId: 3,
    subjectName: "Société DEF",
    valueNumber: "VN-00125",
    amount: 40000,
    status: "rejected",
    createdBy: 2,
    createdAt: "2023-03-07T14:15:00Z",
    printed: false,
  },
]

const NotePerception = () => {
  const dispatch = useDispatch()
  const { declarations } = useSelector((state) => state.declaration)
  const { user } = useSelector((state) => state.auth)

  // State
  const [perceptions, setPerceptions] = useState(simulatedPerceptions)
  const [selectedPerception, setSelectedPerception] = useState(null)
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [valueNumber, setValueNumber] = useState("")
  const [showValidateModal, setShowValidateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchDeclarations())
  }, [dispatch])

  const handleViewModalOpen = (perception) => {
    setSelectedPerception(perception)
    setShowViewModal(true)
  }

  const handleValidateModalOpen = (perception) => {
    setSelectedPerception(perception)
    setValueNumber("")
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
      if (valueNumber === "invalid") {
        alert("Numéro de valeur déjà utilisé ou invalide.")
        setLoading(false)
        return
      }

      const updatedPerceptions = perceptions.map((p) =>
        p.id === selectedPerception.id ? { ...p, status: "validated", valueNumber, printed: false } : p,
      )

      setPerceptions(updatedPerceptions)
      setShowValidateModal(false)
      setLoading(false)
    }, 1000)
  }

  const printPerception = () => {
    // Simulate printing process
    setLoading(true)

    setTimeout(() => {
      generatePDF(selectedPerception)

      const updatedPerceptions = perceptions.map((p) =>
        p.id === selectedPerception.id ? { ...p, printed: true } : p,
      )

      setPerceptions(updatedPerceptions)
      setShowPrintModal(false)
      setLoading(false)
    }, 1000)
  }

  const filteredPerceptions = perceptions.filter((perception) => {
    const matchesFilter =
      perception.subjectName.toLowerCase().includes(filter.toLowerCase()) ||
      perception.id.toString().includes(filter) ||
      perception.valueNumber.toLowerCase().includes(filter.toLowerCase())

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
          <Badge bg="warning" className="d-flex align-items-center">
            <Calendar3 className="me-1" /> En attente
          </Badge>
        )
      case "validated":
        return (
          <Badge bg="success" className="d-flex align-items-center">
            <CheckCircle className="me-1" /> Validé
          </Badge>
        )
      case "rejected":
        return (
          <Badge bg="danger" className="d-flex align-items-center">
            <XCircle className="me-1" /> Rejeté
          </Badge>
        )
      default:
        return <Badge bg="secondary">Inconnu</Badge>
    }
  }

  const generatePDF = (perception) => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Note de Perception", 105, 15, { align: "center" })

    // Add info
    doc.setFontSize(12)
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
    doc.text(import.meta.env.REACT_APP_NAME || "ESTAMPILLAGE", 105, 280, { align: "center" })

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

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Nav variant="tabs" className="mb-3">
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
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par ID, nom ou numéro de valeur..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <Filter />
                  </InputGroup.Text>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="validated">Validé</option>
                    <option value="rejected">Rejeté</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col lg={5} className="ms-auto text-end">
                <Button variant="outline-secondary" className="me-2 hover-lift">
                  <Printer className="me-1" /> Imprimer la liste
                </Button>
                <Button variant="outline-primary" className="hover-lift">
                  <Download className="me-1" /> Exporter
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
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
                      <td>{perception.valueNumber}</td>
                      <td>{perception.amount.toLocaleString()} FC</td>
                      <td>{getStatusBadge(perception.status)}</td>
                      <td>
                        {perception.printed ? (
                          <Badge bg="success">Oui</Badge>
                        ) : (
                          <Badge bg="secondary">Non</Badge>
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
                          >
                            <Eye />
                          </Button>
                          {perception.status === "pending" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleValidateModalOpen(perception)}
                              title="Valider"
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
                            >
                              <Printer />
                            </Button>
                          )}
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => generatePDF(perception)}
                            title="Générer PDF"
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
      <Modal show={showValidateModal} onHide={() => setShowValidateModal(false)} backdrop="static">
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
                <Form.Label>Numéro d'Imprimé de Valeur</Form.Label>
                <Form.Control
                  type="text"
                  value={valueNumber}
                  onChange={(e) => setValueNumber(e.target.value)}
                  placeholder="Entrez le numéro d'imprimé de valeur"
                  required
                />
                <Form.Text className="text-muted">
                  Veuillez vérifier que ce numéro n'a pas déjà été utilisé.
                </Form.Text>
              </Form.Group>

              <Alert variant="info" className="d-flex align-items-center">
                <ExclamationTriangle className="me-2" />
                <div>
                  Une fois validée, la note de perception pourra être imprimée et ne pourra plus être modifiée.
                </div>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowValidateModal(false)}>
            Annuler
          </Button>
          <Button
            variant="success"
            onClick={validatePerception}
            disabled={loading || !valueNumber}
            className="d-flex align-items-center"
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
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Note de Perception #{selectedPerception?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerception && (
            <>
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
                  <h5>{selectedPerception.valueNumber}</h5>
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
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => selectedPerception && generatePDF(selectedPerception)}>
            <FileEarmarkPdf className="me-1" /> Générer PDF
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Modal */}
      <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Imprimer la Note de Perception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerception && (
            <>
              <p>
                Vous êtes sur le point d'imprimer la note de perception #{selectedPerception.id} pour{" "}
                <strong>{selectedPerception.subjectName}</strong>.
              </p>

              <Alert variant="info" className="d-flex align-items-center">
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
          <Button variant="secondary" onClick={() => setShowPrintModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={printPerception}
            disabled={loading}
            className="d-flex align-items-center"
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
