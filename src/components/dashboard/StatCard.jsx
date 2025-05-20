"use client"

import { Card } from "react-bootstrap"

const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card className={`shadow-sm border-0 h-100 hover-lift ${color ? `bg-${color}` : ""}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className={color ? "text-white-50 mb-0" : "text-muted mb-0"}>{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`rounded-circle ${color ? "bg-white bg-opacity-25" : "bg-light"} p-3`}>{icon}</div>
        </div>
        {subtitle && <div className={`mt-3 ${color ? "text-white-50" : "text-muted"}`}>{subtitle}</div>}
      </Card.Body>
    </Card>
  )
}

export default StatCard
