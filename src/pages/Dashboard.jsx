"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Table, Alert, Badge, Button } from "react-bootstrap"
import {
  CashCoin,
  FileEarmarkText,
  PersonBadge,
  Archive,
  ExclamationTriangle,
  ArrowUpRight,
  Check2Circle,
  XCircle,
  Clock,
  Speedometer2,
} from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchDeclarations } from "../redux/actions/declarationActions"
import { Chart } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import { Link } from "react-router-dom"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { declarations } = useSelector((state) => state.declaration)
  const { notifications } = useSelector((state) => state.notification)

  const [revenueStats, setRevenueStats] = useState({
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Revenus",
        data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 125000, 150000, 160000, 180000],
        borderColor: "#0056b3",
        backgroundColor: "rgba(0, 86, 179, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  })

  const [distributionStats, setDistributionStats] = useState({
    labels: ["Entreprise", "DGRKC", "État"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#0056b3", "#6c757d", "#28a745"],
      },
    ],
  })

  useEffect(() => {
    dispatch(fetchDeclarations())

    // Simulate fetching additional data
    // This would normally come from API calls
  }, [dispatch])

  // Calculate statistics
  const totalRevenue = revenueStats.datasets[0].data.reduce((sum, value) => sum + value, 0)
  const pendingDeclarations = declarations.filter((d) => d.status === "pending").length
  const approvedDeclarations = declarations.filter((d) => d.status === "approved").length
  const rejectedDeclarations = declarations.filter((d) => d.status === "rejected").length

  // Charts options
  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} FC`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => value.toLocaleString() + " FC",
        },
      },
    },
  }

  const distributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning">
            <Clock className="me-1" /> En attente
          </Badge>
        )
      case "approved":
        return (
          <Badge bg="success">
            <Check2Circle className="me-1" /> Approuvé
          </Badge>
        )
      case "rejected":
        return (
          <Badge bg="danger">
            <XCircle className="me-1" /> Rejeté
          </Badge>
        )
      default:
        return <Badge bg="secondary">Inconnu</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title={`Bienvenue, ${user?.firstName} ${user?.lastName}`}
          subtitle="Voici votre aperçu du système d'estampillage"
          icon={<Speedometer2 className="me-2" size={24} />}
        />

        <Row className="g-3 mb-4">
          <Col md={6} xl={3}>
            <Card className="shadow-sm border-0 bg-primary text-white h-100 hover-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 mb-0">Revenue Total</h6>
                    <h3 className="mb-0">{totalRevenue.toLocaleString()} FC</h3>
                  </div>
                  <div className="rounded-circle bg-white bg-opacity-25 p-3">
                    <CashCoin size={24} />
                  </div>
                </div>
                <div className="mt-3 text-white-50">
                  <ArrowUpRight className="me-1" /> +10.5% depuis le mois dernier
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="shadow-sm border-0 h-100 hover-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Déclarations</h6>
                    <h3 className="mb-0">{declarations.length}</h3>
                  </div>
                  <div className="rounded-circle bg-success bg-opacity-25 p-3">
                    <FileEarmarkText size={24} className="text-success" />
                  </div>
                </div>
                <div className="mt-3 small">
                  <span className="text-success me-2">
                    <Check2Circle /> {approvedDeclarations} approuvées
                  </span>
                  <span className="text-warning me-2">
                    <Clock /> {pendingDeclarations} en attente
                  </span>
                  <span className="text-danger">
                    <XCircle /> {rejectedDeclarations} rejetées
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="shadow-sm border-0 h-100 hover-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">OPG Actifs</h6>
                    <h3 className="mb-0">24</h3>
                  </div>
                  <div className="rounded-circle bg-info bg-opacity-25 p-3">
                    <PersonBadge size={24} className="text-info" />
                  </div>
                </div>
                <div className="mt-3 text-muted">3 nouveaux OPG ce mois-ci</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="shadow-sm border-0 h-100 hover-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Documents Archivés</h6>
                    <h3 className="mb-0">152</h3>
                  </div>
                  <div className="rounded-circle bg-warning bg-opacity-25 p-3">
                    <Archive size={24} className="text-warning" />
                  </div>
                </div>
                <div className="mt-3 text-muted">18 nouveaux documents archivés cette semaine</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {notifications.filter((n) => !n.read).length > 0 && (
          <Alert variant="info" className="d-flex align-items-center mb-4 animate__animated animate__fadeIn shadow-sm">
            <ExclamationTriangle className="me-2" size={20} />
            <div className="flex-grow-1">
              Vous avez {notifications.filter((n) => !n.read).length} notification
              {notifications.filter((n) => !n.read).length > 1 ? "s" : ""} non lue
              {notifications.filter((n) => !n.read).length > 1 ? "s" : ""}
            </div>
          </Alert>
        )}

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Tendance des Revenus</h5>
              </Card.Header>
              <Card.Body>
                <Chart type="line" data={revenueStats} options={revenueChartOptions} height={350} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Distribution des Revenus</h5>
              </Card.Header>
              <Card.Body>
                <Chart type="doughnut" data={distributionStats} options={distributionChartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Déclarations Récentes</h5>
                <Link to="/declaration" className="btn btn-sm btn-outline-primary hover-lift">
                  Voir tout
                </Link>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive>
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Assujetti</th>
                      <th>Montant</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declarations.slice(0, 5).map((declaration) => (
                      <tr key={declaration.id}>
                        <td>#{declaration.id}</td>
                        <td>{declaration.subjectName}</td>
                        <td>{declaration.amountDue.toLocaleString()} FC</td>
                        <td>{getStatusBadge(declaration.status)}</td>
                        <td>{new Date(declaration.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {declarations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-3">
                          Aucune déclaration trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Notifications Récentes</h5>
                <Button variant="outline-primary" size="sm" className="hover-lift">
                  Voir tout
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action ${notification.read ? "bg-light" : ""}`}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{notification.title}</h6>
                        <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">{notification.message}</p>
                      <small className={`${notification.read ? "text-muted" : "text-primary"}`}>
                        {notification.read ? "Lu" : "Non lu"}
                      </small>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="list-group-item text-center py-3">Aucune notification</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  )
}

export default Dashboard
