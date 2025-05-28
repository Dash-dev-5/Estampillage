"use client"

import { useState } from "react"
import { Row, Col, Card, Nav, Tab } from "react-bootstrap"
import { People, FileText, Calendar, CalendarCheck, CurrencyDollar, Star, Diagram3 } from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"

// Import des composants RH
import EmployeeManagement from "../components/hr/EmployeeManagement"
import ContractManagement from "../components/hr/ContractManagement"
import AttendanceManagement from "../components/hr/AttendanceManagement"
import LeaveManagement from "../components/hr/LeaveManagement"
import PayrollManagement from "../components/hr/PayrollManagement"
import EvaluationManagement from "../components/hr/EvaluationManagement"
import OrganizationChart from "../components/hr/OrganizationChart"

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("employees")

  const hrModules = [
    {
      key: "employees",
      title: "Employés",
      icon: <People size={20} />,
      description: "Gestion des dossiers employés",
      component: <EmployeeManagement />,
    },
    {
      key: "contracts",
      title: "Contrats",
      icon: <FileText size={20} />,
      description: "Suivi des contrats de travail",
      component: <ContractManagement />,
    },
    {
      key: "attendance",
      title: "Présences",
      icon: <Calendar size={20} />,
      description: "Présences et absences",
      component: <AttendanceManagement />,
    },
    {
      key: "leaves",
      title: "Congés",
      icon: <CalendarCheck size={20} />,
      description: "Demandes de congés",
      component: <LeaveManagement />,
    },
    {
      key: "payroll",
      title: "Paie",
      icon: <CurrencyDollar size={20} />,
      description: "Bulletins de paie",
      component: <PayrollManagement />,
    },
    {
      key: "evaluations",
      title: "Évaluations",
      icon: <Star size={20} />,
      description: "Évaluations de performance",
      component: <EvaluationManagement />,
    },
    {
      key: "organization",
      title: "Organigramme",
      icon: <Diagram3 size={20} />,
      description: "Structure organisationnelle",
      component: <OrganizationChart />,
    },
  ]

  return (
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Ressources Humaines"
          subtitle="Système de gestion complète des ressources humaines"
          icon={<People className="me-2" size={24} />}
        />

        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Row className="g-0">
                <Col lg={3} className="border-end">
                  <div className="p-3">
                    <h6 className="text-muted mb-3">MODULES RH</h6>
                    <Nav variant="pills" className="flex-column">
                      {hrModules.map((module) => (
                        <Nav.Item key={module.key} className="mb-2">
                          <Nav.Link eventKey={module.key} className="d-flex align-items-start text-start">
                            <div className="me-3 mt-1">{module.icon}</div>
                            <div>
                              <div className="fw-semibold">{module.title}</div>
                              <small className="text-muted">{module.description}</small>
                            </div>
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </div>
                </Col>
                <Col lg={9}>
                  <Tab.Content className="p-4">
                    {hrModules.map((module) => (
                      <Tab.Pane key={module.key} eventKey={module.key}>
                        {module.component}
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default HumanResources
