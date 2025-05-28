"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Dropdown, Tab, Nav, ProgressBar } from "react-bootstrap"
import { Star, Plus, Eye, GraphUp, Calendar, Person, Award, Bullseye, BarChart } from "react-bootstrap-icons"
import { fetchEvaluations, createEvaluation, updateEvaluation } from "../../redux/actions/hrActions"
import SearchFilter from "../common/SearchFilter"
import { formatDate } from "../../utils/formatters"

const EvaluationManagement = () => {
  const dispatch = useDispatch()
  const { evaluations, loading, error } = useSelector((state) => state.hr)

  const [showModal, setShowModal] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("evaluations")

  const [formData, setFormData] = useState({
    employeeId: "",
    period: "",
    year: new Date().getFullYear(),
    criteria: [
      { name: "Qualité du travail", score: 0, weight: 20 },
      { name: "Productivité", score: 0, weight: 20 },
      { name: "Ponctualité", score: 0, weight: 15 },
      { name: "Travail en équipe", score: 0, weight: 15 },
      { name: "Initiative", score: 0, weight: 15 },
      { name: "Communication", score: 0, weight: 15 },
    ],
    comments: "",
    objectives: "",
    status: "draft",
  })

  useEffect(() => {
    dispatch(fetchEvaluations())
  }, [dispatch])

  const calculateOverallScore = (criteria) => {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
    const weightedScore = criteria.reduce((sum, c) => sum + c.score * c.weight, 0)
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "danger"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Satisfaisant"
    return "À améliorer"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const evaluationData = {
      ...formData,
      overallScore: calculateOverallScore(formData.criteria),
    }

    if (selectedEvaluation) {
      dispatch(updateEvaluation(selectedEvaluation.id, evaluationData))
    } else {
      dispatch(createEvaluation(evaluationData))
    }
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      period: "",
      year: new Date().getFullYear(),
      criteria: [
        { name: "Qualité du travail", score: 0, weight: 20 },
        { name: "Productivité", score: 0, weight: 20 },
        { name: "Ponctualité", score: 0, weight: 15 },
        { name: "Travail en équipe", score: 0, weight: 15 },
        { name: "Initiative", score: 0, weight: 15 },
        { name: "Communication", score: 0, weight: 15 },
      ],
      comments: "",
      objectives: "",
      status: "draft",
    })
    setSelectedEvaluation(null)
  }

  const updateCriteriaScore = (index, score) => {
    const newCriteria = [...formData.criteria]
    newCriteria[index].score = Number.parseInt(score)
    setFormData({ ...formData, criteria: newCriteria })
  }

  const filteredEvaluations =
    evaluations?.filter((evaluation) => evaluation.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    []

  const evaluationStats = {
    total: evaluations?.length || 0,
    avgScore: evaluations?.length
      ? Math.round(evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / evaluations.length)
      : 0,
    excellent: evaluations?.filter((e) => e.overallScore >= 80).length || 0,
    pending: evaluations?.filter((e) => e.status === "draft").length || 0,
  }

  return (
    <div>
      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Star size={24} className="text-warning mb-2" />
              <h4 className="mb-1">{evaluationStats.total}</h4>
              <small className="text-muted">Évaluations</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <GraphUp size={24} className="text-success mb-2" />
              <h4 className="mb-1">{evaluationStats.avgScore}%</h4>
              <small className="text-muted">Score Moyen</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Award size={24} className="text-primary mb-2" />
              <h4 className="mb-1">{evaluationStats.excellent}</h4>
              <small className="text-muted">Excellents</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Calendar size={24} className="text-info mb-2" />
              <h4 className="mb-1">{evaluationStats.pending}</h4>
              <small className="text-muted">En Attente</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="pills" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="evaluations">
                  <Star className="me-2" size={16} />
                  Évaluations
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analytics">
                  <BarChart className="me-2" size={16} />
                  Analyses
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="objectives">
                  <Bullseye className="me-2" size={16} />
                  Objectifs
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="evaluations">
                {/* Barre d'actions */}
                <Row className="mb-3">
                  <Col md={6}>
                    <SearchFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      placeholder="Rechercher par employé..."
                    />
                  </Col>
                  <Col md={6} className="text-end">
                    <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
                      <Plus className="me-2" size={16} />
                      Nouvelle Évaluation
                    </Button>
                    <Button variant="outline-secondary">
                      <BarChart className="me-2" size={16} />
                      Rapport
                    </Button>
                  </Col>
                </Row>

                {/* Tableau des évaluations */}
                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Employé</th>
                      <th>Période</th>
                      <th>Score Global</th>
                      <th>Performance</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvaluations.map((evaluation) => (
                      <tr key={evaluation.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                              <Person size={16} />
                            </div>
                            <div>
                              <div className="fw-semibold">{evaluation.employee?.name}</div>
                              <small className="text-muted">{evaluation.employee?.position}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{evaluation.period}</div>
                            <small className="text-muted">{evaluation.year}</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2" style={{ width: "60px" }}>
                              <ProgressBar
                                now={evaluation.overallScore}
                                variant={getScoreColor(evaluation.overallScore)}
                                style={{ height: "8px" }}
                              />
                            </div>
                            <span className="fw-bold">{evaluation.overallScore}%</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getScoreColor(evaluation.overallScore)} className="px-2 py-1">
                            {getScoreLabel(evaluation.overallScore)}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={evaluation.status === "completed" ? "success" : "warning"} className="px-2 py-1">
                            {evaluation.status === "completed" ? "Terminée" : "Brouillon"}
                          </Badge>
                        </td>
                        <td>{formatDate(evaluation.createdAt)}</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                <Eye className="me-2" size={14} />
                                Voir Détails
                              </Dropdown.Item>
                              <Dropdown.Item>Modifier</Dropdown.Item>
                              <Dropdown.Item>Dupliquer</Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              <Tab.Pane eventKey="analytics">
                <div className="text-center py-5">
                  <BarChart size={48} className="text-muted mb-3" />
                  <h5>Analyses de Performance</h5>
                  <p className="text-muted">Graphiques et analyses en cours de développement</p>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="objectives">
                <div className="text-center py-5">
                  <Bullseye size={48} className="text-muted mb-3" />
                  <h5>Gestion des Objectifs</h5>
                  <p className="text-muted">Module objectifs en cours de développement</p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvaluation ? "Modifier l'Évaluation" : "Nouvelle Évaluation"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employé</Form.Label>
                  <Form.Select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un employé</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Période</Form.Label>
                  <Form.Select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    required
                  >
                    <option value="">Période</option>
                    <option value="Q1">1er Trimestre</option>
                    <option value="Q2">2ème Trimestre</option>
                    <option value="Q3">3ème Trimestre</option>
                    <option value="Q4">4ème Trimestre</option>
                    <option value="Annual">Annuelle</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Année</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="mb-3">Critères d'Évaluation</h6>
            {formData.criteria.map((criterion, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={4}>
                  <Form.Label className="mb-0">{criterion.name}</Form.Label>
                  <small className="text-muted d-block">Poids: {criterion.weight}%</small>
                </Col>
                <Col md={4}>
                  <Form.Range
                    min="0"
                    max="100"
                    value={criterion.score}
                    onChange={(e) => updateCriteriaScore(index, e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={criterion.score}
                    onChange={(e) => updateCriteriaScore(index, e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col md={2}>
                  <Badge bg={getScoreColor(criterion.score)} className="px-2 py-1">
                    {criterion.score}%
                  </Badge>
                </Col>
              </Row>
            ))}

            <Row className="mb-3">
              <Col md={12}>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Score Global:</span>
                    <div className="d-flex align-items-center">
                      <ProgressBar
                        now={calculateOverallScore(formData.criteria)}
                        variant={getScoreColor(calculateOverallScore(formData.criteria))}
                        style={{ width: "100px", height: "10px" }}
                        className="me-2"
                      />
                      <span className="fw-bold fs-5">{calculateOverallScore(formData.criteria)}%</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Commentaires</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Commentaires sur la performance..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Objectifs pour la prochaine période</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Objectifs à atteindre..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Brouillon</option>
                <option value="completed">Terminée</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {selectedEvaluation ? "Modifier" : "Créer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default EvaluationManagement
