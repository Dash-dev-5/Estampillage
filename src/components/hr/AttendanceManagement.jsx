"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup } from "react-bootstrap"
import { Calendar, Clock, CheckCircle, XCircle, Plus, Eye, Download, Filter, Search } from "react-bootstrap-icons"

const AttendanceManagement = () => {
  const [attendances, setAttendances] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: "Jean Dupont",
      date: "2024-05-27",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "present",
      hoursWorked: 8,
      overtime: 0,
      notes: "",
    },
    {
      id: 2,
      employeeId: 1,
      employeeName: "Jean Dupont",
      date: "2024-05-26",
      checkIn: "08:15",
      checkOut: "17:30",
      status: "late",
      hoursWorked: 8.25,
      overtime: 0.5,
      notes: "Retard de 15 minutes",
    },
    {
      id: 3,
      employeeId: 2,
      employeeName: "Marie Kabila",
      date: "2024-05-27",
      checkIn: null,
      checkOut: null,
      status: "absent",
      hoursWorked: 0,
      overtime: 0,
      notes: "Congé maladie",
      absenceType: "sick_leave",
    },
  ])

  const [absences, setAbsences] = useState([
    {
      id: 1,
      employeeId: 2,
      employeeName: "Marie Kabila",
      startDate: "2024-05-27",
      endDate: "2024-05-28",
      type: "sick_leave",
      reason: "Grippe",
      status: "approved",
      approvedBy: "Manager RH",
      documents: ["certificat_medical.pdf"],
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("attendance")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [filter, setFilter] = useState("")

  const absenceTypes = [
    { value: "sick_leave", label: "Congé maladie", color: "danger" },
    { value: "annual_leave", label: "Congé annuel", color: "success" },
    { value: "personal_leave", label: "Congé personnel", color: "info" },
    { value: "maternity_leave", label: "Congé maternité", color: "warning" },
    { value: "unauthorized", label: "Absence injustifiée", color: "dark" },
  ]

  const getStatusBadge = (status) => {
    const badges = {
      present: (
        <Badge bg="success">
          <CheckCircle className="me-1" />
          Présent
        </Badge>
      ),
      late: (
        <Badge bg="warning">
          <Clock className="me-1" />
          Retard
        </Badge>
      ),
      absent: (
        <Badge bg="danger">
          <XCircle className="me-1" />
          Absent
        </Badge>
      ),
      half_day: <Badge bg="info">Demi-journée</Badge>,
    }
    return badges[status] || <Badge bg="secondary">Inconnu</Badge>
  }

  const getAbsenceTypeBadge = (type) => {
    const absenceType = absenceTypes.find((t) => t.value === type)
    return absenceType ? (
      <Badge bg={absenceType.color}>{absenceType.label}</Badge>
    ) : (
      <Badge bg="secondary">{type}</Badge>
    )
  }

  const calculateAttendanceStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisMonth = today.substring(0, 7)

    const monthlyAttendances = attendances.filter((a) => a.date.startsWith(thisMonth))
    const totalDays = monthlyAttendances.length
    const presentDays = monthlyAttendances.filter((a) => a.status === "present").length
    const lateDays = monthlyAttendances.filter((a) => a.status === "late").length
    const absentDays = monthlyAttendances.filter((a) => a.status === "absent").length

    return { totalDays, presentDays, lateDays, absentDays }
  }

  const stats = calculateAttendanceStats()

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <Calendar className="me-2" />
          Présences & Absences
        </h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            <Download className="me-1" />
            Rapport
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="me-1" />
            Marquer Présence
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{stats.totalDays}</h3>
              <small className="text-muted">Jours ce mois</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{stats.presentDays}</h3>
              <small className="text-muted">Présents</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{stats.lateDays}</h3>
              <small className="text-muted">Retards</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-danger">{stats.absentDays}</h3>
              <small className="text-muted">Absents</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
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
                  placeholder="Rechercher un employé..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">Tous les statuts</option>
                <option value="present">Présent</option>
                <option value="late">Retard</option>
                <option value="absent">Absent</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" className="w-100">
                <Filter className="me-1" />
                Filtrer
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tableau des présences */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header>
          <h6 className="mb-0">Présences du {new Date(selectedDate).toLocaleDateString()}</h6>
        </Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Employé</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Heures travaillées</th>
                <th>Heures sup.</th>
                <th>Statut</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances
                .filter((a) => a.date === selectedDate)
                .filter((a) => a.employeeName.toLowerCase().includes(filter.toLowerCase()))
                .map((attendance) => (
                  <tr key={attendance.id} className="align-middle">
                    <td>
                      <div className="fw-bold">{attendance.employeeName}</div>
                    </td>
                    <td>{attendance.checkIn || "-"}</td>
                    <td>{attendance.checkOut || "-"}</td>
                    <td>{attendance.hoursWorked}h</td>
                    <td>{attendance.overtime}h</td>
                    <td>{getStatusBadge(attendance.status)}</td>
                    <td>
                      <small className="text-muted">{attendance.notes}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="outline-primary" size="sm" title="Voir">
                          <Eye />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Tableau des absences */}
      <Card className="shadow-sm border-0">
        <Card.Header>
          <h6 className="mb-0">Absences récentes</h6>
        </Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Employé</th>
                <th>Période</th>
                <th>Type</th>
                <th>Raison</th>
                <th>Statut</th>
                <th>Approuvé par</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id} className="align-middle">
                  <td>
                    <div className="fw-bold">{absence.employeeName}</div>
                  </td>
                  <td>
                    <div>
                      {new Date(absence.startDate).toLocaleDateString()}
                      {absence.endDate !== absence.startDate && (
                        <> → {new Date(absence.endDate).toLocaleDateString()}</>
                      )}
                    </div>
                  </td>
                  <td>{getAbsenceTypeBadge(absence.type)}</td>
                  <td>{absence.reason}</td>
                  <td>
                    <Badge bg={absence.status === "approved" ? "success" : "warning"}>
                      {absence.status === "approved" ? "Approuvé" : "En attente"}
                    </Badge>
                  </td>
                  <td>{absence.approvedBy || "-"}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" title="Voir">
                        <Eye />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modal Marquer Présence */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Marquer Présence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Employé</Form.Label>
                  <Form.Select required>
                    <option value="">Sélectionner un employé</option>
                    <option value="1">Jean Dupont</option>
                    <option value="2">Marie Kabila</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Heure d'arrivée</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Heure de départ</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Statut</Form.Label>
                  <Form.Select>
                    <option value="present">Présent</option>
                    <option value="late">Retard</option>
                    <option value="absent">Absent</option>
                    <option value="half_day">Demi-journée</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Heures supplémentaires</Form.Label>
                  <Form.Control type="number" min="0" step="0.5" defaultValue="0" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Notes optionnelles..." />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary">Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AttendanceManagement
