"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Users,
  History,
  Package,
  BarChart3,
  Network,
  Download,
  Eye,
  Sparkles,
} from "lucide-react"
import { DeepSeekLogo } from "@/components/deepseek-logo"

interface AnalysisResultsProps {
  data: any
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  if (!data) {
    return (
      <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Aucune analyse disponible. Veuillez d'abord analyser une facture.</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const company = data.company || { name: data.company || "Entreprise inconnue", siret: data.siret || "N/A" }
  const supplier = data.supplier || { name: data.details?.supplierName || "Fournisseur inconnu" }

  const criteriaLabels = {
    subcontractingRate: "Part de sous-traitance",
    companySize: "Taille de l'entreprise",
    fiscalHistory: "Antécédents fiscaux",
    supplierCount: "Nombre de fournisseurs",
    invoiceVolume: "Volume factures mensuel",
    operationComplexity: "Complexité des opérations",
  }

  const criteriaIcons = {
    subcontractingRate: Users,
    companySize: Building,
    fiscalHistory: History,
    supplierCount: Package,
    invoiceVolume: FileText,
    operationComplexity: Network,
  }

  const getCriteriaDescription = (key: string, value: number) => {
    const descriptions = {
      subcontractingRate: ["< 20%", "20-50%", "> 50%"],
      companySize: ["< 2M€ CA", "2-10M€ CA", "> 10M€ CA"],
      fiscalHistory: ["Aucun contrôle/conforme", "Observations mineures", "Redressements passés"],
      supplierCount: ["< 10 réguliers", "10-30", "> 30 et changeants"],
      invoiceVolume: ["< 50", "50-200", "> 200"],
      operationComplexity: ["Chantier local simple", "Plusieurs chantiers", "Multi-chantiers internationaux"],
    }
    return descriptions[key as keyof typeof descriptions]?.[value] || "Non défini"
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "faible":
        return "text-accent"
      case "modéré":
        return "text-secondary"
      case "élevé":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "faible":
        return CheckCircle
      case "modéré":
        return AlertTriangle
      case "élevé":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "faible":
        return "default"
      case "modéré":
        return "secondary"
      case "élevé":
        return "destructive"
      default:
        return "default"
    }
  }

  const RiskIcon = getRiskIcon(data.riskLevel)
  const riskPercentage = (data.riskScore / 12) * 100

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-foreground text-balance">Résultats d'Analyse</h1>
          <p className="text-muted-foreground mt-2 text-lg text-pretty">Rapport détaillé de détection de fraude TVA</p>
        </div>
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <DeepSeekLogo size="lg" animated={true} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <RiskIcon className={`h-6 w-6 ${getRiskColor(data.riskLevel)}`} />
                  </motion.div>
                  Évaluation Globale
                  <DeepSeekLogo size="sm" showText={false} animated={true} />
                  {data.aiMessage && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>
                  Analyse complétée le {new Date(data.createdAt).toLocaleDateString("fr-FR")} • Powered by DeepSeek AI
                </CardDescription>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                <Badge variant={getRiskBadgeVariant(data.riskLevel)} className="text-lg px-4 py-2">
                  Risque {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {data.aiMessage && (
                <motion.div
                  className="mb-6 p-4 bg-primary rounded-lg text-primary-foreground"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <DeepSeekLogo size="sm" showText={false} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold">Analyse IA DeepSeek</p>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Sparkles className="h-4 w-4 text-yellow-300" />
                        </motion.div>
                      </div>
                      <p className="text-sm leading-relaxed text-pretty">{data.aiMessage}</p>
                      {data.confidence && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 bg-primary-foreground/20 rounded-full h-2">
                            <motion.div
                              className="bg-primary-foreground h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${data.confidence}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs font-medium">Confiance: {data.confidence}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Entreprise", value: company.name, detail: `SIRET: ${company.siret}` },
                { label: "Score de Risque", value: `${data.riskScore}/12`, detail: "Progression", showProgress: true },
                { label: "Fournisseur", value: supplier.name, detail: `Spécialité: ${supplier.speciality || "N/A"}` },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <p className="text-sm font-medium text-card-foreground mb-2">{item.label}</p>
                  <p className="text-lg font-bold text-balance">{item.value}</p>
                  {item.showProgress ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1">
                        <Progress value={riskPercentage} className="h-3" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-pretty">{item.detail}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="shadow-lg transition-optimized">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Grille d'Évaluation des Risques
                <DeepSeekLogo size="sm" showText={false} />
              </CardTitle>
              <CardDescription>Analyse détaillée selon les 6 critères de fraude TVA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {Object.entries(data.criteria || {}).map(([key, value], index) => {
                    const Icon = criteriaIcons[key as keyof typeof criteriaIcons]
                    const numValue = value as number
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                          <div>
                            <p className="font-medium text-card-foreground text-balance">
                              {criteriaLabels[key as keyof typeof criteriaLabels] || key}
                            </p>
                            <p className="text-sm text-muted-foreground text-pretty">
                              {getCriteriaDescription(key, numValue)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={numValue === 0 ? "default" : numValue === 1 ? "secondary" : "destructive"}>
                            {numValue} pt{numValue > 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
              <motion.div
                className="mt-4 p-3 bg-muted rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <p className="text-sm font-medium">Interprétation du Score:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• 0-4 pts: Risque faible</li>
                  <li>• 5-8 pts: Risque modéré</li>
                  <li>• 9-12 pts: Risque élevé</li>
                </ul>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="shadow-lg transition-optimized">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Arbre Décisionnel IA
                <DeepSeekLogo size="sm" showText={false} />
              </CardTitle>
              <CardDescription>Processus de décision automatisé par DeepSeek</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    title: "Extraction des données",
                    desc: "Facture analysée avec succès",
                    color: "text-primary",
                  },
                  {
                    icon: CheckCircle,
                    title: "Vérification TVA",
                    desc: "Numéro TVA valide et actif",
                    color: "text-primary",
                  },
                  {
                    icon: RiskIcon,
                    title: "Évaluation finale",
                    desc: `Score ${data.riskScore}/12 → Risque ${data.riskLevel.toLowerCase()}`,
                    color: getRiskColor(data.riskLevel),
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-l-4 border-l-primary"
                    whileHover={{ scale: 1.02 }}
                  >
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                    <div>
                      <p className="font-medium text-balance">{step.title}</p>
                      <p className="text-sm text-muted-foreground text-pretty">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence>
                  {data.riskLevel === "élevé" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 1.4 }}
                      className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border-l-4 border-l-destructive"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </motion.div>
                      <div>
                        <p className="font-medium text-destructive text-balance">Contrôle recommandé</p>
                        <p className="text-sm text-muted-foreground text-pretty">Audit approfondi suggéré</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="shadow-lg transition-optimized">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recommandations Personnalisées
              <DeepSeekLogo size="sm" showText={false} />
            </CardTitle>
            <CardDescription>Actions suggérées basées sur l'analyse IA DeepSeek</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {data.recommendations && data.recommendations.length > 0 ? (
                  data.recommendations.map((recommendation: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-pretty">{recommendation}</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-balance">Analyse standard</p>
                      <p className="text-sm text-muted-foreground text-pretty">
                        Continuez la surveillance habituelle de cette entreprise.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Button
          className="flex items-center gap-2 transition-optimized"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="h-4 w-4" />
          Télécharger le Rapport
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 transition-optimized bg-transparent"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="h-4 w-4" />
          Voir les Détails Techniques
        </Button>
      </motion.div>
    </motion.div>
  )
}
