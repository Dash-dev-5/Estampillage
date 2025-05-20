import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Badge, InputGroup } from "react-bootstrap"
import {
  PeopleFill,
  Search,
  PlusLg,
  Pencil,
  Trash,
  Eye,
  Key,
  CheckCircle,
  XCircle,
  GeoAlt,
  Telephone,
  Envelope,
  Building,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchUsers, createUser, updateUser, deleteUser, resetPassword } from "../redux/actions/userActions"

const UserManagement = () => {
  // Redux hooks
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector((state) => state.user)
  const { user: currentUser } = useSelector((state) => state.auth)

  // State management
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [filter, setFilter] = useState("")
  
  // Form states
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    site: "",
    password: "",
    confirmPassword: "",
    status: "active",
  })
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  })

  // Effects
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Handler functions
  const handleCreateModalOpen = () => {
    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      site: "",
      password: "",
      confirmPassword: "",
      status: "active",
    })
    setShowCreateModal(true)
  }

  const handleEditModalOpen = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      site: user.site,
      status: user.status,
    })
    setShowEditModal(true)
  }

  const handleViewModalOpen = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleDeleteModalOpen = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleResetPasswordModalOpen = (user) => {
    setSelectedUser(user)
    setPasswordData({
      password: "",
      confirmPassword: "",
    })
    setShowResetPasswordModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (showCreateModal) {
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas")
        return
      }
      dispatch(createUser(formData))
      setShowCreateModal(false)
    } else if (showEditModal) {
      dispatch(updateUser(selectedUser.id, formData))
      setShowEditModal(false)
    }
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (passwordData.password !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    dispatch(resetPassword(selectedUser.id, passwordData))
    setShowResetPasswordModal(false)
  }

  const handleDelete = () => {
    dispatch(deleteUser(selectedUser.id))
    setShowDeleteModal(false)
  }

  // Utility functions
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.role.toLowerCase().includes(filter.toLowerCase()),
  )

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Administrateur</Badge>
      case "dg":
        return <Badge bg="primary">Direction Générale</Badge>
      case "opg":
        return <Badge bg="success">OPG</Badge>
      case "comptable":
        return <Badge bg="info">Comptable</Badge>
      default:
        return <Badge bg="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge bg="success">
        <CheckCircle className="me-1" /> Actif
      </Badge>
    ) : (
      <Badge bg="danger">
        <XCircle className="me-1" /> Inactif
      </Badge>
    )
  }

  // Render
  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        {/* Page Title Section */}
        <PageTitle
          title="Gestion des Utilisateurs"
          subtitle="Gérez les utilisateurs du système"
          icon={<PeopleFill className="me-2" size={24} />}
          actionButton
          actionText="Nouvel Utilisateur"
          actionOnClick={handleCreateModalOpen}
        />

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="animate__animated animate__fadeIn">
            {error}
          </Alert>
        )}

        {/* Search Filter Card */}
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
                    placeholder="Rechercher par nom, email, rôle..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Nom d'utilisateur</th>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Site</th>
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
                        <span>Chargement des utilisateurs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="align-middle hover-lift">
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.site}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewModalOpen(user)}
                            title="Voir"
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEditModalOpen(user)}
                            title="Modifier"
                            disabled={currentUser.id === user.id}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleResetPasswordModalOpen(user)}
                            title="Réinitialiser mot de passe"
                          >
                            <Key />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteModalOpen(user)}
                            title="Supprimer"
                            disabled={currentUser.id === user.id}
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

        {/* Create User Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} backdrop="static" size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Nouvel Utilisateur</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="username">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
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
                  <Form.Group controlId="role">
                    <Form.Label>Rôle</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleInputChange} required>
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Administrateur</option>
                      <option value="dg">Direction Générale</option>
                      <option value="opg">OPG</option>
                      <option value="comptable">Comptable</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="site">
                    <Form.Label>Site</Form.Label>
                    <Form.Control
                      type="text"
                      name="site"
                      value={formData.site}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
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
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Créer Utilisateur
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Utilisateur</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="editUsername">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                    <Form.Text className="text-muted">Le nom d'utilisateur ne peut pas être modifié.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editEmail">
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
                  <Form.Group controlId="editFirstName">
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
                  <Form.Group controlId="editLastName">
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
                  <Form.Group controlId="editRole">
                    <Form.Label>Rôle</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleInputChange} required>
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Administrateur</option>
                      <option value="dg">Direction Générale</option>
                      <option value="opg">OPG</option>
                      <option value="comptable">Comptable</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editSite">
                    <Form.Label>Site</Form.Label>
                    <Form.Control
                      type="text"
                      name="site"
                      value={formData.site}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editStatus">
                    <Form.Label>Statut</Form.Label>
                    <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Mettre à jour
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* View User Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Détails de l'utilisateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <p><strong>Nom d'utilisateur:</strong> {selectedUser.username}</p>
                <p><strong>Nom complet:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Rôle:</strong> {selectedUser.role}</p>
                <p><strong>Site:</strong> {selectedUser.site}</p>
                <p><strong>Statut:</strong> {selectedUser.status}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete User Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.username}</strong> ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reset Password Modal */}
        <Modal show={showResetPasswordModal} onHide={() => setShowResetPasswordModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleResetPassword}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="resetPassword">
                <Form.Label>Nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmResetPassword">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowResetPasswordModal(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="warning">
                Réinitialiser
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  )
}

export default UserManagement