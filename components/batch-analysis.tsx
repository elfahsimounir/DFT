"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface BatchFile {
  id: string
  name: string
  size: number
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  riskLevel?: "faible" | "modéré" | "élevé"
  riskScore?: number
}

export function BatchAnalysis() {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: BatchFile[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      status: "pending",
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
  })

  const simulateBatchAnalysis = async () => {
    setIsProcessing(true)
    setOverallProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Update file status to processing
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "processing" } : f)))

      // Simulate processing with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress } : f)))
      }

      // Generate random results
      const riskScore = Math.floor(Math.random() * 12) + 1
      const riskLevel: "faible" | "modéré" | "élevé" = riskScore <= 4 ? "faible" : riskScore <= 8 ? "modéré" : "élevé"

      // Mark as completed
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "completed", riskLevel, riskScore, progress: 100 } : f)),
      )

      // Update overall progress
      setOverallProgress(((i + 1) / files.length) * 100)
    }

    setIsProcessing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing":
        return <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getRiskBadgeVariant = (risk?: string) => {
    switch (risk) {
      case "faible":
        return "default"
      case "modéré":
        return "secondary"
      case "élevé":
        return "destructive"
      default:
        return "outline"
    }
  }

  const completedFiles = files.filter((f) => f.status === "completed")
  const riskStats = completedFiles.reduce(
    (acc, file) => {
      if (file.riskLevel) acc[file.riskLevel]++
      return acc
    },
    { faible: 0, modéré: 0, élevé: 0 },
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analyse par Lot</h1>
        <p className="text-muted-foreground mt-2">Analysez plusieurs factures simultanément</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload de Factures</CardTitle>
            <CardDescription>Glissez-déposez plusieurs factures pour une analyse groupée</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium mb-2">
                {isDragActive ? "Déposez vos fichiers ici" : "Glissez-déposez vos factures"}
              </p>
              <p className="text-sm text-muted-foreground">PNG, JPG, PDF (max. 10MB chacun)</p>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Fichiers ({files.length})</h3>
                  <div className="flex gap-2">
                    <Button onClick={simulateBatchAnalysis} disabled={isProcessing || files.length === 0}>
                      {isProcessing ? "Analyse en cours..." : "Analyser tout"}
                    </Button>
                    <Button variant="outline" onClick={() => setFiles([])}>
                      Effacer
                    </Button>
                  </div>
                </div>

                {isProcessing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression globale</span>
                      <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.status === "processing" && (
                          <div className="w-16">
                            <Progress value={file.progress} className="h-1" />
                          </div>
                        )}
                        {file.status === "completed" && file.riskLevel && (
                          <>
                            <Badge variant={getRiskBadgeVariant(file.riskLevel)}>
                              {file.riskLevel.charAt(0).toUpperCase() + file.riskLevel.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{file.riskScore}/12</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Résultats de l'analyse par lot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total analysé</span>
                  <span className="font-medium">{completedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risque faible</span>
                  <span className="font-medium text-accent">{riskStats.faible}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risque modéré</span>
                  <span className="font-medium text-secondary">{riskStats.modéré}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risque élevé</span>
                  <span className="font-medium text-destructive">{riskStats.élevé}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {completedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
                <CardDescription>Téléchargez les résultats</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en CSV
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
