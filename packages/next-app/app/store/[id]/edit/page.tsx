"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Save, AlertCircle, Clock, MapPin, Phone, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"

export default function EditStorePage() {
  const router = useRouter()
  const params = useParams()
  const storeId = params.id

  const [isSaving, setIsSaving] = useState(false)
  const [services, setServices] = useState([
    { id: 1, name: "Dental Checkup", description: "Routine cleaning and examination", price: "500" },
    { id: 2, name: "Root Canal", description: "Advanced root canal treatment", price: "2000" },
  ])
  const [nextServiceId, setNextServiceId] = useState(3)

  const [formData, setFormData] = useState({
    storeName: "Dr. Smith Dental Clinic",
    category: "Medical",
    description:
      "Specialists in root canals, general checkups, and cosmetic dentistry. Our clinic is equipped with state-of-the-art technology to ensure a pain-free experience. We have been serving the community for over 15 years with a focus on patient comfort and care.",
    address: "123 Healthcare Ave, Medical District",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    phone: "+1 (555) 123-4567",
    email: "contact@smithdentalclinic.com",
    openTime: "10:00",
    closeTime: "20:00",
    deposit: "20",
  })

  const categories = [
    "Medical",
    "Beauty",
    "Food & Beverage",
    "Repair & Services",
    "Retail",
    "Entertainment",
    "Professional Services",
    "Other",
  ]

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleAddService = () => {
    setServices((prev) => [...prev, { id: nextServiceId, name: "", description: "", price: "" }])
    setNextServiceId((prev) => prev + 1)
  }

  const handleRemoveService = (id: number) => {
    if (services.length > 1) {
      setServices((prev) => prev.filter((service) => service.id !== id))
    }
  }

  const handleServiceChange = (id: number, field: string, value: string) => {
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push(`/store/${storeId}`)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link
          href={`/store/${storeId}`}
          className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to store</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Edit Store</h1>
      </header>

      <div className="p-6 max-w-md lg:max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Basic Information</h3>

          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium">
              Store Name
            </Label>
            <Input
              id="storeName"
              name="storeName"
              type="text"
              value={formData.storeName}
              onChange={handleInputChange}
              className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              placeholder="Store name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-white dark:bg-zinc-900 border-border rounded-lg min-h-24 resize-none"
              placeholder="Store description"
            />
            <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h3>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Street Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="ZIP"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Details
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="Email address"
              />
            </div>
          </div>
        </div>

        {/* Services & Pricing */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Services & Pricing</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-zinc-900 rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Service {services.indexOf(service) + 1}
                  </span>
                  {services.length > 1 && (
                    <button
                      onClick={() => handleRemoveService(service.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-name-${service.id}`} className="text-sm font-medium">
                    Service Name
                  </Label>
                  <Input
                    id={`service-name-${service.id}`}
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, "name", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-border h-10 rounded-lg"
                    placeholder="Service name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-desc-${service.id}`} className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id={`service-desc-${service.id}`}
                    type="text"
                    value={service.description}
                    onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-border h-10 rounded-lg"
                    placeholder="Service description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-price-${service.id}`} className="text-sm font-medium">
                    Price (₹)
                  </Label>
                  <Input
                    id={`service-price-${service.id}`}
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, "price", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-border h-10 rounded-lg"
                    placeholder="Price"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddService}
            className="w-full py-2 px-4 rounded-lg border border-dashed border-primary text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
          >
            + Add Another Service
          </button>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Operating Hours
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="openTime" className="text-sm font-medium">
                Opening Time
              </Label>
              <Input
                id="openTime"
                name="openTime"
                type="time"
                value={formData.openTime}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeTime" className="text-sm font-medium">
                Closing Time
              </Label>
              <Input
                id="closeTime"
                name="closeTime"
                type="time"
                value={formData.closeTime}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Booking Deposit */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Booking Details
          </h3>

          <div className="space-y-2">
            <Label htmlFor="deposit" className="text-sm font-medium">
              Booking Deposit Amount (₹)
            </Label>
            <Input
              id="deposit"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleInputChange}
              className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              placeholder="Deposit amount"
              min="0"
            />
            <p className="text-xs text-muted-foreground">Amount customers must pay to join the queue</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Changes to operating hours will take effect immediately for new bookings.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 fixed bottom-0 left-0 right-0 px-6 py-4 max-w-md lg:max-w-2xl mx-auto bg-white dark:bg-zinc-900 border-t border-border/50 lg:relative lg:max-w-none lg:bg-transparent lg:border-0 lg:px-0 lg:py-0">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-lg bg-transparent"
            onClick={() => router.push(`/store/${storeId}`)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
