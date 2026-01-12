"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { Home, Activity, User, MapPin } from "lucide-react"
import { cn } from "../lib/utils"

/**
 * Bottom navigation component - Provides mobile and desktop navigation.
 * Mobile: Fixed bottom bar with Home, Activity, and Profile tabs.
 * Desktop: Top navigation bar with brand logo and navigation links.
 */
export function BottomNav() {
  const router = useRouterState()
  const pathname = router.location.pathname

  // Check if current route matches the given path for highlighting active tab
  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Bottom Navigation - Shows on small screens, fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 pb-6 z-50 max-w-md mx-auto lg:hidden">
        <nav className="flex justify-around items-center">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className={cn("w-6 h-6", isActive("/") && "fill-current")} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            to="/activity"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              isActive("/activity") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Activity className={cn("w-6 h-6", isActive("/activity") && "fill-current")} />
            <span className="text-[10px] font-medium">Activity</span>
          </Link>

          <Link
            to="/profile"
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

      {/* Desktop Top Navigation - Shows on large screens, fixed at top */}
      <nav className="hidden lg:flex fixed top-0 right-0 left-0 bg-background border-b border-border z-50">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">QueueGo</h1>
              <div className="flex items-center text-muted-foreground text-[10px]">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                <span>India</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300",
                isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link
              to="/activity"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300",
                isActive("/activity") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Activity</span>
            </Link>

            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300",
                isActive("/profile") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
