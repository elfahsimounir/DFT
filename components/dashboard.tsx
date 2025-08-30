"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  FileText,
  Building2,
  Users,
  Activity,
  Zap,
  FileSpreadsheet,
  Receipt,
  BookOpen,
  CreditCard,
} from "lucide-react"
import {
  getAdvancedStats,
  getAnalyses,
  getFECAnalyses,
  getTVADeclarations,
  getJournalAnalyses,
  getBankFluxAnalyses,
  getCompanyRiskStats,
  getSupplierRiskStats,
  initializeDemoData,
} from "@/lib/storage"
import { DeepSeekLogo } from "@/components/deepseek-logo"
import { CardsStackSlider } from "@/components/ui/cards-stack-slider"

export function Dashboard() {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    fraudRate: 0,
    riskDistribution: { faible: 0, modéré: 0, élevé: 0 },
    byType: {
      invoice: 0,
      fec: 0,
      tva: 0,
      journal: 0,
      bank: 0,
    },
  })
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
  const [companyStats, setCompanyStats] = useState<any[]>([])
  const [supplierStats, setSupplierStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const loadData = useCallback(() => {
    const statsData = getAdvancedStats()

    const invoiceAnalyses = getAnalyses().map((a) => ({ ...a, type: "invoice", typeName: "Facture" }))
    const fecAnalyses = getFECAnalyses().map((a) => ({ ...a, type: "fec", typeName: "FEC" }))
    const tvaAnalyses = getTVADeclarations().map((a) => ({ ...a, type: "tva", typeName: "TVA" }))
    const journalAnalyses = getJournalAnalyses().map((a) => ({ ...a, type: "journal", typeName: "Journal" }))
    const bankAnalyses = getBankFluxAnalyses().map((a) => ({ ...a, type: "bank", typeName: "Flux Bancaire" }))

    const allAnalyses = [...invoiceAnalyses, ...fecAnalyses, ...tvaAnalyses, ...journalAnalyses, ...bankAnalyses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    const companyStatsData = getCompanyRiskStats()
    const supplierStatsData = getSupplierRiskStats()

    setStats(statsData)
    setRecentAnalyses(allAnalyses)
    setCompanyStats(companyStatsData)
    setSupplierStats(supplierStatsData)
    setIsLoading(false)
  }, [])

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Paris,FR&appid=feb816a6c360195d2140172577820784&units=metric&lang=fr`,
      )
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error("Erreur météo:", error)
    }
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    initializeDemoData()
    loadData()
    fetchWeatherData()

    const interval = setInterval(loadData, 10000)
    const weatherInterval = setInterval(fetchWeatherData, 300000) // 5 minutes

    return () => {
      clearInterval(interval)
      clearInterval(weatherInterval)
    }
  }, [loadData, fetchWeatherData])

  const avgCompanyRisk =
    companyStats.length > 0 ? companyStats.reduce((sum, c) => sum + c.avgRiskScore, 0) / companyStats.length : 0

  const avgSupplierRisk =
    supplierStats.length > 0 ? supplierStats.reduce((sum, s) => sum + s.avgRiskScore, 0) / supplierStats.length : 0

  const dashboardStats = [
    {
      title: "Analyses Totales",
      value: stats.totalAnalyses,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: `${stats.byType.invoice} factures, ${stats.byType.fec + stats.byType.tva + stats.byType.journal + stats.byType.bank} avancées`,
    },
    {
      title: "Taux de Fraude",
      value: `${stats.fraudRate}%`,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subtitle: "Tous types confondus",
    },
    {
      title: "Risque Moyen Entreprises",
      value: `${avgCompanyRisk.toFixed(1)}/12`,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: `${companyStats.length} entreprises`,
    },
    {
      title: "Risque Moyen Fournisseurs",
      value: `${avgSupplierRisk.toFixed(1)}/12`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      subtitle: `${supplierStats.length} fournisseurs`,
    },
  ]

  const totalRisks = stats.riskDistribution.faible + stats.riskDistribution.modéré + stats.riskDistribution.élevé
  const riskPercentages = {
    faible: totalRisks > 0 ? Math.round((stats.riskDistribution.faible / totalRisks) * 100) : 0,
    modéré: totalRisks > 0 ? Math.round((stats.riskDistribution.modéré / totalRisks) * 100) : 0,
    élevé: totalRisks > 0 ? Math.round((stats.riskDistribution.élevé / totalRisks) * 100) : 0,
  }

  const allEntities = [
    ...supplierStats
      .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
      .slice(0, 3)
      .map((item) => ({ ...item, type: "supplier" })),
    ...companyStats
      .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
      .slice(0, 3)
      .map((item) => ({ ...item, type: "company" })),
  ].sort((a, b) => b.avgRiskScore - a.avgRiskScore)

  const monthlyData = [
    { month: "juin", analyses: 45, risques: 12, percentage: 27, advanced: 8 },
    { month: "juil.", analyses: 62, risques: 18, percentage: 29, advanced: 12 },
    { month: "août", analyses: 38, risques: 8, percentage: 21, advanced: 6 },
    { month: "sept.", analyses: 71, risques: 25, percentage: 35, advanced: 15 },
    { month: "oct.", analyses: 54, risques: 15, percentage: 28, advanced: 11 },
    { month: "nov.", analyses: 89, risques: 31, percentage: 35, advanced: 18 },
    { month: "déc.", analyses: 67, risques: 19, percentage: 28, advanced: 14 },
  ]

  const hourlyData = [
    { hour: "7h", value: 15, peak: false },
    { hour: "8h", value: 45, peak: true },
    { hour: "9h", value: 72, peak: true },
    { hour: "10h", value: 58, peak: false },
    { hour: "11h", value: 63, peak: false },
    { hour: "12h", value: 35, peak: false },
    { hour: "13h", value: 28, peak: false },
    { hour: "14h", value: 67, peak: true },
    { hour: "15h", value: 54, peak: false },
    { hour: "16h", value: 48, peak: false },
    { hour: "17h", value: 32, peak: false },
    { hour: "18h", value: 18, peak: false },
  ]

  if (isLoading) {
    return (
      <div className="h-screen p-4 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-muted rounded w-64 mb-2 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 overflow-y-auto bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Détecteur Fraude TVA</h1>
          <p className="text-muted-foreground">Secteur BTP - Analyses Avancées</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {weatherData && (
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {weatherData.weather?.[0]?.main === "Clear" && "☀️"}
                  {weatherData.weather?.[0]?.main === "Clouds" && "☁️"}
                  {weatherData.weather?.[0]?.main === "Rain" && "🌧️"}
                  {weatherData.weather?.[0]?.main === "Snow" && "❄️"}
                  {!["Clear", "Clouds", "Rain", "Snow"].includes(weatherData.weather?.[0]?.main) && "🌤️"}
                </div>
                <div>
                  <div className="font-semibold">{Math.round(weatherData.main?.temp)}°C</div>
                  <div className="text-sm text-muted-foreground">Paris</div>
                </div>
              </div>
            </Card>
          )}
          <div className="text-right">
            <div className="font-semibold">
              {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-sm text-muted-foreground">Mis à jour</div>
          </div>
          <DeepSeekLogo size="sm" animated={true} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="flex-1 min-w-[200px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Répartition par Type d'Analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.byType.invoice}</div>
                <div className="text-sm text-muted-foreground">Factures</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.byType.fec}</div>
                <div className="text-sm text-muted-foreground">FEC</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Receipt className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.byType.tva}</div>
                <div className="text-sm text-muted-foreground">TVA</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.byType.journal}</div>
                <div className="text-sm text-muted-foreground">Journaux</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
              <CreditCard className="h-8 w-8 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-indigo-600">{stats.byType.bank}</div>
                <div className="text-sm text-muted-foreground">Flux Bancaires</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-xl font-semibold">Évolution des Risques vs. Analyses</CardTitle>
                <select className="border rounded-md px-3 py-2 bg-background text-sm">
                  <option>Par mois</option>
                  <option>Par semaine</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3 mb-6" style={{ height: "200px" }}>
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 flex-1">
                    <div className="flex gap-2 items-end h-40 relative">
                      <motion.div
                        className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg shadow-lg"
                        style={{ width: "12px" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.analyses / 100) * 140}px` }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                      <motion.div
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-lg"
                        style={{ width: "12px" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.risques / 35) * 140}px` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                      />
                      <motion.div
                        className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg shadow-lg"
                        style={{ width: "12px" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.advanced / 20) * 140}px` }}
                        transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <span className="text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded-md shadow-sm">
                          {data.percentage}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded shadow-sm"></div>
                  <span className="font-medium">Analyses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded shadow-sm"></div>
                  <span className="font-medium">Risques Détectés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-400 rounded shadow-sm"></div>
                  <span className="font-medium">Analyses Avancées</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Analyses par Heure
                </CardTitle>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">Aujourd'hui</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {hourlyData.reduce((sum, data) => sum + Math.round(data.value * 0.8), 0)}
                  </div>
                  <div className="text-muted-foreground">Analyses aujourd'hui</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-orange-600">
                    {Math.max(...hourlyData.map((d) => Math.round(d.value * 0.8)))}
                  </div>
                  <div className="text-sm text-muted-foreground">Pic à 9h</div>
                </div>
              </div>

              <div className="flex justify-between gap-4 text-center mb-4">
                <div className="flex-1">
                  <div className="font-medium">Matin</div>
                  <div className="text-sm text-muted-foreground">
                    {hourlyData.slice(0, 4).reduce((sum, data) => sum + Math.round(data.value * 0.8), 0)} analyses
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Après-midi</div>
                  <div className="text-sm text-muted-foreground">
                    {hourlyData.slice(4, 8).reduce((sum, data) => sum + Math.round(data.value * 0.8), 0)} analyses
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Soir</div>
                  <div className="text-sm text-muted-foreground">
                    {hourlyData.slice(8).reduce((sum, data) => sum + Math.round(data.value * 0.8), 0)} analyses
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>
                  Dernière analyse: {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Entreprises à Surveiller
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <CardsStackSlider
                    items={companyStats
                      .filter((item) => item.avgRiskScore > 4)
                      .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
                      .slice(0, 8)}
                    type="company"
                    title=""
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Fournisseurs à Surveiller
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <CardsStackSlider
                    items={supplierStats
                      .filter((item) => item.totalAnalyses > 1)
                      .sort((a, b) => b.totalAnalyses - a.totalAnalyses)
                      .slice(0, 8)}
                    type="supplier"
                    title=""
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-4">
          {/* Risk Distribution Charts */}
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Entreprises par Risque</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${riskPercentages.élevé * 1.88} 188`}
                      className="text-red-500"
                      initial={{ strokeDasharray: "0 188" }}
                      animate={{ strokeDasharray: `${riskPercentages.élevé * 1.88} 188` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold">{riskPercentages.élevé}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Fournisseurs par Risque</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${riskPercentages.modéré * 1.88} 188`}
                      className="text-orange-500"
                      initial={{ strokeDasharray: "0 188" }}
                      animate={{ strokeDasharray: `${riskPercentages.modéré * 1.88} 188` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold">{riskPercentages.modéré}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entities by Division */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Secteur analysé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  name: "BTP Général",
                  count: companyStats.filter((c) => c.riskLevel === "faible").length,
                  icon: Building2,
                },
                {
                  name: "Sous-traitance",
                  count: companyStats.filter((c) => c.riskLevel === "modéré").length,
                  icon: Users,
                },
                {
                  name: "Matériaux",
                  count: supplierStats.filter((s) => s.riskLevel === "faible").length,
                  icon: Activity,
                },
                { name: "Services", count: supplierStats.filter((s) => s.riskLevel === "élevé").length, icon: Zap },
              ].map((division, i) => {
                const Icon = division.icon
                return (
                  <motion.div
                    key={division.name}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{division.name}</span>
                    </div>
                    <span className="font-semibold">{division.count}</span>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-2">{stats.totalAnalyses * 108}</div>
              <div className="text-purple-100 mb-4">Analyses ce mois</div>
              <div className="flex items-end justify-between gap-1 h-16 mb-2">
                {[60, 45, 70, 55, 80, 65, 75].map((height, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/30 rounded-sm flex-1 max-w-[8px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-sm text-purple-200">
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
