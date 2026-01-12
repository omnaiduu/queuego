import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { BottomNav } from "../components/bottom-nav"
import { orpc } from "../lib/clientrpc"
import { useForm } from "@tanstack/react-form"

export const Route = createFileRoute('/profile_/edit')({
  component: EditProfilePage,
})

function EditProfilePage() {
  const navigate = useNavigate()

  // Fetch current user
  const { data: userData, isLoading } = useQuery(
    orpc.auth.getCurrentUser.queryOptions()
  )

  // Update profile mutation
  const updateProfileMutation = useMutation({
    ...orpc.users.updateProfile.mutationOptions(),
    onSuccess: () => {
      navigate({ to: '/profile' })
    },
    onError: (error) => {
      console.error('Update profile error:', error)
      alert(error.message || 'Failed to update profile')
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <EditProfileForm userData={userData} updateProfileMutation={updateProfileMutation} />
}

function EditProfileForm({ userData, updateProfileMutation }: any) {
  // TanStack Form with actual user data as defaults
  const form = useForm({
    defaultValues: {
      name: userData?.user?.name || "",
      email: userData?.user?.email || "",
    },
    onSubmit: async ({ value }) => {
      updateProfileMutation.mutate({
        name: value.name,
      })
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      <header className="bg-background sticky top-0 z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to profile</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Edit Profile</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="p-6 max-w-md lg:max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                      placeholder="Enter your name"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">Email Address</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-secondary/50 border-transparent focus-visible:bg-background transition-all h-10"
                      placeholder="Enter email address"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="w-full h-12 md:h-14 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:scale-105 transition-all duration-300"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form >

      <BottomNav />
    </div >
  )
}
