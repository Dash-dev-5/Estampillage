"use client"

import { Sun, Moon } from "react-bootstrap-icons"
import { useTheme } from "../../contexts/ThemeContext"

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      className="header-action"
      onClick={toggleTheme}
      title={isDark ? "Mode clair" : "Mode sombre"}
      style={{
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        padding: "0.5rem",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        transition: "var(--transition)",
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
