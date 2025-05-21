"use client"

import { useState } from "react"
import { Nav, Button } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { logout } from "../../redux/actions/authActions"
import {
  House,
  FileEarmarkText,
  Receipt,
  People,
  PersonBadge,
  Building,
  ClockHistory,
  Archive,
  BoxArrowRight,
  FileEarmarkRuled,
} from "react-bootstrap-icons"
import { isAdmin, isDG, canCreateDeclaration, canCreatePerception, canManageValuePrints } from "../../utils/permissions"

const SideNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div
      className="h-100 d-flex flex-column mac-sidebar"
      style={{
        width: "220px",
        backgroundColor: "rgba(0, 0, 0, 0.28)",
        backdropFilter: "blur(20px)",
        position: "fixed",
        overflowY: "auto",
        zIndex: 1000,
        borderRight: "1px solid rgba(0,0,0,0.1)",
        height:`90vh`
      }}
    >
      {/* Traffic light buttons */}
      {/* <div className="d-flex p-2 ps-3 align-items-center">
        <div className="traffic-light red me-1"></div>
        <div className="traffic-light yellow me-1"></div>
        <div className="traffic-light green"></div>
      </div> */}

      <div className="p-3 " style={{ borderColor: "rgba(0,0,0,0.1) !important" }}>
        <h6 className="mb-0 text-dark fw-bold">Favoris</h6>
      </div>

      <Nav className="flex-column p-0 mac-nav">
        <Nav.Link
          as={Link}
          to="/dashboard"
          className={`rounded-0 d-flex align-items-center mac-nav-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          <House className="me-2 text-primary" size={16} /> Tableau de bord
        </Nav.Link>

        {canCreateDeclaration(user) && (
          <Nav.Link
            as={Link}
            to="/declaration"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${isActive("/declaration") ? "active" : ""}`}
          >
            <FileEarmarkText className="me-2 text-info" size={16} /> Déclarations
          </Nav.Link>
        )}

        {canCreatePerception(user) && (
          <Nav.Link
            as={Link}
            to="/note-perception"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${
              isActive("/note-perception") ? "active" : ""
            }`}
          >
            <Receipt className="me-2 text-success" size={16} /> Notes de Perception
          </Nav.Link>
        )}

        {canManageValuePrints(user) && (
          <Nav.Link
            as={Link}
            to="/value-print-management"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${
              isActive("/value-print-management") ? "active" : ""
            }`}
          >
            <FileEarmarkRuled className="me-2 text-warning" size={16} /> Imprimés de Valeur
          </Nav.Link>
        )}
      </Nav>

      <div className="p-3 border-bottom border-top mt-2" style={{ borderColor: "rgba(0,0,0,0.1) !important" }}>
        <h6 className="mb-0 text-dark fw-bold">Administration</h6>
      </div>

      <Nav className="flex-column p-0 mac-nav">
        {isAdmin(user) && (
          <Nav.Link
            as={Link}
            to="/user-management"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${
              isActive("/user-management") ? "active" : ""
            }`}
          >
            <People className="me-2 text-danger" size={16} /> Utilisateurs
          </Nav.Link>
        )}

        {(isAdmin(user) || isDG(user)) && (
          <Nav.Link
            as={Link}
            to="/opg-management"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${
              isActive("/opg-management") ? "active" : ""
            }`}
          >
            <PersonBadge className="me-2 text-secondary" size={16} /> OPGs
          </Nav.Link>
        )}

        <Nav.Link
          as={Link}
          to="/subject-management"
          className={`rounded-0 d-flex align-items-center mac-nav-link ${
            isActive("/subject-management") ? "active" : ""
          }`}
        >
          <Building className="me-2 text-primary" size={16} /> Assujettis
        </Nav.Link>

        {(isAdmin(user) || isDG(user)) && (
          <Nav.Link
            as={Link}
            to="/audit-log"
            className={`rounded-0 d-flex align-items-center mac-nav-link ${isActive("/audit-log") ? "active" : ""}`}
          >
            <ClockHistory className="me-2 text-info" size={16} /> Journal d'audit
          </Nav.Link>
        )}

        <Nav.Link
          as={Link}
          to="/archives"
          className={`rounded-0 d-flex align-items-center mac-nav-link ${isActive("/archives") ? "active" : ""}`}
        >
          <Archive className="me-2 text-success" size={16} /> Archives
        </Nav.Link>
      </Nav>

      <div className="p-3 border-bottom border-top mt-2" style={{ borderColor: "rgba(0,0,0,0.1) !important" }}>
        <h6 className="mb-0 text-dark fw-bold">Tags</h6>
      </div>

      <Nav className="flex-column p-0 mac-nav">
        <Nav.Link className="rounded-0 d-flex align-items-center mac-nav-link">
          <div
            className="me-2 rounded-circle"
            style={{ width: "12px", height: "12px", backgroundColor: "#FF6B6B" }}
          ></div>
          Urgent
        </Nav.Link>
        <Nav.Link className="rounded-0 d-flex align-items-center mac-nav-link">
          <div
            className="me-2 rounded-circle"
            style={{ width: "12px", height: "12px", backgroundColor: "#4ECDC4" }}
          ></div>
          En cours
        </Nav.Link>
        <Nav.Link className="rounded-0 d-flex align-items-center mac-nav-link">
          <div
            className="me-2 rounded-circle"
            style={{ width: "12px", height: "12px", backgroundColor: "#FFD166" }}
          ></div>
          À vérifier
        </Nav.Link>
      </Nav>

      <div className="mt-auto p-3 border-top" style={{ borderColor: "rgba(0,0,0,0.1) !important" }}>
        <Button
          variant="outline-dark"
          className="w-100 d-flex align-items-center justify-content-center mac-btn"
          onClick={handleLogout}
        >
          <BoxArrowRight className="me-2" /> Déconnexion
        </Button>
      </div>
    </div>
  )
}

export default SideNav
