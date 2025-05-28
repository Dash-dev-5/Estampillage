"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Badge, InputGroup } from "react-bootstrap"
import { FileText, Plus, Eye, Pencil, Trash, CheckCircle, XCircle, Clock, ArrowRepeat } from "react-bootstrap-icons"

const ContractManagement = () => {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: "Jean Dupont",
      contractNumber: "CTR001",
      type: "CDI",
      startDate: "2020-01-15",
      endDate: null,
      status: "active",
      salary: 800000,
      position: "Agent de contrôle",
      department: "Contrôle fiscal",
      renewalCount: 0,
      signedDate: "2020-01-10",
      probationPeriod: 3,
      workingHours: 40,
      benefits: ["Assurance santé", "Transport", "Repas"],
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "Marie Kabila",
      contractNumber: "CTR002",
      type: "CDD",
      startDate: "2023-01-01",
      endDate: "2024-12-31",
      status: "active",
      salary: 1200000,
      position: "Superviseur",
      department: "Operations",
      renewalCount: 1,
      signedDate: "2022-12-20",
      probationPeriod: 2,
      workingHours: 40,
      benefits: ["Assurance santé", "Transport", "Repas", "Logement"],
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "Pierre Mukendi",
      contractNumber: "CTR003",
      type: "CDD",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      status: "expired",
      salary: 950000,
      position: "Comptable",
      department: "Finance",
      renewalCount: 0,
      signedDate: "2023-05-25",
      probationPeriod: 1,
      workingHours: 40,
      benefits: ["Assurance santé", "Transport"],
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("create")
  const [selectedContract, setSelectedContract] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    contractNumber: "",
    type: "CDI",
    startDate: "",
    endDate: "",
    salary: "",
    position: "",
    department: "",
    probationPeriod: 3,
    workingHours: 40,
    benefits: [],
  })

  const getStatusBadge = (status) => {
    const badges = {
      active: (
        <Badge bg="success">
          <CheckCircle className="me-1" />
          Actif
        </Badge>
      ),
      expired: (
        <Badge bg="danger">
          <XCircle className="me-1" />
          Expiré
        </Badge>
      ),
      terminated: (
        <Badge bg="secondary">
          <XCircle className="me-1" />
          Résilié
        </Badge>
      ),
      pending: (
        <Badge bg="warning">
          <Clock className="me-1" />
          En attente
        </Badge>
      ),
    }
    return badges[status] || <Badge bg="secondary">Inconnu</Badge>
  }

  const getContractTypeBadge = (type) => {
    const badges = {
      CDI: <Badge bg="primary">CDI</Badge>,
      CDD: <Badge bg="info">CDD</Badge>,
      Intérim: <Badge bg="warning">Intérim</Badge>,
      Stage: <Badge bg="secondary">Stage</Badge>,
    }
    return badges[type] || <Badge bg="secondary">{type}</Badge>
  }

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleModalOpen = (type, contract = null) => {
    setModalType(type)
    setSelectedContract(contract)

    if (type === "create") {
      setFormData({
        employeeId: "",
        employeeName: "",
        contractNumber: `CTR${String(contracts.length + 1).padStart(3, "0")}`,
        type: "CDI",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        salary: "",
        position: "",
        department: "",
        probationPeriod: 3,
        workingHours: 40,
        benefits: [],
      })
    } else if (contract) {
      setFormData({ ...contract })
    }

    setShowModal(true)
  }

  const handleRenewContract = (contract) => {
    const renewedContract = {
      ...contract,
      id: contracts.length + 1,
      contractNumber: `CTR${String(contracts.length + 1).padStart(3, "0")}`,
      startDate: contract.endDate,
      endDate: new Date(new Date(contract.endDate).setFullYear(new Date(contract.endDate).getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      renewalCount: contract.renewalCount + 1,
      status: "active",
      signedDate: new Date().toISOString().split("T")[0],
    }

    setContracts([...contracts.map((c) => (c.id === contract.id ? { ...c, status: "renewed" } : c)), renewedContract])
  }

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "CDF",
      minimumFractionDigits: 0,
    }).format(salary)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <FileText className="me-2" />
          Gestion des Contrats
        </h4>
        <Button variant="primary" onClick={() => handleModalOpen("create")}>
          <Plus className="me-1" />
          Nouveau Contrat
        </Button>
      </div>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{contracts.length}</h3>
              <small className="text-muted">Total Contrats</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{contracts.filter((c) => c.status === "active").length}</h3>
              <small className="text-muted">Actifs</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{contracts.filter((c) => c.type === "CDD").length}</h3>
              <small className="text-muted">CDD</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-danger">{contracts.filter((c) => c.status === "expired").length}</h3>
              <small className="text-muted">Expirés</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contrats expirant bientôt */}
      {contracts.filter(
        (c) => c.endDate && calculateDaysRemaining(c.endDate) <= 30 && calculateDaysRemaining(c.endDate) > 0,
      ).length > 0 && (
        <Alert variant="warning" className="mb-4">
          <Clock className="me-2" />
          <strong>Attention !</strong>{" "}
          {
            contracts.filter(
              (c) => c.endDate && calculateDaysRemaining(c.endDate) <= 30 && calculateDaysRemaining(c.endDate) > 0,
            ).length
          }{" "}
          contrat(s) expire(nt) dans les 30 prochains jours.
        </Alert>
      )}

      {/* Tableau des contrats */}
      <Card className="shadow-sm border-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>N° Contrat</th>
                <th>Employé</th>
                <th>Type</th>
                <th>Période</th>
                <th>Salaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => {
                const daysRemaining = calculateDaysRemaining(contract.endDate)
                return (
                  <tr key={contract.id} className="align-middle">
                    <td>
                      <strong>{contract.contractNumber}</strong>
                      {contract.renewalCount > 0 && (
                        <Badge bg="info" className="ms-2">
                          R{contract.renewalCount}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{contract.employeeName}</div>
                        <small className="text-muted">{contract.position}</small>
                      </div>
                    </td>
                    <td>{getContractTypeBadge(contract.type)}</td>
                    <td>
                      <div>
                        <div>{new Date(contract.startDate).toLocaleDateString()}</div>
                        {contract.endDate && (
                          <div>
                            <small className="text-muted">→ {new Date(contract.endDate).toLocaleDateString()}</small>
                            {daysRemaining !== null && daysRemaining > 0 && (
                              <div>
                                <small className={daysRemaining <= 30 ? "text-warning" : "text-muted"}>
                                  {daysRemaining} jours restants
                                </small>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{formatSalary(contract.salary)}</td>
                    <td>{getStatusBadge(contract.status)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleModalOpen("view", contract)}
                          title="Voir"
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleModalOpen("edit", contract)}
                          title="Modifier"
                        >
                          <Pencil />
                        </Button>
                        {contract.type === "CDD" && contract.status === "active" && daysRemaining <= 60 && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleRenewContract(contract)}
                            title="Renouveler"
                          >
                            <ArrowRepeat />
                          </Button>
                        )}
                        <Button variant="outline-danger" size="sm" title="Supprimer">
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modal Contrat */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" && "Nouveau Contrat"}
            {modalType === "edit" && "Modifier Contrat"}
            {modalType === "view" && "Détails du Contrat"}
          </Modal.Title>
        </Modal.Header>

        {modalType === "view" && selectedContract ? (
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <strong>N° Contrat:</strong> {selectedContract.contractNumber}
              </Col>
              <Col md={6}>
                <strong>Employé:</strong> {selectedContract.employeeName}
              </Col>
              <Col md={6}>
                <strong>Type:</strong> {selectedContract.type}
              </Col>
              <Col md={6}>
                <strong>Statut:</strong> {getStatusBadge(selectedContract.status)}
              </Col>
              <Col md={6}>
                <strong>Date de début:</strong> {new Date(selectedContract.startDate).toLocaleDateString()}
              </Col>
              <Col md={6}>
                <strong>Date de fin:</strong>{" "}
                {selectedContract.endDate ? new Date(selectedContract.endDate).toLocaleDateString() : "Indéterminée"}
              </Col>
              <Col md={6}>
                <strong>Salaire:</strong> {formatSalary(selectedContract.salary)}
              </Col>
              <Col md={6}>
                <strong>Période d'essai:</strong> {selectedContract.probationPeriod} mois
              </Col>
              <Col md={6}>
                <strong>Heures de travail:</strong> {selectedContract.workingHours}h/semaine
              </Col>
              <Col md={6}>
                <strong>Renouvellements:</strong> {selectedContract.renewalCount}
              </Col>
              <Col md={12}>
                <strong>Avantages:</strong>
                <div className="mt-1">
                  {selectedContract.benefits?.map((benefit, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          </Modal.Body>
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              setLoading(true)
              setTimeout(() => {
                if (modalType === "create") {
                  const newContract = {
                    id: contracts.length + 1,
                    ...formData,
                    salary: Number.parseFloat(formData.salary),
                    status: "active",
                    signedDate: new Date().toISOString().split("T")[0],
                    renewalCount: 0,
                  }
                  setContracts([...contracts, newContract])
                } else if (modalType === "edit") {
                  setContracts(
                    contracts.map((contract) =>
                      contract.id === selectedContract.id
                        ? { ...contract, ...formData, salary: Number.parseFloat(formData.salary) }
                        : contract,
                    ),
                  )
                }
                setShowModal(false)
                setLoading(false)
              }, 1000)
            }}
          >
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>N° Contrat</Form.Label>
                    <Form.Control
                      type="text"
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                      required
                      disabled={modalType === "edit"}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Employé</Form.Label>
                    <Form.Control
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Type de contrat</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Intérim">Intérim</option>
                      <option value="Stage">Stage</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Poste</Form.Label>
                    <Form.Control
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.type === "CDI"}
                    />
                    {formData.type === "CDI" && (
                      <Form.Text className="text-muted">Les CDI n'ont pas de date de fin</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Salaire (FC)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        required
                        min="0"
                      />
                      <InputGroup.Text>FC</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Période d'essai (mois)</Form.Label>
                    <Form.Control
                      type="number"
                      name="probationPeriod"
                      value={formData.probationPeriod}
                      onChange={(e) => setFormData({ ...formData, probationPeriod: Number.parseInt(e.target.value) })}
                      min="0"
                      max="12"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Heures de travail/semaine</Form.Label>
                    <Form.Control
                      type="number"
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={(e) => setFormData({ ...formData, workingHours: Number.parseInt(e.target.value) })}
                      min="1"
                      max="60"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Département</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Sélectionner un département</option>
                      <option value="Administration">Administration</option>
                      <option value="Contrôle fiscal">Contrôle fiscal</option>
                      <option value="Operations">Opérations</option>
                      <option value="Finance">Finance</option>
                      <option value="IT">Informatique</option>
                      <option value="RH">Ressources Humaines</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : modalType === "create" ? "Créer" : "Modifier"}
              </Button>
            </Modal.Footer>
          </Form>
        )}

        {modalType === "view" && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  )
}

export default ContractManagement
