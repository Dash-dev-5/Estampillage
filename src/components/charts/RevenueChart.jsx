"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const RevenueChart = ({ isDark = false }) => {
  const data = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Revenus (FC)",
        data: [
          1200000, 1900000, 1500000, 2200000, 2800000, 2400000, 3100000, 2900000, 3400000, 3800000, 4200000, 4500000,
        ],
        borderColor: "#00bcd4",
        backgroundColor: isDark ? "rgba(0, 188, 212, 0.1)" : "rgba(0, 188, 212, 0.05)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#00bcd4",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        callbacks: {
          label: (context) => `Revenus: ${context.raw.toLocaleString()} FC`,
        },
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
          callback: (value) => `${(value / 1000000).toFixed(1)}M FC`,
        },
      },
    },
  }

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default RevenueChart
