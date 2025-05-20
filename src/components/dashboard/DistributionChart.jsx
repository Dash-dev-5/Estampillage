"use client"

import { Card } from "react-bootstrap"
import { Chart } from "react-chartjs-2"

const DistributionChart = ({ data, options }) => {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white border-0 py-3">
        <h5 className="mb-0">Distribution des Revenus</h5>
      </Card.Header>
      <Card.Body>
        <Chart type="doughnut" data={data} options={options} />
      </Card.Body>
    </Card>
  )
}

export default DistributionChart
