"use client"

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
  Activity,
  Gear, // Added import
  PeopleFill,
  // People
} from "react-bootstrap-icons"
import { isAdmin, isDG, canCreateDeclaration, canCreatePerception, canManageValuePrints } from "../../utils/permissions"

const SideNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <Activity size={24} />
          ESTAMPILLAGE
        </Link>
      </div>

      <nav className="sidebar-content">
        <div className="nav-item">
          <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
            <House size={18} />
            Tableau de bord
          </Link>
        </div>

        {canCreateDeclaration(user) && (
          <div className="nav-item">
            <Link to="/declaration" className={`nav-link ${isActive("/declaration") ? "active" : ""}`}>
              <FileEarmarkText size={18} />
              Déclarations
            </Link>
          </div>
        )}

        {canCreatePerception(user) && (
          <div className="nav-item">
            <Link to="/note-perception" className={`nav-link ${isActive("/note-perception") ? "active" : ""}`}>
              <Receipt size={18} />
              Notes de Perception
            </Link>
          </div>
        )}

        {canManageValuePrints(user) && (
          <div className="nav-item">
            <Link
              to="/value-print-management"
              className={`nav-link ${isActive("/value-print-management") ? "active" : ""}`}
            >
              <FileEarmarkRuled size={18} />
              Imprimés de Valeur
            </Link>
          </div>
        )}

        {isAdmin(user) && (
          <div className="nav-item">
            <Link to="/user-management" className={`nav-link ${isActive("/user-management") ? "active" : ""}`}>
              <People size={18} />
              Utilisateurs
            </Link>
          </div>
        )}

        {(isAdmin(user) || isDG(user)) && (
          <div className="nav-item">
            <Link to="/opg-management" className={`nav-link ${isActive("/opg-management") ? "active" : ""}`}>
              <PersonBadge size={18} />
              OPGs
            </Link>
          </div>
        )}

        <div className="nav-item">
          <Link to="/subject-management" className={`nav-link ${isActive("/subject-management") ? "active" : ""}`}>
            <Building size={18} />
            Assujettis
          </Link>
        </div>

        {(isAdmin(user) || isDG(user)) && (
          <div className="nav-item">
            <Link
              to="/personnel-management"
              className={`nav-link ${isActive("/personnel-management") ? "active" : ""}`}
            >
              <People size={18} />
              Personnel
            </Link>
          </div>
        )}

        <div className="nav-item">
          <Link to="/settings" className={`nav-link ${isActive("/settings") ? "active" : ""}`}>
            <Gear size={18} />
            Paramètres
          </Link>
        </div>
        {(isAdmin(user) || isDG(user)) && (
          <div className="nav-item">
            <Link to="/audit-log" className={`nav-link ${isActive("/audit-log") ? "active" : ""}`}>
              <ClockHistory size={18} />
              Journal d'audit
            </Link>
          </div>
        )}
        {(isAdmin(user) || isDG(user)) && (
          <div className="nav-item">
            <Link to="/human-resources" className={`nav-link ${isActive("/human-resources") ? "active" : ""}`}>
              <PeopleFill size={18} />
               HR & RH
            </Link>
          </div>
        )}

        <div className="nav-item">
          <Link to="/archives" className={`nav-link ${isActive("/archives") ? "active" : ""}`}>
            <Archive size={18} />
            Archives
          </Link>
        </div>
        <div className="nav-item" style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ width: "100%", border: "none", background: "none", textAlign: "left" }}
          >
            <BoxArrowRight size={18} />
            Déconnexion
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default SideNav
