"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Button, Modal, Form, Alert, Tab, Nav, Badge } from "react-bootstrap"
import { Diagram3, Plus, Person, Building, PeopleFill, Gear, Eye } from "react-bootstrap-icons"
import { fetchDepartments, createDepartment, updateDepartment } from "../../redux/actions/hrActions"

const OrganizationChart = () => {
  const dispatch = useDispatch()
  const { departments, employees, loading, error } = useSelector((state) => state.hr)

  const [showModal, setShowModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [activeTab, setActiveTab] = useState("chart")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "",
    parentId: "",
    budget: 0,
    status: "active",
  })

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedDepartment) {
      dispatch(updateDepartment(selectedDepartment.id, formData))
    } else {
      dispatch(createDepartment(formData))
    }
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      managerId: "",
      parentId: "",
      budget: 0,
      status: "active",
    })
    setSelectedDepartment(null)
  }

  const orgStats = {
    totalDepartments: departments?.length || 0,
    totalEmployees: employees?.length || 0,
    avgEmployeesPerDept: departments?.length ? Math.round((employees?.length || 0) / departments.length) : 0,
    activeDepartments: departments?.filter((d) => d.status === "active").length || 0,
  }

  const DepartmentCard = ({ department, level = 0 }) => {
    const employeeCount = employees?.filter((e) => e.departmentId === department.id).length || 0
    const manager = employees?.find((e) => e.id === department.managerId)

    return (
      <div className={`mb-3 ${level > 0 ? "ms-4" : ""}`}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <Building size={20} className="text-primary me-2" />
                  <h6 className="mb-0 fw-semibold">{department.name}</h6>
                  <Badge bg="primary" className="ms-2 px-2 py-1">
                    {employeeCount} employé(s)
                  </Badge>
                </div>

                {department.description && <p className="text-muted small mb-2">{department.description}</p>}

                {manager && (
                  <div className="d-flex align-items-center mb-2">
                    <Person size={16} className="text-secondary me-2" />
                    <small className="text-muted">
                      Manager: <span className="fw-semibold">{manager.name}</span>
                    </small>
                  </div>
                )}

                {department.budget > 0 && (
                  <div className="d-flex align-items-center">
                    <small className="text-muted">
                      Budget: <span className="fw-semibold">{department.budget.toLocaleString()} FCFA</span>
                    </small>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDepartment(department)
                    setFormData({
                      name: department.name,
                      description: department.description,
                      managerId: department.managerId,
                      parentId: department.parentId,
                      budget: department.budget,
                      status: department.status,
                    })
                    setShowModal(true)
                  }}
                  className="me-2"
                >
                  <Gear size={14} />
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Eye size={14} />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Sous-départements */}
        {departments
          ?.filter((d) => d.parentId === department.id)
          .map((subDept) => (
            <DepartmentCard key={subDept.id} department={subDept} level={level + 1} />
          ))}
      </div>
    )
  }

  const rootDepartments = departments?.filter((d) => !d.parentId) || []

  return (
    <div>
      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Building size={24} className="text-primary mb-2" />
              <h4 className="mb-1">{orgStats.totalDepartments}</h4>
              <small className="text-muted">Départements</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <PeopleFill size={24} className="text-success mb-2" />
              <h4 className="mb-1">{orgStats.totalEmployees}</h4>
              <small className="text-muted">Employés</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Person size={24} className="text-info mb-2" />
              <h4 className="mb-1">{orgStats.avgEmployeesPerDept}</h4>
              <small className="text-muted">Moy. par Dept.</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Diagram3 size={24} className="text-warning mb-2" />
              <h4 className="mb-1">{orgStats.activeDepartments}</h4>
              <small className="text-muted">Actifs</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="pills" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="chart">
                  <Diagram3 className="me-2" size={16} />
                  Organigramme
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="departments">
                  <Building className="me-2" size={16} />
                  Départements
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="positions">
                  <Person className="me-2" size={16} />
                  Postes
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="chart">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Structure Organisationnelle</h5>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus className="me-2" size={16} />
                    Nouveau Département
                  </Button>
                </div>

                {rootDepartments.length > 0 ? (
                  <div>
                    {rootDepartments.map((department) => (
                      <DepartmentCard key={department.id} department={department} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <Diagram3 size={48} className="text-muted mb-3" />
                    <h5>Aucun département</h5>
                    <p className="text-muted">Commencez par créer votre premier département</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                      <Plus className="me-2" size={16} />
                      Créer un Département
                    </Button>
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="departments">
                <div className="text-center py-5">
                  <Building size={48} className="text-muted mb-3" />
                  <h5>Gestion des Départements</h5>
                  <p className="text-muted">Vue détaillée des départements en cours de développement</p>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="positions">
                <div className="text-center py-5">
                  <Person size={48} className="text-muted mb-3" />
                  <h5>Gestion des Postes</h5>
                  <p className="text-muted">Définition des postes et responsabilités en cours de développement</p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedDepartment ? "Modifier le Département" : "Nouveau Département"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du Département</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ex: Ressources Humaines"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Département Parent</Form.Label>
                  <Form.Select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  >
                    <option value="">Aucun (Département racine)</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du département et de ses responsabilités..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Manager</Form.Label>
                  <Form.Select
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  >
                    <option value="">Sélectionner un manager</option>
                    {employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.position}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget Annuel (FCFA)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="restructuring">En Restructuration</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {selectedDepartment ? "Modifier" : "Créer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  )
}

export default OrganizationChart
