"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 pb-6 z-50 max-w-md mx-auto lg:hidden">
        <nav className="flex justify-around items-center">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className={cn("w-6 h-6", isActive("/") && "fill-current")} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            href="/activity"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              isActive("/activity") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Activity className={cn("w-6 h-6", isActive("/activity") && "fill-current")} />
            <span className="text-[10px] font-medium">Activity</span>
          </Link>

          <Link
            href="/profile"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <User className={cn("w-6 h-6", isActive("/profile") && "fill-current")} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </nav>
      </div>

      <nav className="hidden lg:flex fixed top-0 right-0 left-0 bg-background border-b border-border px-6 py-4 z-50 items-center justify-end gap-8">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <Link
          href="/activity"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isActive("/activity") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
          )}
        >
          <Activity className="w-5 h-5" />
          <span className="text-sm font-medium">Activity</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isActive("/profile") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </nav>
    </>
  )
}
