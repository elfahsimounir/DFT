"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { getCompanies, saveCompany, updateCompany, deleteCompany, type Company } from "@/lib/storage"

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = () => {
    setCompanies(getCompanies())
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.siret.includes(searchTerm) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCompany) {
      updateCompany(editingCompany.id, formData)
    } else {
      saveCompany(formData)
    }

    resetForm()
    loadCompanies()
    setIsDialogOpen(false)
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      siret: company.siret,
      address: company.address,
      city: company.city,
      postalCode: company.postalCode,
      phone: company.phone,
      email: company.email,
      sector: company.sector,
      turnover: company.turnover,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      deleteCompany(id)
      loadCompanies()
    }
  }

  const resetForm = () => {
    setFormData({
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
    setEditingCompany(null)
  }

  const getTurnoverBadge = (turnover: number) => {
    if (turnover > 10000000) return { variant: "destructive" as const, label: "Grande" }
    if (turnover > 2000000) return { variant: "secondary" as const, label: "Moyenne" }
    return { variant: "default" as const, label: "Petite" }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Entreprises</h1>
          <p className="text-muted-foreground mt-2">Gérez vos entreprises clientes</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Entreprise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Modifier l'entreprise" : "Nouvelle entreprise"}</DialogTitle>
              <DialogDescription>
                {editingCompany
                  ? "Modifiez les informations de l'entreprise"
                  : "Ajoutez une nouvelle entreprise cliente"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    value={formData.siret}
                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turnover">Chiffre d'affaires (€)</Label>
                  <Input
                    id="turnover"
                    type="number"
                    value={formData.turnover}
                    onChange={(e) => setFormData({ ...formData, turnover: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingCompany ? "Modifier" : "Ajouter"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Entreprises ({filteredCompanies.length})
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, SIRET ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => {
              const turnoverBadge = getTurnoverBadge(company.turnover)
              return (
                <div key={company.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <Badge variant={turnoverBadge.variant}>{turnoverBadge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">SIRET: {company.siret}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {company.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company.address}, {company.city} {company.postalCode}
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {company.phone}
                          </div>
                        )}
                        {company.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {company.email}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 text-sm">
                        <span>
                          <strong>Secteur:</strong> {company.sector}
                        </span>
                        <span>
                          <strong>CA:</strong> {company.turnover.toLocaleString()} €
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(company.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Aucune entreprise trouvée" : "Aucune entreprise enregistrée"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
