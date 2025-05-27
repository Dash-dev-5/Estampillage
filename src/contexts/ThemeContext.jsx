"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    return saved ? saved === "dark" : true // Par défaut sombre
  })

  const theme = isDark ? "dark" : "light"

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
    // Aussi ajouter une classe pour Bootstrap si nécessaire
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Export du contexte pour les cas où on en a besoin
export { ThemeContext }
