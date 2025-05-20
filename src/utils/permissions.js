// Vérifie si l'utilisateur a un rôle spécifique
export const hasRole = (user, role) => {
  if (!user) return false
  return user.role === role
}

// Vérifie si l'utilisateur est un administrateur
export const isAdmin = (user) => {
  return hasRole(user, "admin")
}

// Vérifie si l'utilisateur est de la Direction Générale
export const isDG = (user) => {
  return hasRole(user, "dg")
}

// Vérifie si l'utilisateur est un OPG
export const isOPG = (user) => {
  return hasRole(user, "opg")
}

// Vérifie si l'utilisateur est un agent de la division de l'industrie
export const isIndustryAgent = (user) => {
  return hasRole(user, "industry_agent")
}

// Vérifie si l'utilisateur est un comptable
export const isComptable = (user) => {
  return hasRole(user, "comptable")
}

// Vérifie si l'utilisateur a une permission spécifique
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false
  if (user.permissions.includes("all")) return true
  return user.permissions.includes(permission)
}

// Vérifie si l'utilisateur peut accéder à une route spécifique
export const canAccessRoute = (user, route) => {
  if (!user) return false

  // Routes accessibles à tous les utilisateurs authentifiés
  const publicRoutes = ["/dashboard"]
  if (publicRoutes.includes(route)) return true

  // Routes spécifiques par rôle
  const roleRoutes = {
    admin: [
      "/user-management",
      "/subject-management",
      "/opg-management",
      "/audit-log",
      "/archives",
      "/declaration",
      "/note-perception",
      "/value-print-management",
    ],
    dg: ["/opg-management", "/audit-log", "/archives", "/declaration", "/note-perception", "/value-print-management"],
    opg: ["/note-perception", "/value-print-management"],
    industry_agent: ["/declaration"],
    comptable: ["/archives"],
  }

  return roleRoutes[user.role]?.includes(route) || false
}

// Vérifie si l'utilisateur peut créer des déclarations
export const canCreateDeclaration = (user) => {
  if (!user) return false
  return ["admin", "dg", "industry_agent"].includes(user.role)
}

// Vérifie si l'utilisateur peut créer des notes de perception
export const canCreatePerception = (user) => {
  if (!user) return false
  return ["admin", "dg", "opg"].includes(user.role)
}

// Vérifie si l'utilisateur peut gérer les imprimés de valeur
export const canManageValuePrints = (user) => {
  if (!user) return false
  return ["admin", "dg", "opg"].includes(user.role)
}
