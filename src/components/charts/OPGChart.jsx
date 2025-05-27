"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const OPGChart = ({ isDark = false }) => {
  const data = {
    labels: ["OPG Nord", "OPG Sud", "OPG Est", "OPG Ouest", "OPG Centre"],
    datasets: [
      {
        label: "Déclarations traitées",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(0, 188, 212, 0.8)",
        borderColor: "#00bcd4",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Revenus générés (M FC)",
        data: [28, 48, 40, 19, 86],
        backgroundColor: "rgba(255, 193, 7, 0.8)",
        borderColor: "#ffc107",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e0e0e0" : "#333333",
          font: {
            size: 12,
            family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#ffffff" : "#333333",
        bodyColor: isDark ? "#e0e0e0" : "#666666",
        borderColor: "#00bcd4",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#e0e0e0" : "#666666",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#e0e0e0" : "#666666",
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default OPGChart
