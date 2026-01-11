"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, Camera, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from "@/components/bottom-nav"

export default function EditProfilePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    state: "NY",
    bio: "Healthcare professional with 8+ years of experience in customer service.",
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push("/profile")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to profile</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Edit Profile</h1>
      </header>

      <div className="p-6 max-w-md lg:max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-primary/20">
              JD
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="w-5 h-5" />
              <span className="sr-only">Change profile picture</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">Click the camera icon to upload a new photo</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name Section */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Contact Information</h3>
            <div className="space-y-4">
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
                  placeholder="Enter email address"
                />
              </div>

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
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Location</h3>
            <div className="space-y-4">
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
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State/Province
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-zinc-900 border-border h-10 rounded-lg"
                  placeholder="Enter state/province"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">About You</h3>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="bg-white dark:bg-zinc-900 border-border rounded-lg min-h-24 resize-none"
                placeholder="Tell us about yourself"
              />
              <p className="text-xs text-muted-foreground">{formData.bio.length}/200 characters</p>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Your profile information helps businesses understand your service preferences and provide better
                recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 fixed bottom-0 left-0 right-0 px-6 py-4 max-w-md lg:max-w-2xl mx-auto bg-white dark:bg-zinc-900 border-t border-border/50 lg:relative lg:max-w-none lg:bg-transparent lg:border-0 lg:px-0 lg:py-0">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-lg bg-transparent"
            onClick={() => router.push("/profile")}
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
