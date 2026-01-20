import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from "react"
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
import { useForm } from "@tanstack/react-form"

export const Route = createFileRoute('/store_/$id/edit')({
  component: EditStorePage,
})

function EditStorePage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const storeId = parseInt(id)

  // Fetch store data
  const { data: store, isLoading } = useQuery(
    orpc.stores.get.queryOptions({ input: { id: storeId } })
  )

  // Mutations
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <EditStoreForm
      store={store}
      uploadMutation={uploadMutation}
      updateStoreMutation={updateStoreMutation}
      storeId={storeId}
      navigate={navigate}
      id={id}
    />
  )
}

function EditStoreForm({ store, uploadMutation, updateStoreMutation, storeId, navigate, id }: any) {
  const [imagePreview, setImagePreview] = useState<string | null>(store?.imageUrl || null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  const categories = ["Doctor", "Saloon", "Car Wash"]

  const form = useForm({
    defaultValues: {
      storeName: store?.name || "",
      category: store?.category || "",
      description: store?.description || "",
      address: store?.address || "",
      city: store?.city || "",
      state: store?.state || "",
      zipCode: store?.zipCode || "",
      phone: store?.phone || "",
      email: store?.email || "",
      openTime: store?.openTime || "10:00",
      closeTime: store?.closeTime || "20:00",
      deposit: store?.deposit?.toString() || "",
      defaultServiceTime: store?.defaultServiceTime?.toString() || "15",
    },
    onSubmit: async ({ value }) => {
      try {
        // Upload image if new
        let imageUrl = imagePreview
        if (imageBase64) {
          const uploadResult = await uploadMutation.mutateAsync({
            dataUrl: imageBase64,
            filename: `store-${storeId}.jpg`
          })
          imageUrl = uploadResult.url
        }

        // Update store
        updateStoreMutation.mutate({
          id: storeId,
          name: value.storeName,
          category: value.category as "Doctor" | "Saloon" | "Car Wash",
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
      } catch (error) {
        console.error('Save error:', error)
      }
    },
  })

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

  const isSaving = uploadMutation.isPending || updateStoreMutation.isPending

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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="p-6 max-w-md lg:max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8"
      >
        {/* Store Image */}
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wide">Store Image</Label>
          {imagePreview ? (
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-border overflow-hidden">
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
            <Label htmlFor="storeName" className="text-sm font-medium">Store Name</Label>
            <form.Field name="storeName">
              {(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                  placeholder="Store name"
                />
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <form.Field name="category">
              {(field) => (
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                  <SelectTrigger className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <form.Field name="description">
              {(field) => (
                <>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border-border rounded-lg min-h-24 resize-none"
                    placeholder="Store description"
                  />
                  <p className="text-xs text-muted-foreground">{field.state.value.length}/500 characters</p>
                </>
              )}
            </form.Field>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h3>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Street Address</Label>
            <form.Field name="address">
              {(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                  placeholder="Street address"
                />
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <form.Field name="city">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">City</Label>
                <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="City" />
              </div>
            )}</form.Field>
            <form.Field name="state">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">State</Label>
                <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="State" />
              </div>
            )}</form.Field>
            <form.Field name="zipCode">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">ZIP Code</Label>
                <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="ZIP" />
              </div>
            )}</form.Field>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Details
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <form.Field name="phone">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">Phone Number</Label>
                <Input id={field.name} name={field.name} type="tel" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="Phone number" />
              </div>
            )}</form.Field>

            <form.Field name="email">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">Email Address</Label>
                <Input id={field.name} name={field.name} type="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="Email address" />
              </div>
            )}</form.Field>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Operating Hours
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <form.Field name="openTime">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">Opening Time</Label>
                <Input id={field.name} name={field.name} type="time" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" />
              </div>
            )}</form.Field>
            <form.Field name="closeTime">{(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">Closing Time</Label>
                <Input id={field.name} name={field.name} type="time" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" />
              </div>
            )}</form.Field>
          </div>
        </div>

        {/* Booking Deposit */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Booking Details
          </h3>

          <form.Field name="deposit">{(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium">Booking Deposit Amount (₹)</Label>
              <Input id={field.name} name={field.name} type="number" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg" placeholder="Deposit amount" min="0" />
              <p className="text-xs text-muted-foreground">Amount customers must pay to join the queue</p>
            </div>
          )}</form.Field>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Changes to operating hours will take effect immediately for new bookings.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 fixed bottom-0 left-0 right-0 px-6 py-4 max-w-md lg:max-w-2xl mx-auto bg-white dark:bg-zinc-900 border-t border-border/50 lg:relative lg:max-w-none lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 z-60">
          <Button variant="outline" className="flex-1 h-11 rounded-lg bg-transparent" onClick={() => navigate({ to: '/store/$id', params: { id } })} disabled={isSaving}>Cancel</Button>
          <Button type="submit" className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2" disabled={isSaving}>{isSaving ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>) : (<><Save className="w-4 h-4" /><span>Save Changes</span></>)}</Button>
        </div>
      </form>

      <BottomNav />
    </div>
  )
}
