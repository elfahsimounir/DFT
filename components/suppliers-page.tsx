"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, MapPin, AlertTriangle } from "lucide-react"
import { getSuppliers, saveSupplier, updateSupplier, deleteSupplier, type Supplier } from "@/lib/storage"

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
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
    loadSuppliers()
  }, [])

  const loadSuppliers = () => {
    setSuppliers(getSuppliers())
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.siret.includes(searchTerm) ||
      supplier.speciality.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRisk = riskFilter === "all" || supplier.riskLevel === riskFilter

    return matchesSearch && matchesRisk
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData)
    } else {
      saveSupplier(formData)
    }

    resetForm()
    loadSuppliers()
    setIsDialogOpen(false)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      siret: supplier.siret,
      address: supplier.address,
      city: supplier.city,
      postalCode: supplier.postalCode,
      phone: supplier.phone,
      email: supplier.email,
      speciality: supplier.speciality,
      riskLevel: supplier.riskLevel,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      deleteSupplier(id)
      loadSuppliers()
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
      speciality: "",
      riskLevel: "faible",
    })
    setEditingSupplier(null)
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
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

  const getRiskIcon = (risk: string) => {
    if (risk === "élevé") return <AlertTriangle className="h-3 w-3" />
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Fournisseurs</h1>
          <p className="text-muted-foreground mt-2">Gérez vos fournisseurs et leur niveau de risque</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Modifier le fournisseur" : "Nouveau fournisseur"}</DialogTitle>
              <DialogDescription>
                {editingSupplier ? "Modifiez les informations du fournisseur" : "Ajoutez un nouveau fournisseur"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du fournisseur *</Label>
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
                  <Label htmlFor="speciality">Spécialité *</Label>
                  <Input
                    id="speciality"
                    value={formData.speciality}
                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Niveau de risque</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value: any) => setFormData({ ...formData, riskLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faible">Faible</SelectItem>
                      <SelectItem value="modéré">Modéré</SelectItem>
                      <SelectItem value="élevé">Élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingSupplier ? "Modifier" : "Ajouter"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Fournisseurs ({filteredSuppliers.length})
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, SIRET ou spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Niveau de risque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les risques</SelectItem>
                  <SelectItem value="faible">Risque faible</SelectItem>
                  <SelectItem value="modéré">Risque modéré</SelectItem>
                  <SelectItem value="élevé">Risque élevé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <Badge variant={getRiskBadgeVariant(supplier.riskLevel)} className="flex items-center gap-1">
                        {getRiskIcon(supplier.riskLevel)}
                        {supplier.riskLevel.charAt(0).toUpperCase() + supplier.riskLevel.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">SIRET: {supplier.siret}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {supplier.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.address}, {supplier.city} {supplier.postalCode}
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                      )}
                      {supplier.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <span>
                        <strong>Spécialité:</strong> {supplier.speciality}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || riskFilter !== "all" ? "Aucun fournisseur trouvé" : "Aucun fournisseur enregistré"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
