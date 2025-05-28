"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Tabs, Tab, ProgressBar } from "react-bootstrap"
import { Search, Pencil, Trash, Eye, PersonBadge, Plus, Download, Upload } from "react-bootstrap-icons"

const EmployeeManagement = () => {
  // Données simulées des employés avec plus de détails
  const [employees, setEmployees] = useState([
    {
      id: 1,
      matricule: "EMP001",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@estampillage.com",
      phone: "+243 123 456 789",
      position: "Agent de contrôle",
      department: "Contrôle fiscal",
      site: "Kinshasa",
      hireDate: "2020-01-15",
      birthDate: "1985-03-20",
      address: "123 Avenue Kasa-Vubu, Kinshasa",
      emergencyContact: {
        name: "Marie Dupont",
        phone: "+243 987 654 321",
        relation: "Épouse",
      },
      status: "active",
      salary: 800000,
      contractType: "CDI",
      manager: "Pierre Mukendi",
      skills: ["Contrôle fiscal", "Audit", "Comptabilité"],
      education: [
        {
          degree: "Licence en Comptabilité",
          institution: "Université de Kinshasa",
          year: "2008",
        },
      ],
      experience: "5 ans",
      performance: 85,
      leaveBalance: 25,
    },
    {
      id: 2,
      matricule: "EMP002",
      firstName: "Marie",
      lastName: "Kabila",
      email: "marie.kabila@estampillage.com",
      phone: "+243 987 654 321",
      position: "Superviseur",
      department: "Operations",
      site: "Lubumbashi",
      hireDate: "2019-03-20",
      birthDate: "1982-07-15",
      address: "456 Avenue Mobutu, Lubumbashi",
      emergencyContact: {
        name: "Joseph Kabila",
        phone: "+243 555 123 456",
        relation: "Frère",
      },
      status: "active",
      salary: 1200000,
      contractType: "CDI",
      manager: "Directeur Général",
      skills: ["Management", "Leadership", "Operations"],
      education: [
        {
          degree: "Master en Management",
          institution: "Université de Lubumbashi",
          year: "2010",
        },
      ],
      experience: "8 ans",
      performance: 92,
      leaveBalance: 20,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("create") // create, edit, view
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    matricule: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    site: "",
    hireDate: "",
    birthDate: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    status: "active",
    salary: "",
    contractType: "CDI",
    manager: "",
    skills: [],
    education: [],
    experience: "",
  })

  const handleModalOpen = (type, employee = null) => {
    setModalType(type)
    setSelectedEmployee(employee)

    if (type === "create") {
      setFormData({
        matricule: `EMP${String(employees.length + 1).padStart(3, "0")}`,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        site: "",
        hireDate: new Date().toISOString().split("T")[0],
        birthDate: "",
        address: "",
        emergencyContact: { name: "", phone: "", relation: "" },
        status: "active",
        salary: "",
        contractType: "CDI",
        manager: "",
        skills: [],
        education: [],
        experience: "",
      })
    } else if (employee) {
      setFormData({ ...employee })
    }

    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (modalType === "create") {
        const newEmployee = {
          id: employees.length + 1,
          ...formData,
          salary: Number.parseFloat(formData.salary),
          performance: Math.floor(Math.random() * 30) + 70,
          leaveBalance: 25,
        }
        setEmployees([...employees, newEmployee])
      } else if (modalType === "edit") {
        setEmployees(
          employees.map((emp) =>
            emp.id === selectedEmployee.id ? { ...emp, ...formData, salary: Number.parseFloat(formData.salary) } : emp,
          ),
        )
      }
      setShowModal(false)
      setLoading(false)
    }, 1000)
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(filter.toLowerCase()) ||
      emp.position.toLowerCase().includes(filter.toLowerCase()) ||
      emp.department.toLowerCase().includes(filter.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    return status === "active" ? <Badge bg="success">Actif</Badge> : <Badge bg="danger">Inactif</Badge>
  }

  const getPerformanceBadge = (performance) => {
    if (performance >= 90) return <Badge bg="success">Excellent</Badge>
    if (performance >= 80) return <Badge bg="primary">Très bien</Badge>
    if (performance >= 70) return <Badge bg="warning">Bien</Badge>
    return <Badge bg="danger">À améliorer</Badge>
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
          <PersonBadge className="me-2" />
          Gestion des Employés
        </h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            <Download className="me-1" />
            Exporter
          </Button>
          <Button variant="outline-secondary" size="sm">
            <Upload className="me-1" />
            Importer
          </Button>
          <Button variant="primary" onClick={() => handleModalOpen("create")}>
            <Plus className="me-1" />
            Nouvel Employé
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{employees.length}</h3>
              <small className="text-muted">Total Employés</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{employees.filter((e) => e.status === "active").length}</h3>
              <small className="text-muted">Actifs</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{employees.filter((e) => e.contractType === "CDD").length}</h3>
              <small className="text-muted">CDD</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">
                {Math.round(employees.reduce((acc, e) => acc + e.performance, 0) / employees.length)}%
              </h3>
              <small className="text-muted">Performance Moyenne</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtres et recherche */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom, matricule, poste..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">Tous les départements</option>
                <option value="Contrôle fiscal">Contrôle fiscal</option>
                <option value="Operations">Opérations</option>
                <option value="Finance">Finance</option>
                <option value="IT">Informatique</option>
                <option value="RH">Ressources Humaines</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tableau des employés */}
      <Card className="shadow-sm border-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Employé</th>
                <th>Poste</th>
                <th>Département</th>
                <th>Performance</th>
                <th>Salaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="align-middle">
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-3">
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </div>
                      <div>
                        <div className="fw-bold">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <small className="text-muted">{employee.matricule}</small>
                      </div>
                    </div>
                  </td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <ProgressBar
                        now={employee.performance}
                        style={{ width: "60px", height: "8px" }}
                        className="me-2"
                      />
                      <small>{employee.performance}%</small>
                    </div>
                    {getPerformanceBadge(employee.performance)}
                  </td>
                  <td>{formatSalary(employee.salary)}</td>
                  <td>{getStatusBadge(employee.status)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleModalOpen("view", employee)}
                        title="Voir"
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleModalOpen("edit", employee)}
                        title="Modifier"
                      >
                        <Pencil />
                      </Button>
                      <Button variant="outline-danger" size="sm" title="Supprimer">
                        <Trash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modal Employé */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" && "Nouvel Employé"}
            {modalType === "edit" && "Modifier Employé"}
            {modalType === "view" && "Détails Employé"}
          </Modal.Title>
        </Modal.Header>

        {modalType === "view" && selectedEmployee ? (
          <Modal.Body>
            <Tabs defaultActiveKey="general" className="mb-3">
              <Tab eventKey="general" title="Informations Générales">
                <Row className="g-3">
                  <Col md={6}>
                    <strong>Matricule:</strong> {selectedEmployee.matricule}
                  </Col>
                  <Col md={6}>
                    <strong>Nom complet:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {selectedEmployee.email}
                  </Col>
                  <Col md={6}>
                    <strong>Téléphone:</strong> {selectedEmployee.phone}
                  </Col>
                  <Col md={6}>
                    <strong>Date de naissance:</strong> {selectedEmployee.birthDate}
                  </Col>
                  <Col md={6}>
                    <strong>Adresse:</strong> {selectedEmployee.address}
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="professional" title="Informations Professionnelles">
                <Row className="g-3">
                  <Col md={6}>
                    <strong>Poste:</strong> {selectedEmployee.position}
                  </Col>
                  <Col md={6}>
                    <strong>Département:</strong> {selectedEmployee.department}
                  </Col>
                  <Col md={6}>
                    <strong>Site:</strong> {selectedEmployee.site}
                  </Col>
                  <Col md={6}>
                    <strong>Manager:</strong> {selectedEmployee.manager}
                  </Col>
                  <Col md={6}>
                    <strong>Date d'embauche:</strong> {selectedEmployee.hireDate}
                  </Col>
                  <Col md={6}>
                    <strong>Type de contrat:</strong> {selectedEmployee.contractType}
                  </Col>
                  <Col md={6}>
                    <strong>Salaire:</strong> {formatSalary(selectedEmployee.salary)}
                  </Col>
                  <Col md={6}>
                    <strong>Performance:</strong> {selectedEmployee.performance}%
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="emergency" title="Contact d'Urgence">
                <Row className="g-3">
                  <Col md={6}>
                    <strong>Nom:</strong> {selectedEmployee.emergencyContact?.name}
                  </Col>
                  <Col md={6}>
                    <strong>Téléphone:</strong> {selectedEmployee.emergencyContact?.phone}
                  </Col>
                  <Col md={6}>
                    <strong>Relation:</strong> {selectedEmployee.emergencyContact?.relation}
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Modal.Body>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Tabs defaultActiveKey="general" className="mb-3">
                <Tab eventKey="general" title="Informations Générales">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Matricule</Form.Label>
                        <Form.Control
                          type="text"
                          name="matricule"
                          value={formData.matricule}
                          onChange={handleInputChange}
                          required
                          disabled={modalType === "edit"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Statut</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                          <option value="active">Actif</option>
                          <option value="inactive">Inactif</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date de naissance</Form.Label>
                        <Form.Control
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="professional" title="Informations Professionnelles">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Poste</Form.Label>
                        <Form.Control
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Département</Form.Label>
                        <Form.Select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
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
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Site</Form.Label>
                        <Form.Select name="site" value={formData.site} onChange={handleInputChange} required>
                          <option value="">Sélectionner un site</option>
                          <option value="Kinshasa">Kinshasa</option>
                          <option value="Lubumbashi">Lubumbashi</option>
                          <option value="Goma">Goma</option>
                          <option value="Bukavu">Bukavu</option>
                          <option value="Kisangani">Kisangani</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Manager</Form.Label>
                        <Form.Control
                          type="text"
                          name="manager"
                          value={formData.manager}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date d'embauche</Form.Label>
                        <Form.Control
                          type="date"
                          name="hireDate"
                          value={formData.hireDate}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Type de contrat</Form.Label>
                        <Form.Select name="contractType" value={formData.contractType} onChange={handleInputChange}>
                          <option value="CDI">CDI</option>
                          <option value="CDD">CDD</option>
                          <option value="Intérim">Intérim</option>
                          <option value="Stage">Stage</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Salaire (FC)</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            required
                            min="0"
                          />
                          <InputGroup.Text>FC</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="emergency" title="Contact d'Urgence">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nom du contact</Form.Label>
                        <Form.Control
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact?.name || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Téléphone du contact</Form.Label>
                        <Form.Control
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact?.phone || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Relation</Form.Label>
                        <Form.Select
                          name="emergencyContact.relation"
                          value={formData.emergencyContact?.relation || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Sélectionner une relation</option>
                          <option value="Époux/Épouse">Époux/Épouse</option>
                          <option value="Père">Père</option>
                          <option value="Mère">Mère</option>
                          <option value="Frère">Frère</option>
                          <option value="Sœur">Sœur</option>
                          <option value="Ami(e)">Ami(e)</option>
                          <option value="Autre">Autre</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
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

      <style jsx>{`
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default EmployeeManagement
