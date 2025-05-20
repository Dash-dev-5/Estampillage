"use client"

import { Card } from "react-bootstrap"
import { Chart } from "react-chartjs-2"

const RevenueChart = ({ data, options }) => {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white border-0 py-3">
        <h5 className="mb-0">Tendance des Revenus</h5>
      </Card.Header>
      <Card.Body>
        <Chart type="line" data={data} options={options} height={350} />
      </Card.Body>
    </Card>
  )
}

export default RevenueChart
