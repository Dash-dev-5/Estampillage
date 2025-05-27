"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Form, InputGroup, Badge, Button, Modal, Alert } from "react-bootstrap"
import {
  Archive,
  Search,
  Filter,
  Download,
  Calendar,
  FileEarmark,
  ArrowCounterclockwise,
  Eye,
  FileEarmarkPdf,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchArchives, restoreDocument } from "../redux/actions/archiveActions"

const Archives = () => {
  const dispatch = useDispatch()
  const { archives, loading, error } = useSelector((state) => state.archive)
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    dispatch(fetchArchives())
  }, [dispatch])

  const handleRestoreModalOpen = (archive) => {
    setSelectedArchive(archive)
    setShowRestoreModal(true)
  }

  const handleViewModalOpen = (archive) => {
    setSelectedArchive(archive)
    setShowViewModal(true)
  }

  const handleRestore = () => {
    dispatch(restoreDocument(selectedArchive.id))
    setShowRestoreModal(false)
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "Declaration":
        return <Badge bg="primary">Déclaration</Badge>
      case "PerceptionNote":
        return <Badge bg="success">Note de Perception</Badge>
      case "Report":
        return <Badge bg="info">Rapport</Badge>
      default:
        return <Badge bg="secondary">{type}</Badge>
    }
  }

  const filteredArchives = archives.filter((archive) => {
    const matchesText =
      archive.name.toLowerCase().includes(filter.toLowerCase()) ||
      archive.reason.toLowerCase().includes(filter.toLowerCase())
    const matchesType = !typeFilter || archive.documentType === typeFilter
    const matchesDate =
      !dateFilter || new Date(archive.archivedAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()

    return matchesText && matchesType && matchesDate
  })

  const uniqueTypes = [...new Set(archives.map((archive) => archive.documentType))]

  const downloadFile = (archive) => {
    // In a real application, this would download the actual file
    alert(`Téléchargement du fichier ${archive.file}`)
  }

  return (
    // <MainLayout>
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Archives"
          subtitle="Consultez et gérez les documents archivés"
          icon={<Archive className="me-2" size={24} />}
        />

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher dans les archives..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <Filter />
                  </InputGroup.Text>
                  <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">Tous les types</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "Declaration"
                          ? "Déclaration"
                          : type === "PerceptionNote"
                            ? "Note de Perception"
                            : type}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <Calendar />
                  </InputGroup.Text>
                  <Form.Control type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                </InputGroup>
              </Col>
              <Col md={2} className="text-end">
                <Button variant="outline-primary" className="w-100">
                  <Download className="me-2" /> Exporter
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
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Raison</th>
                  <th>Date d'archivage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement des archives...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredArchives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Aucune archive trouvée
                    </td>
                  </tr>
                ) : (
                  filteredArchives.map((archive) => (
                    <tr key={archive.id} className="align-middle hover-lift">
                      <td>{archive.id}</td>
                      <td>{archive.name}</td>
                      <td>{getTypeBadge(archive.documentType)}</td>
                      <td>{archive.reason}</td>
                      <td>{new Date(archive.archivedAt).toLocaleString()}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewModalOpen(archive)}
                            title="Voir"
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => downloadFile(archive)}
                            title="Télécharger"
                          >
                            <FileEarmarkPdf />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleRestoreModalOpen(archive)}
                            title="Restaurer"
                          >
                            <ArrowCounterclockwise />
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

      {/* Restore Confirmation Modal */}
      <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la restauration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArchive && (
            <>
              <p>
                Êtes-vous sûr de vouloir restaurer le document <strong>{selectedArchive.name}</strong> des archives ?
              </p>
              <Alert variant="info">Le document sera retiré des archives et remis dans sa section d'origine.</Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRestoreModal(false)}>
            Annuler
          </Button>
          <Button variant="warning" onClick={handleRestore}>
            <ArrowCounterclockwise className="me-2" /> Restaurer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Archive Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du document archivé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArchive && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="mb-3">{selectedArchive.name}</h5>
                  <p className="mb-2">
                    <strong>Type de document:</strong> {getTypeBadge(selectedArchive.documentType)}
                  </p>
                  <p className="mb-2">
                    <strong>ID du document:</strong> #{selectedArchive.documentId}
                  </p>
                  <p className="mb-2">
                    <strong>Raison de l'archivage:</strong> {selectedArchive.reason}
                  </p>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="mb-2">
                      <Calendar className="me-2" /> Informations d'archivage
                    </h6>
                    <p className="mb-2">
                      <strong>Date d'archivage:</strong> {new Date(selectedArchive.archivedAt).toLocaleString()}
                    </p>
                    <p className="mb-2">
                      <strong>Archivé par:</strong> Utilisateur #{selectedArchive.archivedBy}
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-2">
                      <FileEarmark className="me-2" /> Fichier
                    </h6>
                    <p>{selectedArchive.file}</p>
                    <Button variant="outline-primary" size="sm" onClick={() => downloadFile(selectedArchive)}>
                      <Download className="me-2" /> Télécharger
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fermer
          </Button>
          {selectedArchive && (
            <Button
              variant="warning"
              onClick={() => {
                setShowViewModal(false)
                handleRestoreModalOpen(selectedArchive)
              }}
            >
              <ArrowCounterclockwise className="me-2" /> Restaurer
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      </>
    // </MainLayout>
  )
}

export default Archives
