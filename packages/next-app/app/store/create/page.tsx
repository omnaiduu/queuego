"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, AlertCircle, Clock, MapPin, Phone, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"

export default function CreateStorePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [services, setServices] = useState([{ id: 1, name: "", description: "", price: "" }])
  const [nextServiceId, setNextServiceId] = useState(2)

  const [formData, setFormData] = useState({
    storeName: "",
    category: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    openTime: "10:00",
    closeTime: "20:00",
    deposit: "",
    imageUrl: "/store-image.jpg",
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

  const handleSubmit = () => {
    if (!formData.storeName || !formData.category || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    if (services.some((s) => !s.name || !s.price)) {
      alert("Please fill in all service details")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/vendor/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-4 md:px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link
          href="/vendor/dashboard"
          className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to dashboard</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Create Store</h1>
      </header>

      <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto space-y-8 pb-32 lg:pb-8">
        {/* Store Image Upload */}
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wide">Store Image</Label>
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-border p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Click to upload store image</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-sm font-medium">
                Store Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="storeName"
                name="storeName"
                type="text"
                value={formData.storeName}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                placeholder="e.g., Dr. Smith Dental Clinic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
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
              className="bg-white dark:bg-zinc-900 border-border rounded-lg min-h-20 resize-none"
              placeholder="Tell customers about your store, services, and specialties..."
            />
            <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <span>Services & Pricing</span>
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-muted-foreground">Add at least one service your store offers</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    Service Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`service-name-${service.id}`}
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, "name", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-border h-10 rounded-lg"
                    placeholder="e.g., Dental Checkup"
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
                    placeholder="e.g., Routine cleaning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-price-${service.id}`} className="text-sm font-medium">
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`service-price-${service.id}`}
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, "price", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-border h-10 rounded-lg"
                    placeholder="e.g., 500"
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

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h3>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
              placeholder="e.g., 123 Healthcare Ave"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="+1 (555) 123-4567"
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
                placeholder="contact@store.com"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Operating Hours
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              placeholder="e.g., 20"
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
              Add all services your store offers with pricing. Customers will see these when browsing your store.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 fixed bottom-0 left-0 right-0 px-4 md:px-6 py-4 bg-white dark:bg-zinc-900 border-t border-border/50 lg:relative lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 lg:mt-4">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-lg bg-transparent"
            onClick={() => router.push("/vendor/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Store"}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
