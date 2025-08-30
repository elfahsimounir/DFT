"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, Building, Truck } from "lucide-react"
import { getAnalyses, getCompanies, getSuppliers, type Analysis } from "@/lib/storage"

export function ReportsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  useEffect(() => {
    setAnalyses(getAnalyses())
    setCompanies(getCompanies())
    setSuppliers(getSuppliers())
  }, [])

  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    return company?.name || "Entreprise inconnue"
  }

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    return supplier?.name || "Fournisseur inconnu"
  }

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      getCompanyName(analysis.companyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSupplierName(analysis.supplierId).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || analysis.riskLevel === filterType

    const analysisDate = new Date(analysis.createdAt)
    const now = new Date()
    let matchesPeriod = true

    if (selectedPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesPeriod = analysisDate >= weekAgo
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesPeriod = analysisDate >= monthAgo
    }

    return matchesSearch && matchesType && matchesPeriod
  })

  const generateReport = (type: "company" | "supplier" | "global") => {
    let reportData = ""

    if (type === "global") {
      const stats = {
        total: analyses.length,
        faible: analyses.filter((a) => a.riskLevel === "faible").length,
        modéré: analyses.filter((a) => a.riskLevel === "modéré").length,
        élevé: analyses.filter((a) => a.riskLevel === "élevé").length,
      }

      reportData = `RAPPORT GLOBAL DE DÉTECTION DE FRAUDE TVA
Généré le: ${new Date().toLocaleDateString("fr-FR")}

STATISTIQUES GÉNÉRALES:
- Total des analyses: ${stats.total}
- Risque faible: ${stats.faible} (${Math.round((stats.faible / stats.total) * 100)}%)
- Risque modéré: ${stats.modéré} (${Math.round((stats.modéré / stats.total) * 100)}%)
- Risque élevé: ${stats.élevé} (${Math.round((stats.élevé / stats.total) * 100)}%)

ANALYSES DÉTAILLÉES:
${analyses
  .map(
    (a) => `
- ${getCompanyName(a.companyId)} / ${getSupplierName(a.supplierId)}
  Score: ${a.riskScore}/12 (${a.riskLevel})
  Date: ${new Date(a.createdAt).toLocaleDateString("fr-FR")}
  Recommandations: ${a.recommendations.join(", ")}
`,
  )
  .join("")}
`
    }

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rapport-${type}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "faible":
        return "bg-green-100 text-green-800"
      case "modéré":
        return "bg-yellow-100 text-yellow-800"
      case "élevé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-muted-foreground">Rapports détaillés par facture et par entreprise</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => generateReport("global")} className="gap-2">
            <Download className="h-4 w-4" />
            Rapport Global
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analyses.length}</p>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-sm text-muted-foreground">Entreprises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
                <p className="text-sm text-muted-foreground">Fournisseurs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{analyses.filter((a) => a.riskLevel === "élevé").length}</p>
                <p className="text-sm text-muted-foreground">Risques Élevés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par entreprise ou fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Niveau de risque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="faible">Risque faible</SelectItem>
                <SelectItem value="modéré">Risque modéré</SelectItem>
                <SelectItem value="élevé">Risque élevé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyses Récentes</CardTitle>
          <CardDescription>{filteredAnalyses.length} analyse(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel}</Badge>
                    <span className="font-medium">Score: {analysis.riskScore}/12</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(analysis.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">Entreprise</p>
                    <p className="text-sm text-muted-foreground">{getCompanyName(analysis.companyId)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fournisseur</p>
                    <p className="text-sm text-muted-foreground">{getSupplierName(analysis.supplierId)}</p>
                  </div>
                </div>

                {analysis.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Recommandations</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {filteredAnalyses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune analyse trouvée avec les critères sélectionnés
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
