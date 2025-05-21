"use client"

import { useSelector } from "react-redux"
import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { List, Bell } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notification)
  // const [sidebarVisible, setSidebarVisible] = useState(toggleSidebar)

  return (
    <Navbar bg="white" className="border-bottom shadow-sm br-40 py-2 rounded-2xl"
     style={{
    border: '1px solid #ddd',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    marginBottom:12
  }}
    >
      <Container fluid className="px-3">

        <Button variant="light" className="d-flex align-items-center" onClick={toggleSidebar}>
          <List size={24} />
        </Button>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center">
          <img src="/logo.png" alt="Logo" height="30" className="d-none d-md-inline-block me-2" />
          <span className="d-none d-md-inline-block">{import.meta.env.REACT_APP_NAME || "ESTAMPILLAGE"}</span>
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center">
          <div className="d-md-none me-3 position-relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center">
            <div className="me-2 text-end d-none d-md-block">
              <small className="d-block text-muted">
                {user?.role === "admin" ? "Administrateur" : user?.role === "dg" ? "Direction Générale" : "OPG"}
              </small>
              <span className="fw-bold">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div
              className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
