// Valide un email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

// Valide un numéro de téléphone
export const validatePhone = (phone) => {
  const re = /^\+?[0-9]{8,15}$/
  return re.test(String(phone))
}

// Valide un mot de passe
export const validatePassword = (password) => {
  // Au moins 8 caractères, une majuscule, une minuscule et un chiffre
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return re.test(String(password))
}

// Valide un ID fiscal
export const validateTaxId = (taxId) => {
  // Format simple pour l'exemple
  const re = /^[A-Z0-9]{5,10}$/
  return re.test(String(taxId))
}

// Valide un formulaire de déclaration
export const validateDeclarationForm = (formData) => {
  const errors = {}

  if (!formData.subjectId) {
    errors.subjectId = "L'ID de l'assujetti est requis"
  }

  if (!formData.subjectName) {
    errors.subjectName = "Le nom de l'assujetti est requis"
  }

  if (!formData.quantityDeclared || formData.quantityDeclared <= 0) {
    errors.quantityDeclared = "La quantité déclarée doit être supérieure à 0"
  }

  if (!formData.bagsStamped || formData.bagsStamped <= 0) {
    errors.bagsStamped = "Le nombre de sacs estampillés doit être supérieur à 0"
  }

  if (!formData.taxRate) {
    errors.taxRate = "Le taux d'imposition est requis"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Valide un formulaire d'utilisateur
export const validateUserForm = (formData, isEdit = false) => {
  const errors = {}

  if (!formData.username) {
    errors.username = "Le nom d'utilisateur est requis"
  }

  if (!formData.firstName) {
    errors.firstName = "Le prénom est requis"
  }

  if (!formData.lastName) {
    errors.lastName = "Le nom est requis"
  }

  if (!formData.email) {
    errors.email = "L'email est requis"
  } else if (!validateEmail(formData.email)) {
    errors.email = "L'email n'est pas valide"
  }

  if (!formData.role) {
    errors.role = "Le rôle est requis"
  }

  if (!formData.site) {
    errors.site = "Le site est requis"
  }

  if (!isEdit) {
    if (!formData.password) {
      errors.password = "Le mot de passe est requis"
    } else if (!validatePassword(formData.password)) {
      errors.password =
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "La confirmation du mot de passe est requise"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
