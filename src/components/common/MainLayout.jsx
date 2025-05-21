"use client"

import { useState, useEffect } from "react"
import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import Header from "./Header"
import SideNav from "./SideNav"
import LoadingScreen from "./LoadingScreen"
import { House, FileEarmarkText, Receipt, FileEarmarkRuled, People, Gear, Bell } from "react-bootstrap-icons"

const MainLayout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)

  const toggleSidebar = () => {
    setSidebarVisible(e => !e)
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992
      // setIsMobile(mobile)
      if (sidebarVisible) {
        setSidebarVisible(false)
      } else if (!sidebarVisible) {
        setSidebarVisible(true)
      }
    }

    // handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [sidebarVisible])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="main-layout">
      {sidebarVisible ? <SideNav /> : (<> </>)}

      <div className="main-content" style={{ marginLeft: sidebarVisible && !isMobile ? "250px" : "0" }}>
        <Header toggleSidebar={toggleSidebar} />

        <Container fluid className="p-0">
          <div className="glass-card p-4 mb-4 scale-in">{children}</div>
        </Container>

        <div className="mac-dock">
          <a href="/dashboard" className="dock-item">
            <House />
          </a>
          <a href="/declaration" className="dock-item">
            <FileEarmarkText />
          </a>
          <a href="/note-perception" className="dock-item">
            <Receipt />
          </a>
          <a href="/value-print-management" className="dock-item">
            <FileEarmarkRuled />
          </a>
          <a href="/user-management" className="dock-item">
            <People />
          </a>
          <a href="#notifications" className="dock-item">
            <Bell />
          </a>
          <a href="#settings" className="dock-item">
            <Gear />
          </a>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
