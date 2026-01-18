import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { useQuery, useMutation } from '@tanstack/react-query'
import { ChevronLeft, Save, AlertCircle, Clock, MapPin, Phone, Upload, X, Loader2, DollarSign } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { BottomNav } from "../components/bottom-nav"
import { orpc } from "../lib/clientrpc"
import { compressImageToBase64, validateImageFile } from "../lib/image-utils"

export const Route = createFileRoute('/store_/$id/edit')({
  component: EditStorePage,
})

function EditStorePage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const storeId = parseInt(id)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  // Fetch store data - FIXED: Added input property
  const { data: store, isLoading } = useQuery(
    orpc.stores.get.queryOptions({ input: { id: storeId } })
  )

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
    defaultServiceTime: "15",
  })

  // FIXED: Using mutations instead of direct client calls
  const uploadMutation = useMutation({
    ...orpc.upload.image.mutationOptions(),
  })

  const updateStoreMutation = useMutation({
    ...orpc.stores.update.mutationOptions(),
    onSuccess: () => {
      navigate({ to: '/store/$id', params: { id } })
    },
    onError: (error) => {
      console.error('Update store error:', error)
      alert(error.message || 'Failed to update store')
    }
  })

  // Populate form when store data loads
  useEffect(() => {
    if (store) {
      setFormData({
        storeName: (store as any).name,
        category: (store as any).category,
        description: (store as any).description || "",
        address: (store as any).address,
        city: (store as any).city || "",
        state: (store as any).state || "",
        zipCode: (store as any).zipCode || "",
        phone: (store as any).phone || "",
        email: (store as any).email || "",
        openTime: (store as any).openTime,
        closeTime: (store as any).closeTime,
        deposit: (store as any).deposit?.toString() || "",
        defaultServiceTime: (store as any).defaultServiceTime?.toString() || "",
      })
      if ((store as any).imageUrl) {
        setImagePreview((store as any).imageUrl)
      }
    }
  }, [store])

  const categories = [
    "Doctor",
    "Saloon",
    "Car Wash",
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)

      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)

      const base64 = await compressImageToBase64(file)
      setImageBase64(base64)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed')
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageBase64(null)
  }

  const handleSave = async () => {
    try {
      // Upload new image if changed
      let imageUrl = imagePreview
      if (imageBase64) {
        const uploadResult = await uploadMutation.mutateAsync({
          dataUrl: imageBase64,
          filename: `store-${storeId}.jpg`
        })
        imageUrl = uploadResult.url
      }

      // Update store
      await updateStoreMutation.mutateAsync({
        id: storeId,
        name: formData.storeName,
        category: formData.category as "Doctor" | "Saloon" | "Car Wash",
        description: formData.description || undefined,
        address: formData.address,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        deposit: formData.deposit ? parseFloat(formData.deposit) : 0,
        defaultServiceTime: parseInt(formData.defaultServiceTime),
        imageUrl: imageUrl || undefined,
      })
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const isSaving = uploadMutation.isPending || updateStoreMutation.isPending

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link
          to="/store/$id"
          params={{ id }}
          className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to store</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Edit Store</h1>
      </header>

      <div className="p-6 max-w-md lg:max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8">
        {/* Store Image */}
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wide">Store Image</Label>
          {imagePreview ? (
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-border overflow-hidden">
              <img src={imagePreview} alt="Store preview" className="w-full h-48 object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-border p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">Click to upload store image</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 1MB</p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

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
        <div className="flex gap-3 fixed bottom-0 left-0 right-0 px-6 py-4 max-w-md lg:max-w-2xl mx-auto bg-white dark:bg-zinc-900 border-t border-border/50 lg:relative lg:max-w-none lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 z-60">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-lg bg-transparent"
            onClick={() => navigate({ to: '/store/$id', params: { id } })}
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
