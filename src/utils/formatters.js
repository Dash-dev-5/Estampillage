// Formate un nombre en monnaie
export const formatCurrency = (value, currency = "FC") => {
  if (value === null || value === undefined) return "0 " + currency
  return value.toLocaleString() + " " + currency
}

// Formate une date
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, options)
}

// Formate une date avec l'heure
export const formatDateTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Formate un pourcentage
export const formatPercent = (value) => {
  if (value === null || value === undefined) return "0%"
  return (value * 100).toFixed(2) + "%"
}

// Formate un statut
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "approved":
      return "Approuvé"
    case "rejected":
      return "Rejeté"
    case "validated":
      return "Validé"
    case "active":
      return "Actif"
    case "inactive":
      return "Inactif"
    default:
      return status
  }
}

// Formate un rôle
export const formatRole = (role) => {
  switch (role) {
    case "admin":
      return "Administrateur"
    case "dg":
      return "Direction Générale"
    case "opg":
      return "OPG"
    case "comptable":
      return "Comptable"
    default:
      return role
  }
}
