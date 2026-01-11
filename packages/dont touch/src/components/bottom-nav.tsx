import { Link, useLocation } from '@tanstack/react-router'
import { Home, Activity, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  const isActive = (path: string) => pathname === path

  return (
    <>
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

      {/* Bottom spacer for mobile */}
      <div className="h-20 lg:hidden" />
    </>
  )
}
