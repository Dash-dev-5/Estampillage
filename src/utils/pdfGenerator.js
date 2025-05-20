import { jsPDF } from "jspdf"
import "jspdf-autotable"

// Génère un PDF pour une déclaration
export const generateDeclarationPDF = (declaration) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text("Déclaration d'Estampillage", 105, 15, { align: "center" })

  // Add info
  doc.setFontSize(12)
  doc.text("Numéro de déclaration: " + declaration.id, 14, 30)
  doc.text("Date: " + new Date(declaration.createdAt).toLocaleDateString(), 14, 37)
  doc.text("Assujetti: " + declaration.subjectName, 14, 44)
  doc.text("Status: " + declaration.status, 14, 51)

  // Add table
  doc.autoTable({
    startY: 60,
    head: [["Description", "Quantité", "Sacs", "Taux", "Montant"]],
    body: [
      [
        "Déclaration d'estampillage",
        declaration.quantityDeclared,
        declaration.bagsStamped,
        declaration.taxRate * 100 + "%",
        declaration.amountDue.toLocaleString() + " FC",
      ],
    ],
    theme: "grid",
  })

  // Add totals
  const finalY = doc.lastAutoTable.finalY
  doc.text("Montant Total: " + declaration.amountDue.toLocaleString() + " FC", 130, finalY + 10)

  // Add footer
  doc.setFontSize(10)
  doc.text(process.env.REACT_APP_NAME || "ESTAMPILLAGE", 105, 280, { align: "center" })

  // Save the PDF
  doc.save("declaration-" + declaration.id + ".pdf")
}

// Génère un PDF pour une note de perception
export const generatePerceptionPDF = (perception) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text("Note de Perception", 105, 15, { align: "center" })

  // Add info
  doc.setFontSize(12)
  doc.text("Numéro de note: " + perception.id, 14, 30)
  doc.text("Date: " + new Date(perception.createdAt).toLocaleDateString(), 14, 37)
  doc.text("Assujetti: " + perception.subjectName, 14, 44)
  doc.text("Numéro de valeur: " + perception.valueNumber, 14, 51)
  doc.text("Déclaration associée: #" + perception.declarationId, 14, 58)

  // Add table
  doc.autoTable({
    startY: 65,
    head: [["Description", "Montant"]],
    body: [["Montant à percevoir", perception.amount.toLocaleString() + " FC"]],
    theme: "grid",
  })

  // Add signature area
  const finalY = doc.lastAutoTable.finalY
  doc.line(14, finalY + 30, 80, finalY + 30)
  doc.text("Signature OPG", 14, finalY + 35)

  doc.line(120, finalY + 30, 196, finalY + 30)
  doc.text("Signature Assujetti", 120, finalY + 35)

  // Add footer
  doc.setFontSize(10)
  doc.text(process.env.REACT_APP_NAME || "ESTAMPILLAGE", 105, 280, { align: "center" })

  // Save the PDF
  doc.save("note-perception-" + perception.id + ".pdf")
}

// Exporte les données au format CSV
export const exportToCSV = (data, headers, filename) => {
  const csvContent = [headers, ...data.map((row) => Object.values(row))].map((row) => row.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
