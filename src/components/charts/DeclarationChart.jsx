"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const DeclarationChart = ({ isDark = false }) => {
  const data = {
    labels: ["Approuvées", "En attente", "Rejetées", "En révision"],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: ["#00bcd4", "#ffc107", "#dc3545", "#6c757d"],
        borderColor: isDark ? "#1a1a1a" : "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#e0e0e0" : "#333333",
          font: {
            size: 12,
            family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#ffffff" : "#333333",
        bodyColor: isDark ? "#e0e0e0" : "#666666",
        borderColor: "#00bcd4",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: "60%",
  }

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default DeclarationChart
