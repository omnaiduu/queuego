"use client"

import { useRouter } from "next/navigation"
import { Settings, LogOut, Store, ChevronRight, CreditCard, Bell } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      <header className="bg-background px-4 md:px-8 py-6 sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </header>

      <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold flex-shrink-0">
            JD
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-muted-foreground text-sm mt-1">john.doe@example.com</p>
            <Link href="/profile/edit">
              <Button variant="link" className="px-0 h-auto text-primary text-sm font-medium mt-2">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group cursor-pointer"
          onClick={() => router.push("/vendor/dashboard")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <h3 className="font-bold text-lg mb-1">Vendor Mode</h3>
              <p className="text-sm opacity-80">Manage your queue and store</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Store className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm font-bold text-primary-foreground">
            Switch to Dashboard <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 md:p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 md:p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-medium">Payment Methods</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="p-5 md:p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-medium">App Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
