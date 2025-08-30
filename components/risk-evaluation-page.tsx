"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Shield } from "lucide-react"
import { getAnalyses, getCompanyRiskStats, getSupplierRiskStats } from "@/lib/storage"

export function RiskEvaluationPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [companyStats, setCompanyStats] = useState<any[]>([])
  const [supplierStats, setSupplierStats] = useState<any[]>([])

  useEffect(() => {
    setAnalyses(getAnalyses())
    setCompanyStats(getCompanyRiskStats())
    setSupplierStats(getSupplierRiskStats())
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "faible":
        return "text-green-600"
      case "modéré":
        return "text-yellow-600"
      case "élevé":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

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

  const criteriaLabels = {
    subcontractingRate: "Taux de sous-traitance",
    companySize: "Taille de l'entreprise",
    fiscalHistory: "Antécédents fiscaux",
    supplierCount: "Nombre de fournisseurs",
    invoiceVolume: "Volume de factures",
    operationComplexity: "Complexité des opérations",
  }

  const globalStats = {
    totalAnalyses: analyses.length,
    avgRiskScore: analyses.length > 0 ? analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length : 0,
    riskDistribution: {
      faible: analyses.filter((a) => a.riskLevel === "faible").length,
      modéré: analyses.filter((a) => a.riskLevel === "modéré").length,
      élevé: analyses.filter((a) => a.riskLevel === "élevé").length,
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Évaluation des Risques</h1>
        <p className="text-muted-foreground">Analyse détaillée des risques avec système de scoring 0-12 points</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.avgRiskScore.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Score Moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.riskDistribution.faible}</p>
                <p className="text-sm text-muted-foreground">Risque Faible</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.riskDistribution.modéré}</p>
                <p className="text-sm text-muted-foreground">Risque Modéré</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.riskDistribution.élevé}</p>
                <p className="text-sm text-muted-foreground">Risque Élevé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution des risques */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des Niveaux de Risque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risque Faible (0-4 points)</span>
                <span className="text-sm text-muted-foreground">
                  {globalStats.riskDistribution.faible} (
                  {Math.round((globalStats.riskDistribution.faible / globalStats.totalAnalyses) * 100)}%)
                </span>
              </div>
              <Progress
                value={
                  globalStats.totalAnalyses > 0
                    ? (globalStats.riskDistribution.faible / globalStats.totalAnalyses) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risque Modéré (5-8 points)</span>
                <span className="text-sm text-muted-foreground">
                  {globalStats.riskDistribution.modéré} (
                  {Math.round((globalStats.riskDistribution.modéré / globalStats.totalAnalyses) * 100)}%)
                </span>
              </div>
              <Progress
                value={
                  globalStats.totalAnalyses > 0
                    ? (globalStats.riskDistribution.modéré / globalStats.totalAnalyses) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risque Élevé (9-12 points)</span>
                <span className="text-sm text-muted-foreground">
                  {globalStats.riskDistribution.élevé} (
                  {Math.round((globalStats.riskDistribution.élevé / globalStats.totalAnalyses) * 100)}%)
                </span>
              </div>
              <Progress
                value={
                  globalStats.totalAnalyses > 0
                    ? (globalStats.riskDistribution.élevé / globalStats.totalAnalyses) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entreprises à risque */}
      <Card>
        <CardHeader>
          <CardTitle>Entreprises par Niveau de Risque</CardTitle>
          <CardDescription>Classement basé sur la moyenne des analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companyStats
              .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
              .map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{company.name}</span>
                      <Badge className={getRiskBadgeColor(company.riskLevel)}>{company.riskLevel}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {company.analysisCount} analyse(s) • Score moyen: {company.avgRiskScore}/12
                    </p>
                  </div>
                  <div className="w-24">
                    <Progress value={(company.avgRiskScore / 12) * 100} className="h-2" />
                  </div>
                </div>
              ))}

            {companyStats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Aucune entreprise analysée</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fournisseurs à risque */}
      <Card>
        <CardHeader>
          <CardTitle>Fournisseurs par Niveau de Risque</CardTitle>
          <CardDescription>Classement basé sur la moyenne des analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supplierStats
              .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
              .map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{supplier.name}</span>
                      <Badge className={getRiskBadgeColor(supplier.riskLevel)}>{supplier.riskLevel}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {supplier.analysisCount} analyse(s) • Score moyen: {supplier.avgRiskScore}/12
                    </p>
                  </div>
                  <div className="w-24">
                    <Progress value={(supplier.avgRiskScore / 12) * 100} className="h-2" />
                  </div>
                </div>
              ))}

            {supplierStats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Aucun fournisseur analysé</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grille d'évaluation */}
      <Card>
        <CardHeader>
          <CardTitle>Grille d'Évaluation des Critères</CardTitle>
          <CardDescription>Système de scoring basé sur 6 critères (0-12 points)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Critère</th>
                  <th className="text-center p-3">Faible (0 pt)</th>
                  <th className="text-center p-3">Moyen (1 pt)</th>
                  <th className="text-center p-3">Élevé (2 pts)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Part de sous-traitance</td>
                  <td className="p-3 text-center text-sm">{"< 20%"}</td>
                  <td className="p-3 text-center text-sm">20-50%</td>
                  <td className="p-3 text-center text-sm">{"> 50%"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Taille de l'entreprise</td>
                  <td className="p-3 text-center text-sm">{"< 2M€ CA"}</td>
                  <td className="p-3 text-center text-sm">2-10M€ CA</td>
                  <td className="p-3 text-center text-sm">{"> 10M€ CA"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Antécédents fiscaux</td>
                  <td className="p-3 text-center text-sm">Aucun contrôle</td>
                  <td className="p-3 text-center text-sm">Observations mineures</td>
                  <td className="p-3 text-center text-sm">Redressements passés</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Nombre de fournisseurs</td>
                  <td className="p-3 text-center text-sm">{"< 10 réguliers"}</td>
                  <td className="p-3 text-center text-sm">10-30</td>
                  <td className="p-3 text-center text-sm">{"> 30 changeants"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Volume factures mensuel</td>
                  <td className="p-3 text-center text-sm">{"< 50"}</td>
                  <td className="p-3 text-center text-sm">50-200</td>
                  <td className="p-3 text-center text-sm">{"> 200"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Complexité des opérations</td>
                  <td className="p-3 text-center text-sm">Chantier local simple</td>
                  <td className="p-3 text-center text-sm">Plusieurs chantiers</td>
                  <td className="p-3 text-center text-sm">Multi-chantiers internationaux</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Interprétation du score :</h4>
            <ul className="text-sm space-y-1">
              <li>
                <span className="font-medium text-green-600">0-4 pts :</span> Risque faible
              </li>
              <li>
                <span className="font-medium text-yellow-600">5-8 pts :</span> Risque modéré
              </li>
              <li>
                <span className="font-medium text-red-600">9-12 pts :</span> Risque élevé
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
