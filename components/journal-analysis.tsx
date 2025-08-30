"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Upload,
  Building2,
  CheckCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  Calendar,
  AlertTriangle,
  BookOpen,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { DeepSeekLogo } from "@/components/deepseek-logo"
import { generateCSVReport, generatePDFReport, downloadFile, type ReportData } from "@/lib/report-generator"
import { getCompanies, saveJournalAnalysis, type Company, type JournalAnalysis } from "@/lib/storage"

interface JournalAnalysisProps {
  onAnalysisComplete: (data: any) => void
  onNavigate: (page: string) => void
}

export function JournalAnalysisPage({ onAnalysisComplete, onNavigate }: JournalAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepValidation, setStepValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [period, setPeriod] = useState({
    startDate: "",
    endDate: "",
  })
  const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  useEffect(() => {
    setCompanies(getCompanies())
  }, [])

  useEffect(() => {
    const step1Valid = uploadedFile
    const step2Valid = selectedCompanyId && period.startDate && period.endDate

    setStepValidation({
      step1: !!step1Valid,
      step2: !!step2Valid,
      step3: false,
    })
  }, [uploadedFile, selectedCompanyId, period])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  const nextStep = () => {
    if (currentStep === 1 && stepValidation.step1) {
      setCurrentStep(2)
    } else if (currentStep === 2 && stepValidation.step2) {
      setCurrentStep(3)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const simulateAnalysis = async () => {
    setIsAnalyzing(true)
    setProgress(0)

    const steps = [
      { message: "📚 Lecture des journaux comptables...", duration: 4000 },
      { message: "🔍 Validation des écritures journalières...", duration: 5000 },
      { message: "🤖 Analyse IA DeepSeek des mouvements...", duration: 8000 },
      { message: "⚠️ Détection d'irrégularités comptables...", duration: 6000 },
      { message: "📊 Analyse des patterns de fraude...", duration: 5000 },
      { message: "📋 Génération du rapport journal...", duration: 2000 },
    ]

    let totalProgress = 0
    const stepIncrement = 100 / steps.length

    for (const step of steps) {
      setAnalysisStep(step.message)
      await new Promise((resolve) => setTimeout(resolve, step.duration))
      totalProgress += stepIncrement
      setProgress(Math.min(totalProgress, 100))
    }

    const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

    const riskScore = Math.floor(Math.random() * 13)
    const riskLevel = riskScore <= 4 ? "faible" : riskScore <= 8 ? "modéré" : "élevé"

    const anomalies = [
      {
        type: "Écritures d'ajustement suspectes",
        description: "Concentration d'ajustements en fin de période",
        severity: "medium" as const,
      },
      {
        type: "Mouvements inter-comptes anormaux",
        description: "Virements répétés entre comptes sans justification",
        severity: "high" as const,
      },
      {
        type: "Séquences de numérotation manquantes",
        description: "Gaps dans la numérotation des pièces comptables",
        severity: "low" as const,
      },
    ]

    const findings = [
      "Analyse de 12,456 écritures de journal",
      `${anomalies.length} irrégularités comptables détectées`,
      "Cohérence de la chronologie: 89%",
      "Respect des principes comptables: Conforme",
    ]

    const analysisData: Omit<JournalAnalysis, "id" | "createdAt"> = {
      type: "journal",
      companyId: selectedCompanyId,
      period,
      fileName: uploadedFile?.name || "journaux_comptables.xlsx",
      status: "completed",
      riskScore,
      riskLevel,
      findings,
      aiMessage: `Analyse Journaux DeepSeek : Les journaux présentent un niveau de risque ${riskLevel}. Score calculé : ${riskScore}/12 points. ${anomalies.length} irrégularités détectées dans les écritures comptables.`,
      confidence: Math.floor(Math.random() * 15) + 82,
      anomalies,
    }

    const savedAnalysis = saveJournalAnalysis(analysisData)
    setAnalysisResult(savedAnalysis)
    setIsAnalyzing(false)
    setStepValidation((prev) => ({ ...prev, step3: true }))

    onAnalysisComplete({
      ...savedAnalysis,
      company: selectedCompany,
    })
  }

  const handleDownloadCSV = () => {
    if (analysisResult) {
      const reportData: ReportData = {
        id: analysisResult.id,
        companyName: companies.find((c) => c.id === analysisResult.companyId)?.name || "Entreprise inconnue",
        supplierName: "Journaux Comptables",
        riskScore: analysisResult.riskScore,
        riskLevel: analysisResult.riskLevel,
        criteria: {
          subcontractingRate: 0,
          companySize: 0,
          fiscalHistory: 0,
          supplierCount: 0,
          invoiceVolume: 0,
          operationComplexity: 0,
        },
        recommendations: analysisResult.findings,
        aiMessage: analysisResult.aiMessage,
        confidence: analysisResult.confidence,
        createdAt: analysisResult.createdAt,
      }
      const csvContent = generateCSVReport(reportData)
      downloadFile(csvContent, `rapport-journaux-${analysisResult.id}.csv`, "text/csv")
    }
  }

  const handleDownloadPDF = () => {
    if (analysisResult) {
      const reportData: ReportData = {
        id: analysisResult.id,
        companyName: companies.find((c) => c.id === analysisResult.companyId)?.name || "Entreprise inconnue",
        supplierName: "Journaux Comptables",
        riskScore: analysisResult.riskScore,
        riskLevel: analysisResult.riskLevel,
        criteria: {
          subcontractingRate: 0,
          companySize: 0,
          fiscalHistory: 0,
          supplierCount: 0,
          invoiceVolume: 0,
          operationComplexity: 0,
        },
        recommendations: analysisResult.findings,
        aiMessage: analysisResult.aiMessage,
        confidence: analysisResult.confidence,
        createdAt: analysisResult.createdAt,
      }
      const pdfContent = generatePDFReport(reportData)
      downloadFile(pdfContent, `rapport-journaux-${analysisResult.id}.html`, "text/html")
    }
  }

  if (isAnalyzing) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-fade-in text-center">
          <h1 className="text-4xl font-bold text-foreground">Analyse Journaux en Cours</h1>
          <p className="text-muted-foreground mt-2 text-lg">Notre IA DeepSeek analyse vos journaux comptables</p>
        </div>

        <Card className="max-w-4xl mx-auto animate-slide-up shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground animate-pulse" />
              </div>
              <span>Analyse Journaux</span>
              <DeepSeekLogo size="md" />
            </CardTitle>
            <CardDescription className="text-lg">
              Détection d'irrégularités et validation de la cohérence comptable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Progression de l'analyse</span>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {Math.round(progress)}%
                </Badge>
              </div>
              <div className="relative">
                <Progress value={progress} className="w-full h-4" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-primary animate-pulse" />
                <p className="text-xl font-medium text-foreground">{analysisStep}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">30s</p>
                  <p className="text-sm text-muted-foreground">Temps estimé</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">Journal</p>
                  <p className="text-sm text-muted-foreground">Type d'analyse</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">94%</p>
                  <p className="text-sm text-muted-foreground">Précision IA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stepValidation.step3 && analysisResult) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-fade-in text-center">
          <h1 className="text-4xl font-bold text-foreground">Analyse Journaux Terminée</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-muted-foreground text-lg">Powered by</span>
            <DeepSeekLogo size="lg" />
          </div>
        </div>

        <Card className="max-w-4xl mx-auto animate-slide-up shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <span>Rapport d'Analyse Journaux</span>
              <div className="flex gap-2">
                <Dialog open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails Techniques
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Détails Techniques Journaux</DialogTitle>
                      <DialogDescription>Irrégularités détectées et analyse des patterns</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium">Confiance</h4>
                          <p className="text-2xl font-bold text-primary">{analysisResult.confidence}%</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium">Irrégularités</h4>
                          <p className="text-2xl font-bold text-destructive">{analysisResult.anomalies.length}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Irrégularités Détectées</h4>
                        <div className="space-y-2">
                          {analysisResult.anomalies.map((anomaly, index) => (
                            <div key={index} className="p-2 bg-muted rounded text-sm">
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  className={`h-4 w-4 ${
                                    anomaly.severity === "high"
                                      ? "text-destructive"
                                      : anomaly.severity === "medium"
                                        ? "text-orange-500"
                                        : "text-yellow-500"
                                  }`}
                                />
                                <span className="font-medium">{anomaly.type}</span>
                              </div>
                              <p className="text-muted-foreground mt-1">{anomaly.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div
                className={`text-6xl font-bold ${
                  analysisResult.riskLevel === "élevé"
                    ? "text-destructive"
                    : analysisResult.riskLevel === "modéré"
                      ? "text-orange-500"
                      : "text-green-500"
                }`}
              >
                {analysisResult.riskScore}/12
              </div>
              <Badge
                variant={
                  analysisResult.riskLevel === "élevé"
                    ? "destructive"
                    : analysisResult.riskLevel === "modéré"
                      ? "secondary"
                      : "default"
                }
                className="text-lg px-4 py-2"
              >
                Risque {analysisResult.riskLevel}
              </Badge>
              <p className="text-muted-foreground max-w-2xl mx-auto">{analysisResult.aiMessage}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {analysisResult.findings.map((finding, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-left">
                    <p className="text-sm">{finding}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="animate-fade-in text-center">
        <h1 className="text-4xl font-bold text-foreground text-balance">Analyse Journaux Comptables</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-muted-foreground text-lg">Processus guidé avec</span>
          <DeepSeekLogo size="md" />
        </div>
      </div>

      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-center">Étape {currentStep} sur 3</CardTitle>
          <nav aria-label="Progression du wizard" className="flex items-center justify-center space-x-4 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </nav>
          <div className="text-center mt-4">
            <p className="text-lg font-medium text-balance">
              {currentStep === 1 && "Import des Journaux"}
              {currentStep === 2 && "Contexte d'Analyse"}
              {currentStep === 3 && "Lancement de l'Analyse"}
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              {currentStep === 1 && "Téléchargez vos journaux comptables"}
              {currentStep === 2 && "Sélectionnez l'entreprise et la période d'analyse"}
              {currentStep === 3 && "Vérifiez les informations et lancez l'analyse IA"}
            </p>
          </div>
        </CardHeader>
      </Card>

      {currentStep === 1 && (
        <Card className="animate-slide-up border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Import des Journaux Comptables
            </CardTitle>
            <CardDescription>Téléchargez vos journaux comptables (grand livre, journal général, etc.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-green-500 bg-green-50 scale-105"
                  : uploadedFile
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-green-400 hover:bg-green-50/50"
              }`}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="space-y-2 animate-bounce-in">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                  <p className="font-medium text-green-700">{uploadedFile.name}</p>
                  <p className="text-sm text-green-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium">
                    {isDragActive
                      ? "Déposez vos journaux comptables ici"
                      : "Glissez-déposez ou cliquez pour sélectionner"}
                  </p>
                  <p className="text-sm text-muted-foreground">Formats acceptés: CSV, XLS, XLSX, PDF (max. 100MB)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <div className="space-y-6 animate-slide-up">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Contexte d'Analyse
              </CardTitle>
              <CardDescription>Sélectionnez l'entreprise et définissez la période d'analyse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-select">Entreprise *</Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} - {company.siret}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={period.startDate}
                    onChange={(e) => setPeriod({ ...period, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={period.endDate}
                    onChange={(e) => setPeriod({ ...period, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6 animate-slide-up">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Lancement de l'Analyse Journaux</CardTitle>
              <CardDescription>Vérifiez les informations avant de lancer l'analyse IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Journaux Comptables</h4>
                  <p className="text-sm">{uploadedFile?.name || "Aucun fichier"}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Entreprise</h4>
                  <p className="text-sm">
                    {companies.find((c) => c.id === selectedCompanyId)?.name || "Non sélectionnée"}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg md:col-span-2">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Période d'Analyse
                  </h4>
                  <p className="text-sm">
                    {period.startDate && period.endDate
                      ? `Du ${period.startDate} au ${period.endDate}`
                      : "Période non définie"}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4 pt-4">
                <Button
                  onClick={simulateAnalysis}
                  size="lg"
                  className="min-w-48 h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-110 shadow-lg transition-all duration-300"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Analyser les Journaux
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-t-2 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentStep === 1 && !stepValidation.step1 && "Téléchargez des journaux comptables"}
              {currentStep === 2 && !stepValidation.step2 && "Sélectionnez une entreprise et une période"}
              {stepValidation.step1 && currentStep === 1 && "✅ Journaux téléchargés"}
              {stepValidation.step2 && currentStep === 2 && "✅ Contexte défini"}
            </div>

            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !stepValidation.step1) ||
                (currentStep === 2 && !stepValidation.step2) ||
                currentStep === 3
              }
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
