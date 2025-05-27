"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CashCoin, FileEarmarkText, PersonBadge, Archive, BarChart, ArrowRepeat } from "react-bootstrap-icons"
import { fetchDeclarations } from "../redux/actions/declarationActions"
import { useNotifications } from "../hooks/useNotifications"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { declarations } = useSelector((state) => state.declaration)
  const { showNotification } = useNotifications()

  useEffect(() => {
    dispatch(fetchDeclarations())
  }, [dispatch])

  // Statistiques réelles de l'estampillage
  const stats = [
    {
      title: "Revenus Total",
      value: "2,450,000 FC",
      subtitle: "+12% ce mois",
      icon: CashCoin,
      type: "cpu", // Utilise le style CPU pour la couleur cyan
    },
    {
      title: "Déclarations",
      value: declarations.length.toString(),
      subtitle: `${declarations.filter((d) => d.status === "pending").length} en attente`,
      icon: FileEarmarkText,
      type: "memory", // Utilise le style memory pour la couleur violette
    },
    {
      title: "OPG Actifs",
      value: "24",
      subtitle: "3 nouveaux ce mois",
      icon: PersonBadge,
      type: "network", // Utilise le style network pour la couleur orange
    },
    {
      title: "Documents Archivés",
      value: "152",
      subtitle: "18 cette semaine",
      icon: Archive,
      type: "storage", // Utilise le style storage
    },
  ]

  const testNotification = () => {
    const notification = {
      id: Date.now(),
      title: "Test de notification",
      message: "Ceci est une notification de test du système",
      type: "info",
      createdAt: new Date().toISOString(),
      read: false,
    }
    showNotification(notification)
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>
            <BarChart size={32} style={{ marginRight: "0.5rem", color: "#00bcd4" }} />
            Aperçu du Système d'Estampillage
          </h1>
        </div>
        <div className="page-actions">
          <div className="live-indicator">
            <div className="live-dot"></div>
            LIVE
          </div>
          <button className="header-action" title="Actualiser" onClick={() => dispatch(fetchDeclarations())}>
            <ArrowRepeat size={18} />
          </button>
        </div>
      </div>

      {/* Metrics Grid - Statistiques d'estampillage */}
      <div className="metrics-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="metric-card">
              <div className={`metric-icon ${stat.type}`}>
                <IconComponent size={24} />
              </div>
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.title}</div>
              <div className="metric-subtitle">{stat.subtitle}</div>
            </div>
          )
        })}
      </div>

      {/* Charts Section - Données d'estampillage */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Évolution des Revenus</div>
          <div className="chart-tabs">
            <button className="chart-tab active">Revenus</button>
            <button className="chart-tab">Déclarations</button>
            <button className="chart-tab">OPGs</button>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot cpu"></div>
              Revenus
            </div>
            <div className="legend-item">
              <div className="legend-dot memory"></div>
              Déclarations
            </div>
            <div className="legend-item">
              <div className="legend-dot network"></div>
              OPGs
            </div>
          </div>
        </div>

        {/* Graphique simulé pour les données d'estampillage */}
        <div className="performance-chart">
          <div className="chart-y-axis">
            <span>5M FC</span>
            <span>4M FC</span>
            <span>3M FC</span>
            <span>2M FC</span>
            <span>1M FC</span>
          </div>
          <div className="chart-area">
            <div className="chart-bars">
              {/* Simulation des revenus mensuels */}
              {[
                { revenus: 60, declarations: 45, opgs: 80 },
                { revenus: 75, declarations: 55, opgs: 70 },
                { revenus: 45, declarations: 65, opgs: 85 },
                { revenus: 85, declarations: 40, opgs: 75 },
                { revenus: 70, declarations: 70, opgs: 90 },
                { revenus: 90, declarations: 50, opgs: 65 },
                { revenus: 65, declarations: 80, opgs: 95 },
                { revenus: 95, declarations: 35, opgs: 70 },
                { revenus: 80, declarations: 60, opgs: 85 },
                { revenus: 55, declarations: 75, opgs: 80 },
                { revenus: 75, declarations: 45, opgs: 75 },
                { revenus: 85, declarations: 85, opgs: 90 },
              ].map((data, i) => (
                <div key={i} className="chart-bar-group">
                  <div
                    className="chart-bar cpu"
                    style={{
                      height: `${data.revenus}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                    title={`Revenus: ${data.revenus}%`}
                  ></div>
                  <div
                    className="chart-bar memory"
                    style={{
                      height: `${data.declarations}%`,
                      animationDelay: `${i * 0.1 + 0.05}s`,
                    }}
                    title={`Déclarations: ${data.declarations}%`}
                  ></div>
                  <div
                    className="chart-bar network"
                    style={{
                      height: `${data.opgs}%`,
                      animationDelay: `${i * 0.1 + 0.1}s`,
                    }}
                    title={`OPGs: ${data.opgs}%`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section des activités récentes */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Activité Récente</div>
        </div>
        <div style={{ padding: "1rem 0" }}>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon cpu">
                <FileEarmarkText size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Nouvelle déclaration #D-2023-001</div>
                <div className="activity-subtitle">Il y a 2 heures</div>
              </div>
              <div className="activity-status pending">En attente</div>
            </div>
            <div className="activity-item">
              <div className="activity-icon memory">
                <PersonBadge size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Nouvel OPG créé: OPG Nord-Est</div>
                <div className="activity-subtitle">Il y a 4 heures</div>
              </div>
              <div className="activity-status success">Actif</div>
            </div>
            <div className="activity-item">
              <div className="activity-icon network">
                <Archive size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Document archivé #DOC-2023-156</div>
                <div className="activity-subtitle">Il y a 6 heures</div>
              </div>
              <div className="activity-status success">Archivé</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
