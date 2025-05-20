"use client"

import { useState, useEffect } from "react"
import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import Header from "./Header"
import SideNav from "./SideNav"

const MainLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true)
  const location = useLocation()

  // Reset sidebar visibility on route change (for mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowSidebar(false)
    }
  }, [location.pathname])

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <div
          className={`sidebar d-md-flex ${showSidebar ? "d-flex" : "d-none"}`}
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            zIndex: 1000,
            transition: "transform 0.3s ease",
          }}
        >
          <SideNav />
        </div>

        <div
          className="main-content"
          style={{
            marginLeft: showSidebar ? "260px" : "0",
            transition: "margin-left 0.3s ease",
            width: "100%",
          }}
        >
          <Header toggleSidebar={toggleSidebar} />
          <Container fluid className="py-4 px-4">
            {children}
          </Container>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
