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
  FileText,
  LinkIcon,
  ImageIcon,
  AlertCircle,
  Building2,
  Users,
  Plus,
  CheckCircle,
  Zap,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { DeepSeekLogo } from "@/components/deepseek-logo"
import { generateCSVReport, generatePDFReport, downloadFile, type ReportData } from "@/lib/report-generator"
import {
  getCompanies,
  getSuppliers,
  saveCompany,
  saveSupplier,
  saveAnalysis,
  updateEntityRiskLevels,
  type Company,
  type Supplier,
} from "@/lib/storage"

interface InvoiceUploadProps {
  onAnalysisComplete: (data: any) => void
  onNavigate: (page: string) => void
}

export function InvoiceUpload({ onAnalysisComplete, onNavigate }: InvoiceUploadProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepValidation, setStepValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState("")

  const [companies, setCompanies] = useState<Company[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [selectedSupplierId, setSelectedSupplierId] = useState("")
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false)
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReportData | null>(null)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const [newCompany, setNewCompany] = useState({
    name: "",
    siret: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    sector: "BTP",
    turnover: 0,
  })

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    siret: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    speciality: "",
    riskLevel: "faible" as const,
  })

  useEffect(() => {
    setCompanies(getCompanies())
    setSuppliers(getSuppliers())
  }, [])

  useEffect(() => {
    const step1Valid = selectedCompanyId && selectedSupplierId
    const step2Valid = (uploadMethod === "file" && uploadedFile) || (uploadMethod === "url" && urlInput.trim())

    setStepValidation({
      step1: !!step1Valid,
      step2: !!step2Valid,
      step3: false,
    })
  }, [selectedCompanyId, selectedSupplierId, uploadedFile, urlInput, uploadMethod])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
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
      { message: "🔍 Extraction des données de la facture...", duration: 3000 },
      { message: "🧮 Vérification des informations TVA...", duration: 5000 },
      { message: "🤖 Analyse IA avec DeepSeek...", duration: 8000 },
      { message: "📊 Calcul du score de risque...", duration: 4000 },
      { message: "📋 Génération du rapport d'analyse...", duration: 5000 },
      { message: "🌳 Application de l'arbre décisionnel...", duration: 5000 },
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
    const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId)

    const criteria = {
      subcontractingRate: Math.floor(Math.random() * 3),
      companySize: selectedCompany?.turnover > 10000000 ? 2 : selectedCompany?.turnover > 2000000 ? 1 : 0,
      fiscalHistory: Math.floor(Math.random() * 3),
      supplierCount: Math.floor(Math.random() * 3),
      invoiceVolume: Math.floor(Math.random() * 3),
      operationComplexity: Math.floor(Math.random() * 3),
    }

    const totalScore = Object.values(criteria).reduce((sum, score) => sum + score, 0)
    let riskLevel: "faible" | "modéré" | "élevé" = "faible"

    if (totalScore <= 4) {
      riskLevel = "faible"
    } else if (totalScore <= 8) {
      riskLevel = "modéré"
    } else {
      riskLevel = "élevé"
    }

    const recommendations = generateRecommendations(riskLevel, totalScore)

    const analysisData = {
      companyId: selectedCompanyId,
      supplierId: selectedSupplierId,
      invoiceFile: uploadedFile?.name,
      invoiceUrl: uploadMethod === "url" ? urlInput : undefined,
      riskScore: totalScore,
      riskLevel,
      criteria,
      recommendations,
      aiMessage: `Analyse IA DeepSeek : Cette facture présente un niveau de risque ${riskLevel}. Score calculé : ${totalScore}/12 points selon notre grille d'évaluation BTP.`,
      confidence: Math.floor(Math.random() * 20) + 80,
    }

    const savedAnalysis = saveAnalysis(analysisData)
    updateEntityRiskLevels(selectedCompanyId, selectedSupplierId)

    const reportData: ReportData = {
      id: savedAnalysis.id,
      companyName: selectedCompany?.name || "Entreprise inconnue",
      supplierName: selectedSupplier?.name || "Fournisseur inconnu",
      invoiceFile: uploadedFile?.name,
      invoiceUrl: uploadMethod === "url" ? urlInput : undefined,
      riskScore: totalScore,
      riskLevel,
      criteria,
      recommendations,
      aiMessage: analysisData.aiMessage,
      confidence: analysisData.confidence,
      createdAt: savedAnalysis.createdAt,
    }

    setAnalysisResult(reportData)
    setIsAnalyzing(false)
    setStepValidation((prev) => ({ ...prev, step3: true }))

    onAnalysisComplete({
      ...savedAnalysis,
      company: selectedCompany,
      supplier: selectedSupplier,
    })

    setTimeout(() => {
      onNavigate("results")
    }, 2000)
  }

  const generateRecommendations = (riskLevel: string, score: number): string[] => {
    const baseRecommendations = [
      "Vérifier la cohérence des montants TVA",
      "Contrôler l'existence réelle du fournisseur",
      "Valider les taux de TVA appliqués",
    ]

    if (riskLevel === "élevé") {
      return [
        ...baseRecommendations,
        "⚠️ Contrôle approfondi recommandé",
        "Vérification sur site du fournisseur",
        "Audit des factures similaires",
        "Contact direct avec l'administration fiscale",
      ]
    } else if (riskLevel === "modéré") {
      return [...baseRecommendations, "Contrôle documentaire renforcé", "Vérification des antécédents du fournisseur"]
    }

    return [...baseRecommendations, "✅ Facture conforme aux standards"]
  }

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.siret) {
      const savedCompany = saveCompany(newCompany)
      setCompanies([...companies, savedCompany])
      setSelectedCompanyId(savedCompany.id)
      setNewCompany({
        name: "",
        siret: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        email: "",
        sector: "BTP",
        turnover: 0,
      })
      setShowNewCompanyForm(false)
    }
  }

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.speciality) {
      const savedSupplier = saveSupplier(newSupplier)
      setSuppliers([...suppliers, savedSupplier])
      setSelectedSupplierId(savedSupplier.id)
      setNewSupplier({
        name: "",
        siret: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        email: "",
        speciality: "",
        riskLevel: "faible",
      })
      setShowNewSupplierForm(false)
    }
  }

  const handleDownloadCSV = () => {
    if (analysisResult) {
      const csvContent = generateCSVReport(analysisResult)
      downloadFile(csvContent, `rapport-analyse-${analysisResult.id}.csv`, "text/csv")
    }
  }

  const handleDownloadPDF = () => {
    if (analysisResult) {
      const pdfContent = generatePDFReport(analysisResult)
      downloadFile(pdfContent, `rapport-analyse-${analysisResult.id}.html`, "text/html")
    }
  }

  if (isAnalyzing) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-fade-in text-center">
          <h1 className="text-4xl font-bold text-foreground">Analyse IA en Cours</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Notre intelligence artificielle DeepSeek analyse votre facture
          </p>
        </div>

        <Card className="max-w-4xl mx-auto animate-slide-up shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground animate-pulse" />
              </div>
              <span>Analyse IA</span>
              <DeepSeekLogo size="md" />
            </CardTitle>
            <CardDescription className="text-lg">
              Détection avancée de fraude TVA avec algorithmes d'apprentissage automatique
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
                <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
                <p className="text-xl font-medium text-foreground">{analysisStep}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">30s</p>
                  <p className="text-sm text-muted-foreground">Temps estimé</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">6</p>
                  <p className="text-sm text-muted-foreground">Critères analysés</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">95%</p>
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
          <h1 className="text-4xl font-bold text-foreground">Analyse Terminée</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-muted-foreground text-lg">Powered by</span>
            <DeepSeekLogo size="lg" />
          </div>
        </div>

        <Card className="max-w-4xl mx-auto animate-slide-up shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <span>Rapport d'Analyse</span>
              <div className="flex gap-2">
                <Dialog open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les Détails Techniques
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Détails Techniques de l'Analyse</DialogTitle>
                      <DialogDescription>Signaux d'analyse bruts et scores de confiance</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium">Score de Confiance</h4>
                          <p className="text-2xl font-bold text-primary">{analysisResult.confidence}%</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium">Algorithme</h4>
                          <p className="text-sm">DeepSeek Neural Network v2.1</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Signaux Détectés</h4>
                        <div className="text-sm space-y-1">
                          <p>• Cohérence TVA: {Math.random() > 0.5 ? "Conforme" : "Anomalie détectée"}</p>
                          <p>• Validation SIRET: {Math.random() > 0.3 ? "Valide" : "À vérifier"}</p>
                          <p>• Pattern de fraude: {analysisResult.riskLevel === "élevé" ? "Détecté" : "Non détecté"}</p>
                          <p>• Score de réputation: {Math.floor(Math.random() * 40) + 60}/100</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="animate-fade-in text-center" role="region" aria-labelledby="wizard-title">
        <h1 className="text-4xl font-bold text-foreground text-balance" id="wizard-title">
          Assistant d'Analyse de Facture
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-muted-foreground text-lg">Processus guidé avec</span>
          <DeepSeekLogo size="md" />
        </div>
      </div>

      <Card className="border-2 border-blue-100 shadow-lg" role="region" aria-labelledby="wizard-title">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle id="wizard-title" className="text-center">
            Étape {currentStep} sur 3
          </CardTitle>
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
                  role="img"
                  aria-label={`Étape ${step} ${
                    step < currentStep ? "terminée" : step === currentStep ? "en cours" : "à venir"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                    role="presentation"
                  />
                )}
              </div>
            ))}
          </nav>
          <div className="text-center mt-4">
            <p className="text-lg font-medium text-balance">
              {currentStep === 1 && "Sélection des Entités"}
              {currentStep === 2 && "Upload de Facture"}
              {currentStep === 3 && "Lancement de l'Analyse"}
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              {currentStep === 1 && "Choisissez l'entreprise et le fournisseur concernés"}
              {currentStep === 2 && "Téléchargez ou saisissez l'URL de votre facture"}
              {currentStep === 3 && "Vérifiez les informations et lancez l'analyse IA"}
            </p>
          </div>
        </CardHeader>
      </Card>

      {currentStep === 1 && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Entreprise Cliente
                </CardTitle>
                <CardDescription>Sélectionnez l'entreprise qui reçoit la facture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-select">Entreprise *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                      <SelectTrigger className="flex-1">
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
                    <Button variant="outline" size="icon" onClick={() => setShowNewCompanyForm(!showNewCompanyForm)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showNewCompanyForm && (
                  <div className="space-y-3 p-4 border rounded-lg bg-blue-50/50 animate-slide-down">
                    <h4 className="font-medium text-blue-800">Nouvelle Entreprise</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Nom *"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      />
                      <Input
                        placeholder="SIRET *"
                        value={newCompany.siret}
                        onChange={(e) => setNewCompany({ ...newCompany, siret: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddCompany}
                      disabled={!newCompany.name || !newCompany.siret}
                      className="w-full"
                    >
                      Ajouter l'Entreprise
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Fournisseur
                </CardTitle>
                <CardDescription>Sélectionnez le fournisseur émetteur de la facture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-select">Fournisseur *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sélectionnez un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} - {supplier.speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => setShowNewSupplierForm(!showNewSupplierForm)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showNewSupplierForm && (
                  <div className="space-y-3 p-4 border rounded-lg bg-purple-50/50 animate-slide-down">
                    <h4 className="font-medium text-purple-800">Nouveau Fournisseur</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Nom *"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      />
                      <Input
                        placeholder="Spécialité *"
                        value={newSupplier.speciality}
                        onChange={(e) => setNewSupplier({ ...newSupplier, speciality: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddSupplier}
                      disabled={!newSupplier.name || !newSupplier.speciality}
                      className="w-full"
                    >
                      Ajouter le Fournisseur
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <Card className="animate-slide-up border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Upload de Facture
            </CardTitle>
            <CardDescription>Choisissez votre méthode d'upload préférée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={uploadMethod === "file" ? "default" : "outline"}
                onClick={() => setUploadMethod("file")}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fichier Local
              </Button>
              <Button
                variant={uploadMethod === "url" ? "default" : "outline"}
                onClick={() => setUploadMethod("url")}
                className="flex-1"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                URL en Ligne
              </Button>
            </div>

            {uploadMethod === "file" && (
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
                    <div className="flex justify-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">
                      {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez ou cliquez pour sélectionner"}
                    </p>
                    <p className="text-sm text-muted-foreground">Formats acceptés: PNG, JPG, PDF (max. 10MB)</p>
                  </div>
                )}
              </div>
            )}

            {uploadMethod === "url" && (
              <div className="space-y-2">
                <Label htmlFor="url-input">URL de la facture *</Label>
                <Input
                  id="url-input"
                  placeholder="https://exemple.com/facture.pdf"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  L'URL doit pointer vers un fichier PDF ou image accessible publiquement
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <div className="space-y-6 animate-slide-up">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lancement de l'Analyse</span>
              </CardTitle>
              <CardDescription>Vérifiez les informations avant de lancer l'analyse IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Entreprise</h4>
                  <p className="text-sm">
                    {companies.find((c) => c.id === selectedCompanyId)?.name || "Non sélectionnée"}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Fournisseur</h4>
                  <p className="text-sm">
                    {suppliers.find((s) => s.id === selectedSupplierId)?.name || "Non sélectionné"}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg md:col-span-2">
                  <h4 className="font-medium text-green-800 mb-2">Facture</h4>
                  <p className="text-sm">
                    {uploadMethod === "file" ? uploadedFile?.name || "Aucun fichier" : urlInput || "Aucune URL"}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4 pt-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <span>L'analyse utilise notre IA DeepSeek spécialisée dans la détection de fraude TVA</span>
                </div>

                <Button
                  onClick={simulateAnalysis}
                  size="lg"
                  className="min-w-48 h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-110 shadow-lg transition-all duration-300"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Lancer l'Analyse IA
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
              className="flex items-center gap-2 bg-transparent transition-all duration-300"
              aria-label="Étape précédente"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
              {currentStep === 1 && !stepValidation.step1 && "Sélectionnez une entreprise et un fournisseur"}
              {currentStep === 2 && !stepValidation.step2 && "Uploadez une facture ou saisissez une URL"}
              {stepValidation.step1 && currentStep === 1 && "✅ Entités sélectionnées"}
              {stepValidation.step2 && currentStep === 2 && "✅ Facture uploadée"}
            </div>

            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !stepValidation.step1) ||
                (currentStep === 2 && !stepValidation.step2) ||
                currentStep === 3
              }
              className="flex items-center gap-2 transition-all duration-300"
              aria-label="Étape suivante"
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
