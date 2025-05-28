"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Dropdown, Tab, Nav } from "react-bootstrap"
import {
  CurrencyDollar,
  Plus,
  Eye,
  Download,
  Calculator,
  FileText,
  GraphUp,
  Clock,
  Person,
} from "react-bootstrap-icons"
import { fetchPayrolls, createPayroll, updatePayroll } from "../../redux/actions/hrActions"
import SearchFilter from "../common/SearchFilter"
import { formatCurrency } from "../../utils/formatters"

const PayrollManagement = () => {
  const dispatch = useDispatch()
  const { payrolls, loading, error } = useSelector((state) => state.hr)

  const [showModal, setShowModal] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [activeTab, setActiveTab] = useState("payrolls")

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: new Date().getFullYear(),
    baseSalary: 0,
    overtime: 0,
    bonuses: 0,
    deductions: 0,
    socialSecurity: 0,
    tax: 0,
    netSalary: 0,
    status: "draft",
  })

  useEffect(() => {
    dispatch(fetchPayrolls())
  }, [dispatch])

  const payrollStats = {
    totalPayrolls: payrolls?.length || 0,
    totalAmount: payrolls?.reduce((sum, p) => sum + (p.netSalary || 0), 0) || 0,
    avgSalary: payrolls?.length ? payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0) / payrolls.length : 0,
    pending: payrolls?.filter((p) => p.status === "pending").length || 0,
  }

  const calculateNetSalary = (data) => {
    const gross =
      Number.parseFloat(data.baseSalary) + Number.parseFloat(data.overtime) + Number.parseFloat(data.bonuses)
    const totalDeductions =
      Number.parseFloat(data.deductions) + Number.parseFloat(data.socialSecurity) + Number.parseFloat(data.tax)
    return gross - totalDeductions
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payrollData = {
      ...formData,
      netSalary: calculateNetSalary(formData),
    }

    if (selectedPayroll) {
      dispatch(updatePayroll(selectedPayroll.id, payrollData))
    } else {
      dispatch(createPayroll(payrollData))
    }
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      month: "",
      year: new Date().getFullYear(),
      baseSalary: 0,
      overtime: 0,
      bonuses: 0,
      deductions: 0,
      socialSecurity: 0,
      tax: 0,
      netSalary: 0,
      status: "draft",
    })
    setSelectedPayroll(null)
  }

  const filteredPayrolls =
    payrolls?.filter((payroll) => {
      const matchesSearch = payroll.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMonth = !monthFilter || payroll.month === monthFilter
      return matchesSearch && matchesMonth
    }) || []

  return (
    <div>
      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <CurrencyDollar size={24} className="text-success mb-2" />
              <h4 className="mb-1">{formatCurrency(payrollStats.totalAmount)}</h4>
              <small className="text-muted">Masse Salariale</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <GraphUp size={24} className="text-primary mb-2" />
              <h4 className="mb-1">{formatCurrency(payrollStats.avgSalary)}</h4>
              <small className="text-muted">Salaire Moyen</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FileText size={24} className="text-info mb-2" />
              <h4 className="mb-1">{payrollStats.totalPayrolls}</h4>
              <small className="text-muted">Bulletins</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <Clock size={24} className="text-warning mb-2" />
              <h4 className="mb-1">{payrollStats.pending}</h4>
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
                <Nav.Link eventKey="payrolls">
                  <FileText className="me-2" size={16} />
                  Bulletins de Paie
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="calculator">
                  <Calculator className="me-2" size={16} />
                  Calculateur
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">
                  <GraphUp className="me-2" size={16} />
                  Rapports
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="payrolls">
                {/* Barre d'actions */}
                <Row className="mb-3">
                  <Col md={4}>
                    <SearchFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      placeholder="Rechercher par employé..."
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                      <option value="">Tous les mois</option>
                      <option value="01">Janvier</option>
                      <option value="02">Février</option>
                      <option value="03">Mars</option>
                      <option value="04">Avril</option>
                      <option value="05">Mai</option>
                      <option value="06">Juin</option>
                      <option value="07">Juillet</option>
                      <option value="08">Août</option>
                      <option value="09">Septembre</option>
                      <option value="10">Octobre</option>
                      <option value="11">Novembre</option>
                      <option value="12">Décembre</option>
                    </Form.Select>
                  </Col>
                  <Col md={5} className="text-end">
                    <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
                      <Plus className="me-2" size={16} />
                      Nouveau Bulletin
                    </Button>
                    <Button variant="outline-success" className="me-2">
                      <Calculator className="me-2" size={16} />
                      Calcul Auto
                    </Button>
                    <Button variant="outline-secondary">
                      <Download className="me-2" size={16} />
                      Export
                    </Button>
                  </Col>
                </Row>

                {/* Tableau des bulletins */}
                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Employé</th>
                      <th>Période</th>
                      <th>Salaire de Base</th>
                      <th>Heures Sup.</th>
                      <th>Primes</th>
                      <th>Retenues</th>
                      <th>Net à Payer</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayrolls.map((payroll) => (
                      <tr key={payroll.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                              <Person size={16} />
                            </div>
                            <div>
                              <div className="fw-semibold">{payroll.employee?.name}</div>
                              <small className="text-muted">{payroll.employee?.matricule}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">
                              {payroll.month}/{payroll.year}
                            </div>
                          </div>
                        </td>
                        <td>{formatCurrency(payroll.baseSalary)}</td>
                        <td>{formatCurrency(payroll.overtime)}</td>
                        <td>{formatCurrency(payroll.bonuses)}</td>
                        <td>{formatCurrency(payroll.deductions + payroll.socialSecurity + payroll.tax)}</td>
                        <td>
                          <span className="fw-bold text-success">{formatCurrency(payroll.netSalary)}</span>
                        </td>
                        <td>
                          <Badge
                            bg={
                              payroll.status === "paid"
                                ? "success"
                                : payroll.status === "approved"
                                  ? "primary"
                                  : "warning"
                            }
                            className="px-2 py-1"
                          >
                            {payroll.status === "paid"
                              ? "Payé"
                              : payroll.status === "approved"
                                ? "Approuvé"
                                : "Brouillon"}
                          </Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                <Eye className="me-2" size={14} />
                                Voir Bulletin
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Download className="me-2" size={14} />
                                Télécharger PDF
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item>Modifier</Dropdown.Item>
                              <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              <Tab.Pane eventKey="calculator">
                <div className="text-center py-5">
                  <Calculator size={48} className="text-muted mb-3" />
                  <h5>Calculateur de Paie</h5>
                  <p className="text-muted">Outil de calcul automatique en cours de développement</p>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="reports">
                <div className="text-center py-5">
                  <GraphUp size={48} className="text-muted mb-3" />
                  <h5>Rapports de Paie</h5>
                  <p className="text-muted">Rapports et analyses en cours de développement</p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPayroll ? "Modifier le Bulletin" : "Nouveau Bulletin de Paie"}</Modal.Title>
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
                  <Form.Label>Mois</Form.Label>
                  <Form.Select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  >
                    <option value="">Mois</option>
                    <option value="01">Janvier</option>
                    <option value="02">Février</option>
                    <option value="03">Mars</option>
                    <option value="04">Avril</option>
                    <option value="05">Mai</option>
                    <option value="06">Juin</option>
                    <option value="07">Juillet</option>
                    <option value="08">Août</option>
                    <option value="09">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salaire de Base</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: Number.parseFloat(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Heures Supplémentaires</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: Number.parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primes</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.bonuses}
                    onChange={(e) => setFormData({ ...formData, bonuses: Number.parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Retenues</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: Number.parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sécurité Sociale</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.socialSecurity}
                    onChange={(e) => setFormData({ ...formData, socialSecurity: Number.parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Impôts</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: Number.parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Net à Payer</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={calculateNetSalary(formData)}
                    readOnly
                    className="bg-light fw-bold"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="approved">Approuvé</option>
                    <option value="paid">Payé</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {selectedPayroll ? "Modifier" : "Créer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default PayrollManagement
