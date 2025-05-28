"use client"

import React from "react"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Search, Bell, Gear, Shield, ArrowRepeat, Download, Terminal } from "react-bootstrap-icons"
import SideNav from "./SideNav"
import Header from "./Header"

const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mettre à jour l'heure toutes les secondes
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="app-container">
      <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {/* Header */}
        <Header />
       

        {/* Contenu principal */}
        <div className="content-wrapper">
          {/* <div className="dashboard-grid"> */}
            {/* <div className="main-dashboard"> */}
              {children}
              {/* </div> */}

            {/* Sidebar droite */}
            {/* <div className="sidebar-right">
              <div className="sidebar-section">
                <h3>System Time</h3>
                <div className="system-time">
                  <div className="time-display">{formatTime(currentTime)}</div>
                  <div className="date-display">{formatDate(currentTime)}</div>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="system-info">
                  <div className="info-item">
                    <div className="info-label">Uptime</div>
                    <div className="info-value">14d 06:42:18</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Time Zone</div>
                    <div className="info-value">UTC+01:00</div>
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <div className="quick-action">
                    <div className="quick-action-icon">
                      <Shield />
                    </div>
                    <div className="quick-action-label">Security Scan</div>
                  </div>
                  <div className="quick-action">
                    <div className="quick-action-icon">
                      <ArrowRepeat />
                    </div>
                    <div className="quick-action-label">Sync Data</div>
                  </div>
                  <div className="quick-action">
                    <div className="quick-action-icon">
                      <Download />
                    </div>
                    <div className="quick-action-label">Backup</div>
                  </div>
                  <div className="quick-action">
                    <div className="quick-action-icon">
                      <Terminal />
                    </div>
                    <div className="quick-action-label">Console</div>
                  </div>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </main>
    </div>
  )
}

export default MainLayout
