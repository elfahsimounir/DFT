"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { InvoiceUpload } from "@/components/invoice-upload"
import { AnalysisResults } from "@/components/analysis-results"
import { CompaniesPage } from "@/components/companies-page"
import { SuppliersPage } from "@/components/suppliers-page"
import { BatchAnalysis } from "@/components/batch-analysis"
import { ReportsPage } from "@/components/reports-page"
import { RiskEvaluationPage } from "@/components/risk-evaluation-page"
import { TrendsPage } from "@/components/trends-page"
import { VatCalculator } from "@/components/vat-calculator"
import { FECAnalysisPage } from "@/components/fec-analysis"
import { TVADeclarationAnalysisPage } from "@/components/tva-declaration-analysis"
import { JournalAnalysisPage } from "@/components/journal-analysis"
import { BankFluxAnalysisPage } from "@/components/bank-flux-analysis"
import { addEventListener, removeEventListener } from "@/lib/storage"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [analysisData, setAnalysisData] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dashboardKey, setDashboardKey] = useState(0)

  useEffect(() => {
    const handleAnalysisComplete = (data: any) => {
      // Force la mise à jour du dashboard quand une nouvelle analyse est terminée
      setDashboardKey((prev) => prev + 1)
    }

    addEventListener("analysis:completed", handleAnalysisComplete)

    return () => {
      removeEventListener("analysis:completed", handleAnalysisComplete)
    }
  }, [])

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard key={dashboardKey} />
      case "upload":
        return <InvoiceUpload onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case "results":
        return <AnalysisResults data={analysisData} />
      case "batch-analysis":
        return <BatchAnalysis />
      case "companies":
        return <CompaniesPage />
      case "suppliers":
        return <SuppliersPage />
      case "risk-assessment":
        return <RiskEvaluationPage />
      case "reports":
        return <ReportsPage />
      case "trends":
        return <TrendsPage />
      case "calculator":
        return <VatCalculator />
      case "fec-analysis":
        return <FECAnalysisPage onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case "tva-declaration":
        return <TVADeclarationAnalysisPage onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case "journal-analysis":
        return <JournalAnalysisPage onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case "bank-flux":
        return <BankFluxAnalysisPage onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
            <p className="text-muted-foreground">Page de démonstration pour la configuration de l'application.</p>
          </div>
        )
      default:
        return <Dashboard key={dashboardKey} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
