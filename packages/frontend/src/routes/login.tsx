import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react"
import { Eye, EyeOff, ArrowRight, LogIn } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { orpc } from "../lib/clientrpc"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"

/** Login and signup page route */
export const Route = createFileRoute('/login')({
  component: AuthPage,
})

/** Authentication page component handling both login and signup flows */
function AuthPage() {
  const navigate = useNavigate()

  // UI state
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)

  // API mutations - handles login with redirect on success
  const loginMutation = useMutation({
    ...orpc.auth.login.mutationOptions(),
    onSuccess: () => {
      navigate({ to: '/' })
    },
  })

  // API mutations - handles signup with redirect on success
  const signupMutation = useMutation({
    ...orpc.auth.register.mutationOptions(),
    onSuccess: () => {
      navigate({ to: '/' })
    },
  })

  // Login form configuration with TanStack Form
  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  // Signup form configuration with TanStack Form
  const signupForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      signupMutation.mutate(value)
    },
  })

  // Dynamic form and mutation based on current mode
  const currentForm = mode === "login" ? loginForm : signupForm
  const currentMutation = mode === "login" ? loginMutation : signupMutation
  const errorMessage = currentMutation.error?.message

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-6 max-w-md lg:max-w-md mx-auto">
      {/* Page header with logo and welcome text */}
      <div className="mb-8 text-center space-y-2">
        <div className="w-12 h-12 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
          <LogIn className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Enter your details to continue</p>
      </div>

      {/* Tab switcher for login/signup modes */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="login" className="text-base">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-base">
            Sign Up
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error message display - shown when login/signup fails */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main authentication form - switches between login and signup fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          currentForm.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Signup mode - shows name, email, and password fields */}
        {mode === "signup" ? (
          <>
            <signupForm.Field name="name">
              {(field) => (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="h-12"
                  />
                </div>
              )}
            </signupForm.Field>

            <signupForm.Field name="email">
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
                    placeholder="hello@example.com"
                    required
                    className="h-12"
                  />
                </div>
              )}
            </signupForm.Field>

            <signupForm.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </signupForm.Field>
          </>
        ) : (
          /* Login mode - shows only email and password fields */
          <>
            <loginForm.Field name="email">
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
                    placeholder="hello@example.com"
                    required
                    className="h-12"
                  />
                </div>
              )}
            </loginForm.Field>

            <loginForm.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </loginForm.Field>
          </>
        )}

        {/* Submit button - shows loading state during API call */}
        <Button type="submit" className="w-full h-12 text-base font-semibold mt-6" disabled={currentMutation.isPending}>
          {currentMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {mode === "login" ? "Log In" : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Terms and privacy policy links */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
