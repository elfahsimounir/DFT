export interface Company {
  id: string
  name: string
  siret: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  sector: string
  turnover: number
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  siret: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  speciality: string
  riskLevel: "faible" | "modéré" | "élevé"
  createdAt: string
}

export interface Analysis {
  id: string
  companyId: string
  supplierId: string
  invoiceFile?: string
  invoiceUrl?: string
  riskScore: number
  riskLevel: "faible" | "modéré" | "élevé"
  criteria: {
    subcontractingRate: number
    companySize: number
    fiscalHistory: number
    supplierCount: number
    invoiceVolume: number
    operationComplexity: number
  }
  recommendations: string[]
  aiMessage?: string
  confidence: number
  createdAt: string
}

// Storage keys
const COMPANIES_KEY = "tva-fraud-companies"
const SUPPLIERS_KEY = "tva-fraud-suppliers"
const ANALYSES_KEY = "tva-fraud-analyses"
const FEC_ANALYSES_KEY = "tva-fraud-fec-analyses"
const TVA_DECLARATIONS_KEY = "tva-fraud-tva-declarations"
const JOURNAL_ANALYSES_KEY = "tva-fraud-journal-analyses"
const BANK_FLUX_ANALYSES_KEY = "tva-fraud-bank-flux-analyses"

// Company management
export const getCompanies = (): Company[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(COMPANIES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveCompany = (company: Omit<Company, "id" | "createdAt">): Company => {
  const companies = getCompanies()
  const newCompany: Company = {
    ...company,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  companies.push(newCompany)
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies))
  return newCompany
}

export const updateCompany = (id: string, updates: Partial<Company>): Company | null => {
  const companies = getCompanies()
  const index = companies.findIndex((c) => c.id === id)
  if (index === -1) return null

  companies[index] = { ...companies[index], ...updates }
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies))
  return companies[index]
}

export const deleteCompany = (id: string): boolean => {
  const companies = getCompanies()
  const filtered = companies.filter((c) => c.id !== id)
  if (filtered.length === companies.length) return false

  localStorage.setItem(COMPANIES_KEY, JSON.stringify(filtered))
  return true
}

// Supplier management
export const getSuppliers = (): Supplier[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(SUPPLIERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveSupplier = (supplier: Omit<Supplier, "id" | "createdAt">): Supplier => {
  const suppliers = getSuppliers()
  const newSupplier: Supplier = {
    ...supplier,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  suppliers.push(newSupplier)
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers))
  return newSupplier
}

export const updateSupplier = (id: string, updates: Partial<Supplier>): Supplier | null => {
  const suppliers = getSuppliers()
  const index = suppliers.findIndex((s) => s.id === id)
  if (index === -1) return null

  suppliers[index] = { ...suppliers[index], ...updates }
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers))
  return suppliers[index]
}

export const deleteSupplier = (id: string): boolean => {
  const suppliers = getSuppliers()
  const filtered = suppliers.filter((s) => s.id !== id)
  if (filtered.length === suppliers.length) return false

  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(filtered))
  return true
}

// Analysis management
export const getAnalyses = (): Analysis[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ANALYSES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveAnalysis = (analysis: Omit<Analysis, "id" | "createdAt">): Analysis => {
  const analyses = getAnalyses()
  const newAnalysis: Analysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  analyses.push(newAnalysis)
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses))
  return newAnalysis
}

// New interfaces for advanced analyses
export interface FECAnalysis {
  id: string
  type: "fec"
  companyId: string
  period: {
    startDate: string
    endDate: string
  }
  fileName: string
  status: "pending" | "completed" | "error"
  riskScore: number
  riskLevel: "faible" | "modéré" | "élevé"
  findings: string[]
  aiMessage: string
  confidence: number
  anomalies: {
    type: string
    description: string
    severity: "low" | "medium" | "high"
  }[]
  createdAt: string
}

export interface TVADeclarationAnalysis {
  id: string
  type: "tva"
  companyId: string
  period: {
    startDate: string
    endDate: string
  }
  fileName: string
  status: "pending" | "completed" | "error"
  riskScore: number
  riskLevel: "faible" | "modéré" | "élevé"
  findings: string[]
  aiMessage: string
  confidence: number
  anomalies: {
    type: string
    description: string
    severity: "low" | "medium" | "high"
  }[]
  createdAt: string
}

