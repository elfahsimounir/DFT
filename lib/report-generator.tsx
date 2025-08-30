export interface ReportData {
  id: string
  companyName: string
  supplierName: string
  invoiceFile?: string
  invoiceUrl?: string
  riskScore: number
  riskLevel: string
  criteria: {
    subcontractingRate: number
    companySize: number
    fiscalHistory: number
    supplierCount: number
    invoiceVolume: number
    operationComplexity: number
  }
  recommendations: string[]
  aiMessage: string
  confidence: number
  createdAt: string
}

export function generateCSVReport(data: ReportData): string {
  const csvContent = [
    ["Champ", "Valeur"],
    ["ID Analyse", data.id],
    ["Entreprise", data.companyName],
    ["Fournisseur", data.supplierName],
    ["Fichier/URL", data.invoiceFile || data.invoiceUrl || "N/A"],
    ["Score de Risque", `${data.riskScore}/12`],
    ["Niveau de Risque", data.riskLevel],
    ["Taux de Sous-traitance", `${data.criteria.subcontractingRate}/2`],
    ["Taille Entreprise", `${data.criteria.companySize}/2`],
    ["Antécédents Fiscaux", `${data.criteria.fiscalHistory}/2`],
    ["Nombre Fournisseurs", `${data.criteria.supplierCount}/2`],
    ["Volume Factures", `${data.criteria.invoiceVolume}/2`],
    ["Complexité Opérations", `${data.criteria.operationComplexity}/2`],
    ["Confiance IA", `${data.confidence}%`],
    ["Message IA", data.aiMessage],
    ["Date Analyse", new Date(data.createdAt).toLocaleString("fr-FR")],
    ["Recommandations", data.recommendations.join(" | ")],
  ]

  return csvContent.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

export function generatePDFReport(data: ReportData): string {
  // Simulation d'un contenu PDF en HTML pour démonstration
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rapport d'Analyse TVA - ${data.companyName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .section { margin: 20px 0; }
    .risk-high { color: #dc2626; }
    .risk-moderate { color: #ea580c; }
    .risk-low { color: #16a34a; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rapport d'Analyse de Fraude TVA</h1>
    <p>Généré le ${new Date(data.createdAt).toLocaleString("fr-FR")}</p>
  </div>
  
  <div class="section">
    <h2>Informations Générales</h2>
    <table>
      <tr><th>Entreprise</th><td>${data.companyName}</td></tr>
      <tr><th>Fournisseur</th><td>${data.supplierName}</td></tr>
      <tr><th>Document</th><td>${data.invoiceFile || data.invoiceUrl || "N/A"}</td></tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Résultat de l'Analyse</h2>
    <table>
      <tr><th>Score de Risque</th><td class="risk-${data.riskLevel === "élevé" ? "high" : data.riskLevel === "modéré" ? "moderate" : "low"}">${data.riskScore}/12 (${data.riskLevel})</td></tr>
      <tr><th>Confiance IA</th><td>${data.confidence}%</td></tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Grille d'Évaluation</h2>
    <table>
      <tr><th>Critère</th><th>Score</th><th>Max</th></tr>
      <tr><td>Taux de Sous-traitance</td><td>${data.criteria.subcontractingRate}</td><td>2</td></tr>
      <tr><td>Taille de l'Entreprise</td><td>${data.criteria.companySize}</td><td>2</td></tr>
      <tr><td>Antécédents Fiscaux</td><td>${data.criteria.fiscalHistory}</td><td>2</td></tr>
      <tr><td>Nombre de Fournisseurs</td><td>${data.criteria.supplierCount}</td><td>2</td></tr>
      <tr><td>Volume de Factures</td><td>${data.criteria.invoiceVolume}</td><td>2</td></tr>
      <tr><td>Complexité des Opérations</td><td>${data.criteria.operationComplexity}</td><td>2</td></tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Analyse IA</h2>
    <p>${data.aiMessage}</p>
  </div>
  
  <div class="section">
    <h2>Recommandations</h2>
    <ul>
      ${data.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
    </ul>
  </div>
</body>
</html>
  `
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
