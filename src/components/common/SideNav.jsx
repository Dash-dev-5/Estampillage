"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Nav, Button, Collapse, Badge } from "react-bootstrap"
import {
  BoxArrowRight,
  Speedometer2,
  FileEarmarkText,
  Receipt,
  PeopleFill,
  PersonBadge,
  FileEarmarkBarGraph,
  Archive,
  BoxArrowInDown,
  Bell,
  GearFill,
  ChevronDown,
  ChevronUp,
} from "react-bootstrap-icons"
import { logout } from "../../redux/actions/authActions"
import NotificationDropdown from "./NotificationDropdown"

const SideNav = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { notifications, unreadCount } = useSelector((state) => state.notification)

  const [expandedMenu, setExpandedMenu] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const isAdmin = user && user.role === "admin"
  const isDG = user && user.role === "dg"
  const isOPG = user && user.role === "opg"

  const menuItems = [
    {
      title: "Tableau de bord",
      path: "/dashboard",
      icon: <Speedometer2 className="me-2" />,
      allowed: true,
    },
    {
      title: "Déclarations",
      path: "/declaration",
      icon: <FileEarmarkText className="me-2" />,
      allowed: true,
    },
    {
      title: "Notes de perception",
      path: "/note-perception",
      icon: <Receipt className="me-2" />,
      allowed: true,
    },
    {
      title: "Gestion OPG",
      path: "/opg-management",
      icon: <PersonBadge className="me-2" />,
      allowed: isAdmin || isDG,
    },
    {
      title: "Administration",
      icon: <GearFill className="me-2" />,
      allowed: isAdmin,
      subMenus: [
        {
          title: "Gestion des utilisateurs",
          path: "/user-management",
          icon: <PeopleFill className="me-2" />,
        },
        {
          title: "Gestion des assujettis",
          path: "/subject-management",
          icon: <PeopleFill className="me-2" />,
        },
      ],
    },
    {
      title: "Journal d'activité",
      path: "/audit-log",
      icon: <FileEarmarkBarGraph className="me-2" />,
      allowed: isAdmin || isDG,
    },
    {
      title: "Archives",
      path: "/archives",
      icon: <Archive className="me-2" />,
      allowed: isAdmin || isDG,
    },
  ]

  return (
    <div className="bg-dark text-light d-flex flex-column h-100 border-end" style={{ width: 260 }}>
      <div className="p-3 d-flex align-items-center justify-content-center border-bottom border-secondary mb-2">
        <h4 className="m-0 fw-bold d-flex align-items-center">
          <BoxArrowInDown className="me-2" />
          {import.meta.env.REACT_APP_NAME || "ESTAMPILLAGE"}
        </h4>
      </div>

      {user && (
        <div className="px-3 py-2 text-center mb-3">
          <h6 className="mb-1">
            {user.firstName} {user.lastName}
          </h6>
          <span className="badge bg-primary">
            {user.role === "admin" ? "Administrateur" : user.role === "dg" ? "Direction Générale" : "OPG"}
          </span>
        </div>
      )}

      <Nav className="flex-column mb-auto px-2">
        {menuItems.map(
          (item, index) =>
            item.allowed &&
            (item.subMenus ? (
              <div key={index} className="mb-1">
                <Button
                  variant="link"
                  className="text-light text-decoration-none w-100 text-start d-flex align-items-center px-3 py-2 hover-lift"
                  onClick={() => toggleMenu(item.title)}
                >
                  {item.icon}
                  {item.title}
                  {expandedMenu === item.title ? (
                    <ChevronUp className="ms-auto" />
                  ) : (
                    <ChevronDown className="ms-auto" />
                  )}
                </Button>
                <Collapse in={expandedMenu === item.title}>
                  <div>
                    {item.subMenus.map((subItem, subIndex) => (
                      <Nav.Link
                        key={subIndex}
                        as={Link}
                        to={subItem.path}
                        className={`text-light d-flex align-items-center px-3 py-2 ms-3 ${
                          location.pathname === subItem.path ? "bg-primary rounded" : "hover-lift"
                        }`}
                      >
                        {subItem.icon}
                        {subItem.title}
                      </Nav.Link>
                    ))}
                  </div>
                </Collapse>
              </div>
            ) : (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`text-light d-flex align-items-center px-3 py-2 mb-1 ${
                  location.pathname === item.path ? "bg-primary rounded" : "hover-lift"
                }`}
              >
                {item.icon}
                {item.title}
              </Nav.Link>
            )),
        )}
      </Nav>

      <div className="mt-auto p-3 border-top border-secondary">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="link"
            className="text-light d-flex align-items-center p-0 position-relative hover-lift"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline-light"
            size="sm"
            className="d-flex align-items-center hover-lift"
            onClick={handleLogout}
          >
            <BoxArrowRight className="me-2" /> Déconnexion
          </Button>
        </div>

        {showNotifications && (
          <NotificationDropdown notifications={notifications} onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  )
}

export default SideNav