export interface JournalAnalysis {
  id: string
  type: "journal"
  companyId: string
  period: {
    startDate: string
    endDate: string
  }
  fileName: string
  status: "pending" | "completed" | "error"
  riskScore: number
  riskLevel: "faible" | "modéré" | "élevé"
  findings: string[]
  aiMessage: string
  confidence: number
  anomalies: {
    type: string
    description: string
    severity: "low" | "medium" | "high"
  }[]
  createdAt: string
}

export interface BankFluxAnalysis {
  id: string
  type: "bank"
  companyId: string
  period: {
    startDate: string
    endDate: string
  }
  fileName: string
  status: "pending" | "completed" | "error"
  riskScore: number
  riskLevel: "faible" | "modéré" | "élevé"
  findings: string[]
  aiMessage: string
  confidence: number
  anomalies: {
    type: string
    description: string
    severity: "low" | "medium" | "high"
  }[]
  createdAt: string
}

// Management functions for FEC analyses
export const getFECAnalyses = (): FECAnalysis[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(FEC_ANALYSES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveFECAnalysis = (analysis: Omit<FECAnalysis, "id" | "createdAt">): FECAnalysis => {
  const analyses = getFECAnalyses()
  const newAnalysis: FECAnalysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  analyses.push(newAnalysis)
  localStorage.setItem(FEC_ANALYSES_KEY, JSON.stringify(analyses))

  // Emit update event
  emitAnalysisEvent("analysis:completed", newAnalysis)
  return newAnalysis
}

// Management functions for TVA declarations
export const getTVADeclarations = (): TVADeclarationAnalysis[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(TVA_DECLARATIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveTVADeclaration = (
  analysis: Omit<TVADeclarationAnalysis, "id" | "createdAt">,
): TVADeclarationAnalysis => {
  const analyses = getTVADeclarations()
  const newAnalysis: TVADeclarationAnalysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  analyses.push(newAnalysis)
  localStorage.setItem(TVA_DECLARATIONS_KEY, JSON.stringify(analyses))

  // Emit update event
  emitAnalysisEvent("analysis:completed", newAnalysis)
  return newAnalysis
}

// Management functions for journal analyses
export const getJournalAnalyses = (): JournalAnalysis[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(JOURNAL_ANALYSES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveJournalAnalysis = (analysis: Omit<JournalAnalysis, "id" | "createdAt">): JournalAnalysis => {
  const analyses = getJournalAnalyses()
  const newAnalysis: JournalAnalysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  analyses.push(newAnalysis)
  localStorage.setItem(JOURNAL_ANALYSES_KEY, JSON.stringify(analyses))

  // Emit update event
  emitAnalysisEvent("analysis:completed", newAnalysis)
  return newAnalysis
}

// Management functions for bank flux analyses
export const getBankFluxAnalyses = (): BankFluxAnalysis[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BANK_FLUX_ANALYSES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveBankFluxAnalysis = (analysis: Omit<BankFluxAnalysis, "id" | "createdAt">): BankFluxAnalysis => {
  const analyses = getBankFluxAnalyses()
  const newAnalysis: BankFluxAnalysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  analyses.push(newAnalysis)
  localStorage.setItem(BANK_FLUX_ANALYSES_KEY, JSON.stringify(analyses))

  // Emit update event
  emitAnalysisEvent("analysis:completed", newAnalysis)
  return newAnalysis
}

// Event system for real-time updates
type AnalysisEventType = "analysis:completed"
type AnalysisEventData = FECAnalysis | TVADeclarationAnalysis | JournalAnalysis | BankFluxAnalysis

const eventListeners: { [key: string]: ((data: any) => void)[] } = {}

export const addEventListener = (event: AnalysisEventType, callback: (data: AnalysisEventData) => void) => {
  if (!eventListeners[event]) {
    eventListeners[event] = []
  }
  eventListeners[event].push(callback)
}

export const removeEventListener = (event: AnalysisEventType, callback: (data: AnalysisEventData) => void) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter((cb) => cb !== callback)
  }
}

const emitAnalysisEvent = (event: AnalysisEventType, data: AnalysisEventData) => {
  if (eventListeners[event]) {
    eventListeners[event].forEach((callback) => callback(data))
  }
}

// Updated statistics to include all analyses
export const getAdvancedStats = () => {
  const invoiceAnalyses = getAnalyses()
  const fecAnalyses = getFECAnalyses()
  const tvaAnalyses = getTVADeclarations()
  const journalAnalyses = getJournalAnalyses()
  const bankAnalyses = getBankFluxAnalyses()

  const allAnalyses = [...invoiceAnalyses, ...fecAnalyses, ...tvaAnalyses, ...journalAnalyses, ...bankAnalyses]

  const total = allAnalyses.length

  if (total === 0) {
    return {
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
    }
  }

  const riskCounts = allAnalyses.reduce(
    (acc, analysis) => {
      acc[analysis.riskLevel]++
      return acc
    },
    { faible: 0, modéré: 0, élevé: 0 },
  )

  const fraudCount = allAnalyses.filter((a) => a.riskLevel === "élevé").length

  return {
    totalAnalyses: total,
    fraudRate: Math.round((fraudCount / total) * 100),
    riskDistribution: riskCounts,
    byType: {
      invoice: invoiceAnalyses.length,
      fec: fecAnalyses.length,
      tva: tvaAnalyses.length,
      journal: journalAnalyses.length,
      bank: bankAnalyses.length,
    },
  }
}

export const getCompanyRiskStats = () => {
  const companies = getCompanies()
  const analyses = getAnalyses()

  return companies.map((company) => {
    const companyAnalyses = analyses.filter((a) => a.companyId === company.id)
    const avgRiskScore =
      companyAnalyses.length > 0 ? companyAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / companyAnalyses.length : 0

    const riskLevel = avgRiskScore <= 4 ? "faible" : avgRiskScore <= 8 ? "modéré" : "élevé"

    return {
      ...company,
      analysisCount: companyAnalyses.length,
      avgRiskScore: Math.round(avgRiskScore * 10) / 10,
      riskLevel,
      lastAnalysis: companyAnalyses.length > 0 ? companyAnalyses[companyAnalyses.length - 1].createdAt : null,
    }
  })
}

export const getSupplierRiskStats = () => {
  const suppliers = getSuppliers()
  const analyses = getAnalyses()

  return suppliers.map((supplier) => {
    const supplierAnalyses = analyses.filter((a) => a.supplierId === supplier.id)
    const avgRiskScore =
      supplierAnalyses.length > 0
        ? supplierAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / supplierAnalyses.length
        : 0

    const riskLevel = avgRiskScore <= 4 ? "faible" : avgRiskScore <= 8 ? "modéré" : "élevé"

    return {
      ...supplier,
      analysisCount: supplierAnalyses.length,
      avgRiskScore: Math.round(avgRiskScore * 10) / 10,
      riskLevel,
      lastAnalysis: supplierAnalyses.length > 0 ? supplierAnalyses[supplierAnalyses.length - 1].createdAt : null,
    }
  })
}

export const updateEntityRiskLevels = (companyId: string, supplierId: string) => {
  const analyses = getAnalyses()

  // Update supplier risk level
  const supplierAnalyses = analyses.filter((a) => a.supplierId === supplierId)
  if (supplierAnalyses.length > 0) {
    const avgRiskScore = supplierAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / supplierAnalyses.length
    const newRiskLevel = avgRiskScore <= 4 ? "faible" : avgRiskScore <= 8 ? "modéré" : "élevé"
    updateSupplier(supplierId, { riskLevel: newRiskLevel })
  }
}

// Initialize demo data
export const initializeDemoData = () => {
  if (getCompanies().length === 0) {
    const demoCompanies: Omit<Company, "id" | "createdAt">[] = [
      {
        name: "BTP Constructions SA",
        siret: "12345678901234",
        address: "123 Rue de la Construction",
        city: "Paris",
        postalCode: "75001",
        phone: "01 23 45 67 89",
        email: "contact@btpconstructions.fr",
        sector: "Gros œuvre",
        turnover: 5000000,
      },
      {
        name: "Rénovation Plus SARL",
        siret: "98765432109876",
        address: "456 Avenue des Travaux",
        city: "Lyon",
        postalCode: "69001",
        phone: "04 56 78 90 12",
        email: "info@renovationplus.fr",
        sector: "Rénovation",
        turnover: 2500000,
      },
      {
        name: "Leroy Merlin brie-Comte-Robert",
        siret: "33344455566677",
        address: "789 Zone Industrielle",
        city: "Brie-Comte-Robert",
        postalCode: "77170",
        phone: "01 64 05 12 34",
        email: "magasin@leroymerlin-bcr.fr",
        sector: "Distribution matériaux",
        turnover: 15000000,
      },
      {
        name: "Entreprise Dubois & Fils",
        siret: "44455566677788",
        address: "15 Rue des Artisans",
        city: "Nantes",
        postalCode: "44000",
        phone: "02 40 12 34 56",
        email: "contact@duboisetfils.fr",
        sector: "Charpente",
        turnover: 1800000,
      },
      {
        name: "Maçonnerie Moderne",
        siret: "55566677788899",
        address: "78 Boulevard du Bâtiment",
        city: "Bordeaux",
        postalCode: "33000",
        phone: "05 56 78 90 12",
        email: "info@maconnerie-moderne.fr",
        sector: "Maçonnerie",
        turnover: 3200000,
      },
      {
        name: "Électricité Générale Sud",
        siret: "66677788899000",
        address: "42 Avenue de l'Électricité",
        city: "Nice",
        postalCode: "06000",
        phone: "04 93 45 67 89",
        email: "contact@eg-sud.fr",
        sector: "Électricité",
        turnover: 2800000,
      },
      {
        name: "Plomberie Express",
        siret: "77788899000111",
        address: "9 Rue de la Plomberie",
        city: "Strasbourg",
        postalCode: "67000",
        phone: "03 88 12 34 56",
        email: "urgence@plomberie-express.fr",
        sector: "Plomberie",
        turnover: 1500000,
      },
      {
        name: "Toiture & Couverture",
        siret: "88899000111222",
        address: "25 Chemin des Toits",
        city: "Lille",
        postalCode: "59000",
        phone: "03 20 56 78 90",
        email: "devis@toiture-couverture.fr",
        sector: "Couverture",
        turnover: 2100000,
      },
      {
        name: "Groupe Vinci Construction",
        siret: "99900011122233",
        address: "100 Avenue des Grands Travaux",
        city: "La Défense",
        postalCode: "92400",
        phone: "01 47 16 35 00",
        email: "contact@vinci-construction.fr",
        sector: "Grands travaux",
        turnover: 45000000,
      },
      {
        name: "Bouygues Bâtiment IDF",
        siret: "11122233344455",
        address: "32 Avenue Hoche",
        city: "Paris",
        postalCode: "75008",
        phone: "01 30 60 33 00",
        email: "idf@bouygues-batiment.fr",
        sector: "Bâtiment",
        turnover: 38000000,
      },
    ]

    demoCompanies.forEach((company) => saveCompany(company))
  }

  if (getSuppliers().length === 0) {
    const demoSuppliers: Omit<Supplier, "id" | "createdAt">[] = [
      {
        name: "Matériaux Pro",
        siret: "11111111111111",
        address: "789 Zone Industrielle",
        city: "Marseille",
        postalCode: "13001",
        phone: "04 91 23 45 67",
        email: "vente@materiauxpro.fr",
        speciality: "Matériaux de construction",
        riskLevel: "faible",
      },
      {
        name: "Équipements BTP",
        siret: "22222222222222",
        address: "321 Rue de l'Industrie",
        city: "Toulouse",
        postalCode: "31000",
        phone: "05 61 23 45 67",
        email: "contact@equipementsbtp.fr",
        speciality: "Location d'équipements",
        riskLevel: "modéré",
      },
      {
        name: "BETON PADUA",
        siret: "33333333333333",
        address: "156 Route Industrielle",
        city: "Padua",
        postalCode: "35000",
        phone: "02 99 87 65 43",
        email: "commandes@beton-padua.fr",
        speciality: "Béton prêt à l'emploi",
        riskLevel: "modéré",
      },
      {
        name: "Acier & Métaux SA",
        siret: "44444444444444",
        address: "67 Zone Métallurgique",
        city: "Saint-Étienne",
        postalCode: "42000",
        phone: "04 77 12 34 56",
        email: "vente@acier-metaux.fr",
        speciality: "Structures métalliques",
        riskLevel: "élevé",
      },
      {
        name: "Isolation Thermique Plus",
        siret: "55555555555555",
        address: "89 Rue de l'Isolation",
        city: "Grenoble",
        postalCode: "38000",
        phone: "04 76 54 32 10",
        email: "info@isolation-plus.fr",
        speciality: "Matériaux d'isolation",
        riskLevel: "faible",
      },
      {
        name: "Carrelage & Sols",
        siret: "66666666666666",
        address: "234 Avenue des Revêtements",
        city: "Montpellier",
        postalCode: "34000",
        phone: "04 67 89 01 23",
        email: "showroom@carrelage-sols.fr",
        speciality: "Revêtements de sol",
        riskLevel: "faible",
      },
      {
        name: "Menuiserie Artisanale",
        siret: "77777777777777",
        address: "12 Impasse du Bois",
        city: "Angers",
        postalCode: "49000",
        phone: "02 41 23 45 67",
        email: "atelier@menuiserie-artisanale.fr",
        speciality: "Menuiserie sur mesure",
        riskLevel: "modéré",
      },
      {
        name: "Peinture & Finitions",
        siret: "88888888888888",
        address: "45 Rue des Couleurs",
        city: "Rennes",
        postalCode: "35000",
        phone: "02 99 76 54 32",
        email: "devis@peinture-finitions.fr",
        speciality: "Peinture bâtiment",
        riskLevel: "faible",
      },
      {
        name: "Transports Lourds BTP",
        siret: "99999999999999",
        address: "78 Zone Logistique",
        city: "Le Havre",
        postalCode: "76000",
        phone: "02 35 12 34 56",
        email: "planning@transports-lourds.fr",
        speciality: "Transport de matériaux",
        riskLevel: "élevé",
      },
      {
        name: "Outillage Professionnel",
        siret: "10101010101010",
        address: "56 Rue de l'Outillage",
        city: "Clermont-Ferrand",
        postalCode: "63000",
        phone: "04 73 98 76 54",
        email: "vente@outillage-pro.fr",
        speciality: "Outils et machines",
        riskLevel: "modéré",
      },
      {
        name: "Lafarge Holcim France",
        siret: "12121212121212",
        address: "61 Rue des Bâtisseurs",
        city: "Malakoff",
        postalCode: "92240",
        phone: "01 44 34 11 11",
        email: "france@lafargeholcim.com",
        speciality: "Ciment et granulats",
        riskLevel: "faible",
      },
      {
        name: "Saint-Gobain Distribution",
        siret: "13131313131313",
        address: "18 Avenue d'Alsace",
        city: "Courbevoie",
        postalCode: "92400",
        phone: "01 88 54 84 00",
        email: "distribution@saint-gobain.com",
        speciality: "Matériaux de construction",
        riskLevel: "faible",
      },
    ]

    demoSuppliers.forEach((supplier) => saveSupplier(supplier))
  }

  if (getAnalyses().length === 0) {
    const companies = getCompanies()
    const suppliers = getSuppliers()

    if (companies.length > 0 && suppliers.length > 0) {
      const demoAnalyses: Omit<Analysis, "id" | "createdAt">[] = [
        {
          companyId: companies[2]?.id || companies[0].id,
          supplierId: suppliers[2]?.id || suppliers[0].id,
          riskScore: 8,
          riskLevel: "modéré",
          criteria: {
            subcontractingRate: 2,
            companySize: 2,
            fiscalHistory: 1,
            supplierCount: 1,
            invoiceVolume: 2,
            operationComplexity: 0,
          },
          recommendations: [
            "Surveiller les factures de montant élevé",
            "Vérifier la cohérence des prestations facturées",
            "Contrôler les justificatifs de sous-traitance",
          ],
          aiMessage:
            "Analyse détectée : Risque modéré identifié principalement dû au volume important de sous-traitance et à la taille de l'entreprise.",
          confidence: 85,
        },
        {
          companyId: companies[0]?.id || companies[0].id,
          supplierId: suppliers[3]?.id || suppliers[1].id,
          riskScore: 10,
          riskLevel: "élevé",
          criteria: {
            subcontractingRate: 2,
            companySize: 2,
            fiscalHistory: 2,
            supplierCount: 2,
            invoiceVolume: 2,
            operationComplexity: 0,
          },
          recommendations: [
            "Contrôle fiscal approfondi recommandé",
            "Vérification des antécédents du fournisseur",
          ],
          aiMessage:
            "Alerte : Niveau de risque élevé détecté. Combinaison de facteurs critiques incluant des antécédents fiscaux.",
          confidence: 92,
        },
        {
          companyId: companies[1]?.id || companies[0].id,
          supplierId: suppliers[0]?.id || suppliers[0].id,
          riskScore: 3,
          riskLevel: "faible",
          criteria: {
            subcontractingRate: 0,
            companySize: 1,
            fiscalHistory: 0,
            supplierCount: 1,
            invoiceVolume: 1,
            operationComplexity: 0,
          },
          recommendations: [
            "Situation normale, surveillance standard",
            "Maintenir les contrôles périodiques habituels",
          ],
          aiMessage:
            "Analyse normale : Profil de risque faible, entreprise en conformité avec les standards du secteur.",
          confidence: 78,
        },
        {
          companyId: companies[8]?.id || companies[0].id,
          supplierId: suppliers[10]?.id || suppliers[1].id,
          riskScore: 11,
          riskLevel: "élevé",
          criteria: {
            subcontractingRate: 2,
            companySize: 2,
            fiscalHistory: 2,
            supplierCount: 2,
            invoiceVolume: 2,
            operationComplexity: 1,
          },
          recommendations: [
            "Vérification des contrats de sous-traitance",
            "Contrôle des flux financiers",
          ],
          aiMessage:
            "Alerte critique : Risque très élevé détecté sur une grande entreprise avec historique fiscal complexe.",
          confidence: 95,
        },
        {
          companyId: companies[5]?.id || companies[0].id,
          supplierId: suppliers[7]?.id || suppliers[0].id,
          riskScore: 2,
          riskLevel: "faible",
          criteria: {
            subcontractingRate: 0,
            companySize: 1,
            fiscalHistory: 0,
            supplierCount: 0,
            invoiceVolume: 1,
            operationComplexity: 0,
          },
          recommendations: ["Profil exemplaire", "Maintenir la surveillance de routine"],
          aiMessage: "Excellent profil : Entreprise avec un très faible niveau de risque, pratiques conformes.",
          confidence: 89,
        },
        {
          companyId: companies[7]?.id || companies[0].id,
          supplierId: suppliers[8]?.id || suppliers[1].id,
          riskScore: 9,
          riskLevel: "élevé",
          criteria: {
            subcontractingRate: 2,
            companySize: 1,
            fiscalHistory: 1,
            supplierCount: 2,
            invoiceVolume: 2,
            operationComplexity: 1,
          },
          recommendations: [
            "Vérification urgente des contrats de transport",
            "Contrôle des factures de sous-traitance",

          ],
          aiMessage: "Attention : Risque élevé identifié, particulièrement sur les opérations de transport.",
          confidence: 88,
        },
      ]

      demoAnalyses.forEach((analysis, index) => {
        const daysAgo = Math.floor(Math.random() * 90) + 1
        const analysisWithDate = {
          ...analysis,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        }
        saveAnalysis(analysisWithDate)
      })
    }
  }

  if (getFECAnalyses().length === 0) {
    const companies = getCompanies()
    if (companies.length > 0) {
      const demoFECAnalyses: Omit<FECAnalysis, "id" | "createdAt">[] = [
        {
          type: "fec",
          companyId: companies[0]?.id || companies[0].id,
          period: {
            startDate: "2024-01-01",
            endDate: "2024-12-31",
          },
          fileName: "FEC_2024_BTP_Constructions.txt",
          status: "completed",
          riskScore: 7,
          riskLevel: "modéré",
          findings: [
            "Écritures comptables cohérentes",
            "Quelques anomalies mineures détectées",
            "Respect général des normes comptables",
          ],
          aiMessage:
            "Analyse FEC : Fichier conforme avec quelques points d'attention sur les écritures de fin d'exercice.",
          confidence: 82,
          anomalies: [
            {
              type: "Écriture manquante",
              description: "Absence d'écriture de régularisation en décembre",
              severity: "medium",
            },
            {
              type: "Montant inhabituel",
              description: "Facture fournisseur d'un montant exceptionnellement élevé",
              severity: "low",
            },
          ],
        },
        {
          type: "fec",
          companyId: companies[8]?.id || companies[0].id,
          period: {
            startDate: "2024-01-01",
            endDate: "2024-12-31",
          },
          fileName: "FEC_2024_Vinci_Construction.txt",
          status: "completed",
          riskScore: 9,
          riskLevel: "élevé",
          findings: [
            "Écritures complexes détectées",
            "Plusieurs anomalies significatives",
            "Nécessite un contrôle approfondi",
          ],
          aiMessage: "Alerte FEC : Détection d'anomalies importantes dans les écritures comptables.",
          confidence: 91,
          anomalies: [
            {
              type: "Écriture suspecte",
              description: "Mouvements financiers inhabituels en fin d'exercice",
              severity: "high",
            },
            {
              type: "Incohérence",
              description: "Décalage entre les factures et les paiements",
              severity: "medium",
            },
          ],
        },
      ]

      demoFECAnalyses.forEach((analysis, index) => {
        const daysAgo = Math.floor(Math.random() * 60) + 1
        const analysisWithDate = {
          ...analysis,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        }
        saveFECAnalysis(analysisWithDate)
      })
    }
  }

  if (getTVADeclarations().length === 0) {
    const companies = getCompanies()
    if (companies.length > 0) {
      const demoTVAAnalyses: Omit<TVADeclarationAnalysis, "id" | "createdAt">[] = [
        {
          type: "tva",
          companyId: companies[1]?.id || companies[0].id,
          period: {
            startDate: "2024-10-01",
            endDate: "2024-12-31",
          },
          fileName: "Declaration_TVA_T4_2024.pdf",
          status: "completed",
          riskScore: 4,
          riskLevel: "faible",
          findings: [
            "Déclaration cohérente avec l'activité",
            "Taux de TVA correctement appliqués",
            "Aucune anomalie majeure détectée",
          ],
          aiMessage: "Déclaration TVA conforme : Aucun signal d'alerte, déclaration en adéquation avec l'activité BTP.",
          confidence: 87,
          anomalies: [
            {
              type: "Information manquante",
              description: "Détail insuffisant sur certaines opérations",
              severity: "low",
            },
          ],
        },
        {
          type: "tva",
          companyId: companies[3]?.id || companies[0].id,
          period: {
            startDate: "2024-07-01",
            endDate: "2024-09-30",
          },
          fileName: "Declaration_TVA_T3_2024.pdf",
          status: "completed",
          riskScore: 8,
          riskLevel: "modéré",
          findings: [
            "Variations importantes de TVA collectée",
            "Écarts avec les déclarations précédentes",
            "Nécessite des vérifications complémentaires",
          ],
          aiMessage:
            "Attention TVA : Variations significatives détectées, recommandation de vérification des factures.",
          confidence: 79,
          anomalies: [
            {
              type: "Variation anormale",
              description: "Augmentation de 40% de la TVA collectée sans justification",
              severity: "medium",
            },
            {
              type: "Taux incorrect",
              description: "Application possible d'un taux de TVA erroné",
              severity: "medium",
            },
          ],
        },
      ]

      demoTVAAnalyses.forEach((analysis, index) => {
        const daysAgo = Math.floor(Math.random() * 45) + 1
        const analysisWithDate = {
          ...analysis,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        }
        saveTVADeclaration(analysisWithDate)
      })
    }
  }

  if (getJournalAnalyses().length === 0) {
    const companies = getCompanies()
    if (companies.length > 0) {
      const demoJournalAnalyses: Omit<JournalAnalysis, "id" | "createdAt">[] = [
        {
          type: "journal",
          companyId: companies[4]?.id || companies[0].id,
          period: {
            startDate: "2024-11-01",
            endDate: "2024-11-30",
          },
          fileName: "Journal_Novembre_2024.xlsx",
          status: "completed",
          riskScore: 6,
          riskLevel: "modéré",
          findings: [
            "Écritures régulières et cohérentes",
            "Quelques opérations nécessitent clarification",
            "Respect des principes comptables",
          ],
          aiMessage:
            "Journal comptable : Analyse satisfaisante avec quelques points d'attention sur les écritures de fin de mois.",
          confidence: 84,
          anomalies: [
            {
              type: "Écriture tardive",
              description: "Plusieurs écritures saisies avec retard",
              severity: "low",
            },
            {
              type: "Libellé imprécis",
              description: "Certains libellés manquent de précision",
              severity: "low",
            },
          ],
        },
        {
          type: "journal",
          companyId: companies[6]?.id || companies[0].id,
          period: {
            startDate: "2024-10-01",
            endDate: "2024-10-31",
          },
          fileName: "Journal_Octobre_2024.xlsx",
          status: "completed",
          riskScore: 3,
          riskLevel: "faible",
          findings: ["Tenue comptable exemplaire", "Écritures bien documentées", "Aucune anomalie détectée"],
          aiMessage: "Excellent journal : Tenue comptable rigoureuse, aucun signal d'alerte identifié.",
          confidence: 93,
          anomalies: [],
        },
      ]

      demoJournalAnalyses.forEach((analysis, index) => {
        const daysAgo = Math.floor(Math.random() * 30) + 1
        const analysisWithDate = {
          ...analysis,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        }
        saveJournalAnalysis(analysisWithDate)
      })
    }
  }

  if (getBankFluxAnalyses().length === 0) {
    const companies = getCompanies()
    if (companies.length > 0) {
      const demoBankAnalyses: Omit<BankFluxAnalysis, "id" | "createdAt">[] = [
        {
          type: "bank",
          companyId: companies[2]?.id || companies[0].id,
          period: {
            startDate: "2024-11-01",
            endDate: "2024-11-30",
          },
          fileName: "Releve_Bancaire_Novembre_2024.pdf",
          status: "completed",
          riskScore: 5,
          riskLevel: "modéré",
          findings: [
            "Flux financiers cohérents avec l'activité",
            "Quelques opérations inhabituelles détectées",
            "Correspondance correcte avec la comptabilité",
          ],
          aiMessage:
            "Flux bancaires : Analyse globalement satisfaisante avec surveillance recommandée sur certaines opérations.",
          confidence: 81,
          anomalies: [
            {
              type: "Virement inhabituel",
              description: "Virement important vers un compte non référencé",
              severity: "medium",
            },
            {
              type: "Fréquence élevée",
              description: "Nombre élevé de petites transactions",
              severity: "low",
            },
          ],
        },
        {
          type: "bank",
          companyId: companies[9]?.id || companies[0].id,
          period: {
            startDate: "2024-10-01",
            endDate: "2024-10-31",
          },
          fileName: "Releve_Bancaire_Octobre_2024.pdf",
          status: "completed",
          riskScore: 10,
          riskLevel: "élevé",
          findings: [
            "Mouvements financiers complexes",
            "Plusieurs opérations suspectes identifiées",
          ],
          aiMessage:
            "Alerte flux bancaires : Détection de mouvements financiers atypiques nécessitant une investigation immédiate.",
          confidence: 94,
          anomalies: [
            {
              type: "Mouvement suspect",
              description: "Virements multiples vers des comptes offshore",
              severity: "high",
            },
            {
              type: "Montant disproportionné",
              description: "Encaissements très supérieurs au CA déclaré",
              severity: "high",
            },
            {
              type: "Timing suspect",
              description: "Opérations concentrées en fin de période",
              severity: "medium",
            },
          ],
        },
      ]

      demoBankAnalyses.forEach((analysis, index) => {
        const daysAgo = Math.floor(Math.random() * 20) + 1
        const analysisWithDate = {
          ...analysis,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        }
        saveBankFluxAnalysis(analysisWithDate)
      })
    }
  }
}
