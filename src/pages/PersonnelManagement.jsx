"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Badge, InputGroup } from "react-bootstrap"
import { People, Search, Pencil, Trash, Eye, PersonBadge, Telephone, Envelope } from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"

const PersonnelManagement = () => {
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state) => state.auth)

  // Données simulées du personnel
  const [personnel, setPersonnel] = useState([
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
      status: "active",
      salary: 800000,
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
      status: "active",
      salary: 1200000,
    },
    {
      id: 3,
      matricule: "EMP003",
      firstName: "Pierre",
      lastName: "Mukendi",
      email: "pierre.mukendi@estampillage.com",
      phone: "+243 555 123 456",
      position: "Comptable",
      department: "Finance",
      site: "Kinshasa",
      hireDate: "2021-06-10",
      status: "active",
      salary: 950000,
    },
    {
      id: 4,
      matricule: "EMP004",
      firstName: "Grace",
      lastName: "Mbuyi",
      email: "grace.mbuyi@estampillage.com",
      phone: "+243 777 888 999",
      position: "Secrétaire",
      department: "Administration",
      site: "Goma",
      hireDate: "2022-02-01",
      status: "inactive",
      salary: 600000,
    },
  ])

  // États
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
    status: "active",
    salary: "",
  })

  const handleCreateModalOpen = () => {
    setFormData({
      matricule: `EMP${String(personnel.length + 1).padStart(3, "0")}`,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      site: "",
      hireDate: new Date().toISOString().split("T")[0],
      status: "active",
      salary: "",
    })
    setShowCreateModal(true)
  }

  const handleEditModalOpen = (employee) => {
    setSelectedEmployee(employee)
    setFormData({
      matricule: employee.matricule,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      site: employee.site,
      hireDate: employee.hireDate,
      status: employee.status,
      salary: employee.salary.toString(),
    })
    setShowEditModal(true)
  }

  const handleViewModalOpen = (employee) => {
    setSelectedEmployee(employee)
    setShowViewModal(true)
  }

  const handleDeleteModalOpen = (employee) => {
    setSelectedEmployee(employee)
    setShowDeleteModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (showCreateModal) {
        const newEmployee = {
          id: personnel.length + 1,
          ...formData,
          salary: Number.parseFloat(formData.salary),
        }
        setPersonnel([...personnel, newEmployee])
        setShowCreateModal(false)
      } else if (showEditModal) {
        setPersonnel(
          personnel.map((emp) =>
            emp.id === selectedEmployee.id ? { ...emp, ...formData, salary: Number.parseFloat(formData.salary) } : emp,
          ),
        )
        setShowEditModal(false)
      }
      setLoading(false)
    }, 1000)
  }

  const handleDelete = () => {
    setLoading(true)
    setTimeout(() => {
      setPersonnel(personnel.filter((emp) => emp.id !== selectedEmployee.id))
      setShowDeleteModal(false)
      setLoading(false)
    }, 500)
  }

  const filteredPersonnel = personnel.filter(
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

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "CDF",
      minimumFractionDigits: 0,
    }).format(salary)
  }

  return (
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Gestion du Personnel"
          subtitle="Gérez les employés et leur information"
          icon={<People className="me-2" size={24} />}
          actionButton
          actionText="Nouvel Employé"
          actionOnClick={handleCreateModalOpen}
        />

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
              <Col md={6}>
                <div className="d-flex justify-content-end">
                  <Badge bg="primary" className="me-2">
                    Total: {personnel.length}
                  </Badge>
                  <Badge bg="success" className="me-2">
                    Actifs: {personnel.filter((p) => p.status === "active").length}
                  </Badge>
                  <Badge bg="danger">Inactifs: {personnel.filter((p) => p.status === "inactive").length}</Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Matricule</th>
                  <th>Nom complet</th>
                  <th>Poste</th>
                  <th>Département</th>
                  <th>Site</th>
                  <th>Salaire</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement du personnel...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPersonnel.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Aucun employé trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPersonnel.map((employee) => (
                    <tr key={employee.id} className="align-middle hover-lift">
                      <td>
                        <strong>{employee.matricule}</strong>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <small className="text-muted">{employee.email}</small>
                        </div>
                      </td>
                      <td>{employee.position}</td>
                      <td>{employee.department}</td>
                      <td>{employee.site}</td>
                      <td>{formatSalary(employee.salary)}</td>
                      <td>{getStatusBadge(employee.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewModalOpen(employee)}
                            title="Voir"
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEditModalOpen(employee)}
                            title="Modifier"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteModalOpen(employee)}
                            title="Supprimer"
                          >
                            <Trash />
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

      {/* Modal Créer/Modifier */}
      <Modal
        show={showCreateModal || showEditModal}
        onHide={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
        }}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{showCreateModal ? "Nouvel Employé" : "Modifier Employé"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="matricule">
                  <Form.Label>Matricule</Form.Label>
                  <Form.Control
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleInputChange}
                    required
                    disabled={showEditModal}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="firstName">
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
                <Form.Group controlId="lastName">
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
                <Form.Group controlId="email">
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
                <Form.Group controlId="phone">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="position">
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
                <Form.Group controlId="department">
                  <Form.Label>Département</Form.Label>
                  <Form.Select name="department" value={formData.department} onChange={handleInputChange} required>
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
                <Form.Group controlId="site">
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
                <Form.Group controlId="hireDate">
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
              <Col md={12}>
                <Form.Group controlId="salary">
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
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setShowEditModal(false)
              }}
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : showCreateModal ? "Créer" : "Modifier"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Voir */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'Employé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <Row className="g-3">
              <Col md={12}>
                <div className="text-center mb-4">
                  <PersonBadge size={64} className="text-primary mb-2" />
                  <h4>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h4>
                  <p className="text-muted">{selectedEmployee.position}</p>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </Col>
              <Col md={6}>
                <strong>Matricule:</strong> {selectedEmployee.matricule}
              </Col>
              <Col md={6}>
                <strong>Département:</strong> {selectedEmployee.department}
              </Col>
              <Col md={6}>
                <strong>Site:</strong> {selectedEmployee.site}
              </Col>
              <Col md={6}>
                <strong>Date d'embauche:</strong> {new Date(selectedEmployee.hireDate).toLocaleDateString()}
              </Col>
              <Col md={12}>
                <strong>Email:</strong>
                <a href={`mailto:${selectedEmployee.email}`} className="ms-2">
                  <Envelope className="me-1" />
                  {selectedEmployee.email}
                </a>
              </Col>
              <Col md={12}>
                <strong>Téléphone:</strong>
                <a href={`tel:${selectedEmployee.phone}`} className="ms-2">
                  <Telephone className="me-1" />
                  {selectedEmployee.phone}
                </a>
              </Col>
              <Col md={12}>
                <strong>Salaire:</strong> {formatSalary(selectedEmployee.salary)}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Supprimer */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <>
              <p>
                Êtes-vous sûr de vouloir supprimer l'employé{" "}
                <strong>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </strong>{" "}
                ({selectedEmployee.matricule}) ?
              </p>
              <Alert variant="warning">
                Cette action est irréversible. Toutes les données associées à cet employé seront supprimées.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PersonnelManagement
