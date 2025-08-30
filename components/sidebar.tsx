"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  BarChart3,
  Upload,
  FileText,
  Settings,
  Home,
  Menu,
  ChevronDown,
  ChevronRight,
  Users,
  Building,
  Calculator,
  Shield,
  TrendingUp,
  Database,
  FileSpreadsheet,
  Receipt,
  BookOpen,
  CreditCard,
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggle }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["analysis", "advanced", "management"])

  const toggleCategory = (categoryId: string) => {
    if (isCollapsed) return
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const menuCategories = [
    {
      id: "main",
      label: "Principal",
      items: [{ id: "dashboard", label: "Tableau de Bord", icon: Home }],
    },
    {
      id: "analysis",
      label: "Analyse & Détection",
      items: [
        { id: "upload", label: "Analyser Facture", icon: Upload },
        { id: "results", label: "Résultats", icon: FileText },
        { id: "batch-analysis", label: "Analyse par Lot", icon: Database },
        { id: "risk-assessment", label: "Évaluation Risques", icon: Shield },
      ],
    },
    {
      id: "advanced",
      label: "Analyses Avancées",
      items: [
        { id: "fec-analysis", label: "Analyser FEC", icon: FileSpreadsheet },
        { id: "tva-declaration", label: "Analyser Déclaration TVA", icon: Receipt },
        { id: "journal-analysis", label: "Analyser Journaux Comptables", icon: BookOpen },
        { id: "bank-flux", label: "Analyser Flux Bancaires", icon: CreditCard },
      ],
    },
    {
      id: "management",
      label: "Gestion & Suivi",
      items: [
        { id: "reports", label: "Rapports", icon: BarChart3 },
        { id: "companies", label: "Entreprises", icon: Building },
        { id: "suppliers", label: "Fournisseurs", icon: Users },
        { id: "trends", label: "Tendances", icon: TrendingUp },
      ],
    },
    {
      id: "admin",
      label: "Administration",
      items: [
        { id: "calculator", label: "Calculateur TVA", icon: Calculator },
        { id: "settings", label: "Paramètres", icon: Settings },
      ],
    },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Détecteur Fraude TVA</h1>
              <p className="text-xs text-muted-foreground mt-1">Secteur BTP</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="p-2 space-y-1 flex-1">
        {menuCategories.map((category) => (
          <div key={category.id}>
            {category.id !== "main" && !isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs font-medium text-muted-foreground hover:text-sidebar-foreground mb-1 px-2"
                onClick={() => toggleCategory(category.id)}
              >
                <span>{category.label}</span>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}

            {(category.id === "main" || expandedCategories.includes(category.id) || isCollapsed) && (
              <div className={`space-y-1 ${category.id !== "main" && !isCollapsed ? "ml-2" : ""}`}>
                {category.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start gap-3"} ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                      onClick={() => onNavigate(item.id)}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex ${isCollapsed ? "justify-center" : "justify-between items-center"}`}>
          {!isCollapsed && <span className="text-xs text-muted-foreground">Thème</span>}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
