"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Button, Table, Form, Badge, Modal, Alert } from "react-bootstrap"
import { useSelector } from "react-redux"
import {
  Printer,
  PlusCircle,
  FileEarmarkCheck,
  FileEarmarkX,
  ArrowClockwise,
  FileEarmarkRuled,
} from "react-bootstrap-icons"
import PageTitle from "../components/common/PageTitle"

// Données simulées pour les imprimés de valeur
const mockValuePrints = [
  { id: 1, number: "VP-2023-0001", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  { id: 2, number: "VP-2023-0002", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  { id: 3, number: "VP-2023-0003", status: "used", createdAt: "2023-01-15", usedAt: "2023-02-10", usedBy: "John Doe" },
  {
    id: 4,
    number: "VP-2023-0004",
    status: "used",
    createdAt: "2023-01-15",
    usedAt: "2023-02-12",
    usedBy: "Jane Smith",
  },
  { id: 5, number: "VP-2023-0005", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  { id: 6, number: "VP-2023-0006", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  { id: 7, number: "VP-2023-0007", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  {
    id: 8,
    number: "VP-2023-0008",
    status: "used",
    createdAt: "2023-01-15",
    usedAt: "2023-03-05",
    usedBy: "Mike Johnson",
  },
  { id: 9, number: "VP-2023-0009", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
  { id: 10, number: "VP-2023-0010", status: "available", createdAt: "2023-01-15", usedAt: null, usedBy: null },
]

const ValuePrintManagement = () => {
  const [valuePrints, setValuePrints] = useState([])
  const [filteredPrints, setFilteredPrints] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generateCount, setGenerateCount] = useState(10)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [selectedPrints, setSelectedPrints] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setValuePrints(mockValuePrints)
      setFilteredPrints(mockValuePrints)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let result = [...valuePrints]

    // Appliquer le filtre de statut
    if (filter !== "all") {
      result = result.filter((print) => print.status === filter)
    }

    // Appliquer la recherche
    if (searchTerm) {
      result = result.filter(
        (print) =>
          print.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (print.usedBy && print.usedBy.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredPrints(result)
  }, [valuePrints, filter, searchTerm])

  const handleGenerateValuePrints = () => {
    setLoading(true)

    // Simuler la génération de nouveaux imprimés
    setTimeout(() => {
      const newPrints = []
      const lastId = valuePrints.length > 0 ? Math.max(...valuePrints.map((p) => p.id)) : 0

      for (let i = 1; i <= generateCount; i++) {
        const id = lastId + i
        const number = `VP-2023-${String(id).padStart(4, "0")}`

        newPrints.push({
          id,
          number,
          status: "available",
          createdAt: new Date().toISOString().split("T")[0],
          usedAt: null,
          usedBy: null,
        })
      }

      setValuePrints([...valuePrints, ...newPrints])
      setShowGenerateModal(false)
      setGenerateCount(10)
      setLoading(false)
      setSuccess(`${generateCount} nouveaux imprimés de valeur ont été générés avec succès.`)

      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handlePrintSelected = () => {
    // Simuler l'impression
    console.log("Impression des imprimés sélectionnés:", selectedPrints)
    setShowPrintModal(false)
    setSelectedPrints([])
    setSuccess("Les imprimés sélectionnés ont été envoyés à l'impression.")

    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const toggleSelectPrint = (id) => {
    if (selectedPrints.includes(id)) {
      setSelectedPrints(selectedPrints.filter((printId) => printId !== id))
    } else {
      setSelectedPrints([...selectedPrints, id])
    }
  }

  const getStatusBadge = (status) => {
    if (status === "available") {
      return <Badge bg="success">Disponible</Badge>
    } else if (status === "used") {
      return <Badge bg="secondary">Utilisé</Badge>
    }
    return <Badge bg="light">Inconnu</Badge>
  }

  return (
    <div className="fade-in">
      <PageTitle
        title="Gestion des Imprimés de Valeur"
        description="Générez, suivez et imprimez les imprimés de valeur pour les notes de perception."
      />

      {success && (
        <Alert variant="success" className="glass-alert mb-4">
          {success}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="glass-card metric-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="metric-value">
                <FileEarmarkCheck size={40} />
              </div>
              <h2 className="fw-bold metric-value">{valuePrints.filter((p) => p.status === "available").length}</h2>
              <p className="metric-subtitle mb-0">Imprimés disponibles</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="glass-card metric-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className=" metric-value">
                <FileEarmarkX size={40} />
              </div>
              <h2 className=" mb-0 fw-bold metric-value">{valuePrints.filter((p) => p.status === "used").length}</h2>
              <p className="metric-subtitle mb-0">Imprimés utilisés</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="glass-card  metric-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="metric-value">
                <FileEarmarkRuled size={40} />
              </div>
              <h2 className="mb-0 fw-bold metric-value">{valuePrints.length}</h2>
              <p className="mb-0 metric-subtitle">Total des imprimés</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="glass-card metric-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <Button
                variant="primary"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center app-btn app-btn-primary"
                onClick={() => setShowGenerateModal(true)}
              >
                <PlusCircle size={24} className="mb-2" />
                <span>Générer des imprimés</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="glass-card mb-4 metric-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h5 className="mb-0 metric-title">Liste des imprimés de valeur</h5>

            <div className="d-flex  gap-2 mt-2 mt-md-0">
              <Form.Select
                className="glass-input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: "150px" }}
              >
                <option value="all">Tous</option>
                <option value="available">Disponibles</option>
                <option value="used">Utilisés</option>
              </Form.Select>

              <Form.Control
                type="search"
                placeholder="Rechercher..."
                className="glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "200px" }}
              />

              <Button
                variant="outline-primary"
                className="app-btn"
                onClick={() => setShowPrintModal(true)}
                disabled={selectedPrints.length === 0}
              >
                <Printer className="me-1" /> Imprimer
              </Button>

              <Button
                variant="outline-secondary"
                className="app-btn"
                onClick={() => {
                  setFilter("all")
                  setSearchTerm("")
                }}
              >
                <ArrowClockwise />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center chart-container py-5">
              <div className="app-spinner mx-auto"></div>
              <p className="mt-3 text-muted">Chargement des imprimés de valeur...</p>
            </div>
          ) : filteredPrints.length === 0 ? (
            <div className="text-center chart-container py-5">
              <FileEarmarkRuled size={48} className="text-muted mb-3" />
              <h5>Aucun imprimé de valeur trouvé</h5>
              <p className="text-muted">Ajustez vos filtres ou générez de nouveaux imprimés.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className=" chart-container mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrints(filteredPrints.filter((p) => p.status === "available").map((p) => p.id))
                          } else {
                            setSelectedPrints([])
                          }
                        }}
                        checked={
                          filteredPrints.filter((p) => p.status === "available").length > 0 &&
                          filteredPrints
                            .filter((p) => p.status === "available")
                            .every((p) => selectedPrints.includes(p.id))
                        }
                      />
                    </th>
                    <th>Numéro</th>
                    <th>Statut</th>
                    <th>Date de création</th>
                    <th>Date d'utilisation</th>
                    <th>Utilisé par</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrints.map((print) => (
                    <tr key={print.id}>
                      <td>
                        {print.status === "available" && (
                          <Form.Check
                            type="checkbox"
                            checked={selectedPrints.includes(print.id)}
                            onChange={() => toggleSelectPrint(print.id)}
                          />
                        )}
                      </td>
                      <td>
                        <span className="value-print-number">{print.number}</span>
                      </td>
                      <td>{getStatusBadge(print.status)}</td>
                      <td>{print.createdAt}</td>
                      <td>{print.usedAt || "-"}</td>
                      <td>{print.usedBy || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal pour générer des imprimés */}
      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} centered className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Générer des imprimés de valeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre d'imprimés à générer</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="100"
              value={generateCount}
              onChange={(e) => setGenerateCount(Number.parseInt(e.target.value) || 1)}
              className="glass-input"
            />
            <Form.Text className="text-muted">Vous pouvez générer jusqu'à 100 imprimés à la fois.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)} className="app-btn">
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerateValuePrints}
            className="app-btn app-btn-primary"
            disabled={loading}
          >
            {loading ? "Génération en cours..." : "Générer"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour imprimer des imprimés */}
      <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} centered className="mac-modal">
        <Modal.Header closeButton>
          <Modal.Title>Imprimer les imprimés de valeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Vous êtes sur le point d'imprimer {selectedPrints.length} imprimé(s) de valeur.</p>
          <Alert variant="info" className="glass-alert">
            <strong>Note:</strong> Assurez-vous que l'imprimante est connectée et prête à imprimer.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrintModal(false)} className="app-btn">
            Annuler
          </Button>
          <Button variant="primary" onClick={handlePrintSelected} className="app-btn app-btn-primary">
            <Printer className="me-1" /> Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ValuePrintManagement
