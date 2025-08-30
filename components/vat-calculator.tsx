"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, AlertTriangle, CheckCircle, Info } from "lucide-react"

export function VatCalculator() {
  const [amount, setAmount] = useState("")
  const [vatRate, setVatRate] = useState("20")
  const [calculationType, setCalculationType] = useState("ht-to-ttc")
  const [results, setResults] = useState<any>(null)

  const vatRates = {
    "20": { rate: 20, label: "20% (Taux normal)", description: "Travaux de construction, rénovation" },
    "10": { rate: 10, label: "10% (Taux intermédiaire)", description: "Amélioration, transformation" },
    "5.5": { rate: 5.5, label: "5,5% (Taux réduit)", description: "Rénovation énergétique" },
    "2.1": { rate: 2.1, label: "2,1% (Taux super réduit)", description: "Médicaments, presse" },
  }

  const calculateVAT = () => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    const rate = Number.parseFloat(vatRate)
    let htAmount, ttcAmount, vatAmount

    if (calculationType === "ht-to-ttc") {
      htAmount = numAmount
      vatAmount = (htAmount * rate) / 100
      ttcAmount = htAmount + vatAmount
    } else {
      ttcAmount = numAmount
      htAmount = ttcAmount / (1 + rate / 100)
      vatAmount = ttcAmount - htAmount
    }

    // Détection d'anomalies potentielles
    const anomalies = []

    // Montant anormalement élevé
    if (numAmount > 100000) {
      anomalies.push({
        type: "warning",
        message: "Montant élevé - Vérifier la cohérence avec le type de travaux",
      })
    }

    // Taux de TVA potentiellement incorrect
    if (rate === 20 && numAmount < 1000) {
      anomalies.push({
        type: "info",
        message: "Pour de petits montants, vérifier si le taux réduit s'applique",
      })
    }

    // TVA arrondie suspecte
    if (vatAmount % 1 === 0 && vatAmount > 100) {
      anomalies.push({
        type: "warning",
        message: "Montant de TVA rond - Vérifier le calcul",
      })
    }

    setResults({
      htAmount: htAmount.toFixed(2),
      ttcAmount: ttcAmount.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      rate,
      anomalies,
    })
  }

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calculateur TVA</h1>
        <p className="text-muted-foreground">
          Outil interactif pour simuler les montants TVA et détecter les anomalies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de calcul */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calcul TVA
            </CardTitle>
            <CardDescription>Calculez les montants HT, TTC et TVA selon les taux en vigueur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="calculation-type">Type de calcul</Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ht-to-ttc">HT → TTC</SelectItem>
                  <SelectItem value="ttc-to-ht">TTC → HT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Montant {calculationType === "ht-to-ttc" ? "HT" : "TTC"} (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Saisir le montant"
              />
            </div>

            <div>
              <Label htmlFor="vat-rate">Taux de TVA</Label>
              <Select value={vatRate} onValueChange={setVatRate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vatRates).map(([rate, info]) => (
                    <SelectItem key={rate} value={rate}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {vatRates[vatRate as keyof typeof vatRates]?.description}
              </p>
            </div>

            <Button onClick={calculateVAT} className="w-full" disabled={!amount}>
              Calculer
            </Button>
          </CardContent>
        </Card>

        {/* Résultats */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats du Calcul</CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Montant HT</span>
                    <span className="text-lg font-bold">{results.htAmount} €</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">TVA ({results.rate}%)</span>
                    <span className="text-lg font-bold text-blue-600">{results.vatAmount} €</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">Montant TTC</span>
                    <span className="text-xl font-bold text-primary">{results.ttcAmount} €</span>
                  </div>
                </div>

                {/* Anomalies détectées */}
                {results.anomalies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Anomalies Détectées</h4>
                    {results.anomalies.map((anomaly: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                        {getAnomalyIcon(anomaly.type)}
                        <div className="flex-1">
                          <Badge className={getAnomalyColor(anomaly.type)} variant="secondary">
                            {anomaly.type.toUpperCase()}
                          </Badge>
                          <p className="text-sm mt-1">{anomaly.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.anomalies.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Aucune anomalie détectée</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Saisissez un montant et cliquez sur "Calculer" pour voir les résultats
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guide des taux de TVA */}
      <Card>
        <CardHeader>
          <CardTitle>Guide des Taux de TVA dans le BTP</CardTitle>
          <CardDescription>Taux applicables selon le type de travaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-100 text-red-800">20%</Badge>
                  <span className="font-medium">Taux Normal</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Construction neuve</li>
                  <li>• Gros œuvre</li>
                  <li>• Travaux de rénovation standard</li>
                  <li>• Équipements et matériaux</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-100 text-orange-800">10%</Badge>
                  <span className="font-medium">Taux Intermédiaire</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Amélioration de logements anciens</li>
                  <li>• Transformation d'usage</li>
                  <li>• Travaux d'entretien</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-800">5,5%</Badge>
                  <span className="font-medium">Taux Réduit</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rénovation énergétique</li>
                  <li>• Isolation thermique</li>
                  <li>• Équipements énergétiques</li>
                  <li>• Logements sociaux</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">2,1%</Badge>
                  <span className="font-medium">Taux Super Réduit</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cas très spécifiques</li>
                  <li>• Médicaments remboursables</li>
                  <li>• Publications de presse</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
