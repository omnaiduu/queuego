import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from "react"
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { BottomNav } from "../components/bottom-nav"
import { orpc } from "../lib/clientrpc"
import { compressImageToBase64, validateImageFile } from "../lib/image-utils"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"

export const Route = createFileRoute('/store/create')({
  component: CreateStorePage,
})

function CreateStorePage() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  const categories = ["Doctor", "Saloon", "Car Wash"]

  // Image upload mutation
  const uploadMutation = useMutation({
    ...orpc.upload.image.mutationOptions(),
  })

  // Store creation mutation
  const createStoreMutation = useMutation({
    ...orpc.stores.create.mutationOptions(),
    onSuccess: () => {
      navigate({ to: '/vendor/dashboard' })
    },
    onError: (error) => {
      console.error('Create store error:', error)
      alert(error.message || 'Failed to create store. Please try again.')
    }
  })

  // TanStack Form
  const form = useForm({
    defaultValues: {
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
    },
    onSubmit: async ({ value }) => {
      // Upload image first if present
      let imageUrl: string | null = null
      if (imageBase64) {
        const uploadResult = await uploadMutation.mutateAsync({
          dataUrl: imageBase64,
          filename: 'store-image.jpg'
        })
        imageUrl = uploadResult.url
      }

      // Create store
      createStoreMutation.mutate({
        name: value.storeName,
        category: value.category,
        description: value.description || undefined,
        address: value.address,
        city: value.city || undefined,
        state: value.state || undefined,
        zipCode: value.zipCode || undefined,
        phone: value.phone || undefined,
        email: value.email || undefined,
        openTime: value.openTime,
        closeTime: value.closeTime,
        deposit: value.deposit ? parseFloat(value.deposit) : 0,
        defaultServiceTime: parseInt(value.defaultServiceTime),
        imageUrl: imageUrl || undefined,
      })
    },
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)

      // Compress and convert to base64
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

  const isSubmitting = uploadMutation.isPending || createStoreMutation.isPending

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      <header className="bg-background sticky top-0 z-10 px-4 md:px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link to="/vendor/dashboard" className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Create Store</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto space-y-8 pb-32 lg:pb-8"
      >
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wide">Store Image</Label>
          {imagePreview ? (
            <div className="relative bg-background rounded-2xl border-2 border-border overflow-hidden">
              <img src={imagePreview} alt="Store preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative bg-background rounded-2xl border-2 border-dashed border-border p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300">
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

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="storeName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">Store Name <span className="text-red-500">*</span></Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                    placeholder="e.g., Dr. Smith Dental Clinic"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="category">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
                  <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                    <SelectTrigger className="bg-secondary/50 border-transparent h-10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all min-h-20 resize-none"
                  placeholder="Tell customers about your store..."
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Location</h3>
          <form.Field name="address">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Street Address <span className="text-red-500">*</span></Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <form.Field name="city">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>City</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="state">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>State</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="zipCode">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>ZIP Code</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Phone</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Operating Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="openTime">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Opening Time</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="closeTime">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Closing Time</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <form.Field name="deposit">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Queue Deposit (₹)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                placeholder="e.g., 20"
              />
              <p className="text-xs text-muted-foreground">Optional deposit required to join queue</p>
            </div>
          )}
        </form.Field>

        <form.Field name="defaultServiceTime">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Average Service Time (minutes)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                placeholder="e.g., 15"
              />
              <p className="text-xs text-muted-foreground">Used to estimate wait times</p>
            </div>
          )}
        </form.Field>

        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:scale-105 transition-all duration-300">
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Store...
            </>
          ) : (
            "Create Store"
          )}
        </Button>
      </form>

      <BottomNav />
    </div>
  )
}
