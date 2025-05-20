import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Form, InputGroup, Badge, Button } from "react-bootstrap"
import { FileEarmarkBarGraph, Search, Filter, Download, Calendar } from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchAudits } from "../redux/actions/auditActions"

const AuditLog = () => {
  const dispatch = useDispatch()
  const { audits, loading, error } = useSelector((state) => state.audit)
  const [filter, setFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    dispatch(fetchAudits())
  }, [dispatch])

  const getActionBadge = (action) => {
    switch (action) {
      case "LOGIN":
      case "LOGOUT":
        return <Badge bg="info">{action}</Badge>
      case "CREATE_DECLARATION":
      case "CREATE_PERCEPTION":
      case "CREATE_OPG":
      case "CREATE_USER":
      case "CREATE_SUBJECT":
        return <Badge bg="success">{action}</Badge>
      case "UPDATE_DECLARATION":
      case "UPDATE_PERCEPTION":
      case "UPDATE_OPG":
      case "UPDATE_USER":
      case "UPDATE_SUBJECT":
        return <Badge bg="primary">{action}</Badge>
      case "DELETE_DECLARATION":
      case "DELETE_PERCEPTION":
      case "DELETE_OPG":
      case "DELETE_USER":
      case "DELETE_SUBJECT":
        return <Badge bg="danger">{action}</Badge>
      case "ARCHIVE_DOCUMENT":
      case "RESTORE_DOCUMENT":
        return <Badge bg="warning">{action}</Badge>
      default:
        return <Badge bg="secondary">{action}</Badge>
    }
  }

  const filteredAudits = audits.filter((audit) => {
    const matchesText = audit.details.toLowerCase().includes(filter.toLowerCase())
    const matchesAction = !actionFilter || audit.action === actionFilter
    const matchesDate = !dateFilter || new Date(audit.timestamp).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()

    return matchesText && matchesAction && matchesDate
  })

  const uniqueActions = [...new Set(audits.map((audit) => audit.action))]

  const exportToCSV = () => {
    const headers = ["ID", "Action", "User ID", "Details", "Timestamp"]
    const csvData = filteredAudits.map((audit) => [
      audit.id,
      audit.action,
      audit.userId,
      audit.details,
      new Date(audit.timestamp).toLocaleString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `audit-log-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Journal d'Activité"
          subtitle="Consultez l'historique des actions effectuées dans le système"
          icon={<FileEarmarkBarGraph className="me-2" size={24} />}
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
                    placeholder="Rechercher dans les détails..."
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
                  <Form.Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                    <option value="">Toutes les actions</option>
                    {uniqueActions.map((action) => (
                      <option key={action} value={action}>
                        {action}
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
                  <Form.Control
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2} className="text-end">
                <Button variant="outline-primary" onClick={exportToCSV} className="w-100">
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
                  <th>Date & Heure</th>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement du journal d'activité...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAudits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Aucune activité trouvée
                    </td>
                  </tr>
                ) : (
                  filteredAudits.map((audit) => (
                    <tr key={audit.id} className="align-middle hover-lift">
                      <td>{audit.id}</td>
                      <td>{new Date(audit.timestamp).toLocaleString()}</td>
                      <td>{getActionBadge(audit.action)}</td>
                      <td>User #{audit.userId}</td>
                      <td>{audit.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

export default AuditLog
