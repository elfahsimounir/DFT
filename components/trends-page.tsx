"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react"
import { getAnalyses, getCompanyRiskStats, getSupplierRiskStats } from "@/lib/storage"

export function TrendsPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [companyStats, setCompanyStats] = useState<any[]>([])
  const [supplierStats, setSupplierStats] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  useEffect(() => {
    setAnalyses(getAnalyses())
    setCompanyStats(getCompanyRiskStats())
    setSupplierStats(getSupplierRiskStats())
  }, [])

  // Grouper les analyses par mois
  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: { total: number; faible: number; modéré: number; élevé: number } } = {}

    analyses.forEach((analysis) => {
      const date = new Date(analysis.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, faible: 0, modéré: 0, élevé: 0 }
      }

      monthlyData[monthKey].total++
      monthlyData[monthKey][analysis.riskLevel as keyof (typeof monthlyData)[string]]++
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        monthName: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        ...data,
      }))
  }

  const monthlyTrends = getMonthlyTrends()

  // Identifier les entreprises et fournisseurs les plus à risque
  const highRiskCompanies = companyStats
    .filter((c) => c.riskLevel === "élevé" || c.avgRiskScore > 7)
    .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
    .slice(0, 5)

  const highRiskSuppliers = supplierStats
    .filter((s) => s.riskLevel === "élevé" || s.avgRiskScore > 7)
    .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
    .slice(0, 5)

  // Calculer les tendances
  const calculateTrend = (data: any[]) => {
    if (data.length < 2) return { direction: "stable", percentage: 0 }

    const recent = data.slice(-3).reduce((sum, item) => sum + item.élevé, 0)
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + item.élevé, 0)

    if (previous === 0) return { direction: "stable", percentage: 0 }

    const percentage = Math.round(((recent - previous) / previous) * 100)
    const direction = percentage > 5 ? "up" : percentage < -5 ? "down" : "stable"

    return { direction, percentage: Math.abs(percentage) }
  }

  const riskTrend = calculateTrend(monthlyTrends)

  const getRiskBadgeColor = (level: string) => {
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
          <h1 className="text-3xl font-bold">Analyse des Tendances</h1>
          <p className="text-muted-foreground">Évolution des risques de fraude dans le temps</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Période d'analyse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 derniers mois</SelectItem>
            <SelectItem value="6months">6 derniers mois</SelectItem>
            <SelectItem value="12months">12 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Indicateurs de tendance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {riskTrend.direction === "up" ? (
                <TrendingUp className="h-8 w-8 text-red-600" />
              ) : riskTrend.direction === "down" ? (
                <TrendingDown className="h-8 w-8 text-green-600" />
              ) : (
                <Calendar className="h-8 w-8 text-blue-600" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {riskTrend.direction === "stable" ? "Stable" : `${riskTrend.percentage}%`}
                </p>
                <p className="text-sm text-muted-foreground">Évolution Risques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{highRiskCompanies.length}</p>
                <p className="text-sm text-muted-foreground">Entreprises à Risque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{highRiskSuppliers.length}</p>
                <p className="text-sm text-muted-foreground">Fournisseurs à Risque</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Mensuelle des Risques</CardTitle>
          <CardDescription>Distribution des niveaux de risque par mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyTrends.map((month) => (
              <div key={month.month} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{month.monthName}</h4>
                  <span className="text-sm text-muted-foreground">{month.total} analyse(s)</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{month.faible}</div>
                    <div className="text-sm text-muted-foreground">Faible</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{month.modéré}</div>
                    <div className="text-sm text-muted-foreground">Modéré</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{month.élevé}</div>
                    <div className="text-sm text-muted-foreground">Élevé</div>
                  </div>
                </div>
              </div>
            ))}

            {monthlyTrends.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune donnée disponible pour la période sélectionnée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Entreprises les plus à risque */}
      <Card>
        <CardHeader>
          <CardTitle>Entreprises les Plus à Risque</CardTitle>
          <CardDescription>Classement par score de risque moyen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highRiskCompanies.map((company, index) => (
              <div key={company.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{company.name}</span>
                    <Badge className={getRiskBadgeColor(company.riskLevel)}>{company.riskLevel}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Score moyen: {company.avgRiskScore}/12 • {company.analysisCount} analyse(s)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{Math.round((company.avgRiskScore / 12) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Risque</div>
                </div>
              </div>
            ))}

            {highRiskCompanies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Aucune entreprise à haut risque identifiée</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fournisseurs les plus à risque */}
      <Card>
        <CardHeader>
          <CardTitle>Fournisseurs les Plus à Risque</CardTitle>
          <CardDescription>Classement par score de risque moyen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highRiskSuppliers.map((supplier, index) => (
              <div key={supplier.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{supplier.name}</span>
                    <Badge className={getRiskBadgeColor(supplier.riskLevel)}>{supplier.riskLevel}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Score moyen: {supplier.avgRiskScore}/12 • {supplier.analysisCount} analyse(s)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round((supplier.avgRiskScore / 12) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Risque</div>
                </div>
              </div>
            ))}

            {highRiskSuppliers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Aucun fournisseur à haut risque identifié</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
