import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import { Search, MapPin, Star, Clock, ChevronRight, Loader2 } from "lucide-react"
import { Input } from "../components/ui/input"
import { BottomNav } from "../components/bottom-nav"
import { LogoutButton } from "../components/LogoutButton"
import { orpc } from "../lib/clientrpc"

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch logged-in user's profile data for display
  const { data: currentUser } = useQuery(
    orpc.auth.getCurrentUser.queryOptions({ input: {} })
  )

  // Fetch all stores with search filter and real-time updates (every 1 second)
  // Shows only open stores, limited to 50 results
  const { data: stores = [], isLoading } = useQuery({
    ...orpc.stores.list.queryOptions({
      input: {
        search: searchQuery || undefined, // Filter by search text if entered
        isOpen: true, // Only show stores that are currently open
        limit: 50, // Maximum 50 stores to display
      },
    }),
    refetchInterval: 1000, // Refresh every second for live queue updates
  })

  // Fetch user's active tickets to show "Currently in Queue" banner
  const { data: activeTickets = [] } = useQuery(
    orpc.tickets.getMyActive.queryOptions()
  )

  // Extract user's initials from name for avatar display
  const userInitials = currentUser?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-0 lg:pt-[133px] ">
      {/* Mobile Header - Shows brand, location, user profile, and search bar */}
      <header className="bg-background sticky top-0 z-10 border-b border-border/50 backdrop-blur-xl bg-background/80 lg:hidden">
        <div className="px-4 py-4">
          {/* Top row: Brand name, location, and user actions */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">QueueGo</h1>
              <div className="flex items-center text-muted-foreground text-xs mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                <span>India</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hover:bg-primary/20 transition-colors">
                {userInitials}
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Desktop Header - Shows search bar and user profile in top navigation */}
      <div className="hidden lg:block bg-background border-b border-border sticky  z-10">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Search - Takes Priority */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <Input
                  placeholder="Search services, categories, locations..."
                  className="pl-12 pr-4 h-12 bg-muted/50 border-border rounded-xl focus-visible:bg-background focus-visible:border-primary transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* User Actions - Right Aligned */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/profile"
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-primary/20"
              >
                {userInitials}
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Active Queue Widget (Floating) */}
      {activeTickets.length > 0 && (
        <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
          <Link to="/ticket/$id" params={{ id: String(activeTickets[0].id) }}>
            <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-4 shadow-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Active Queue</p>
                  <p className="font-bold text-sm">{activeTickets[0].store.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <div className="text-right">
                  <p className="text-xs opacity-80">Est. Wait</p>
                  <p className="font-bold">{activeTickets[0].estimatedWaitTime}m</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Store List */}
      <div className="max-w-7xl mx-auto relative">
        <div className="px-6 lg:px-8 space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between pt-4 lg:pt-0">
            <h2 className="font-bold text-lg lg:text-xl">Nearby Services</h2>
            <button className="text-xs lg:text-sm text-primary font-medium hover:underline">See All</button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No stores found</p>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store: any) => (
                <Link to="/store/$id" params={{ id: String(store.id) }} key={store.id} className="group">
                  <div className="bg-background rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
                    <div className="relative h-40 w-full">
                      <img
                        src={store.imageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop"}
                        alt={store.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        {store.isOpen ? (
                          <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                            OPEN
                          </span>
                        ) : (
                          <span className="bg-zinc-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                            CLOSED
                          </span>
                        )}
                      </div>
                      {store.isOpen && store.queueCount > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-2xl flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{store.queueCount} in queue</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">{store.name}</h3>
                        <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{store.rating || "4.5"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{store.category}</span>
                        {store.city && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <span>{store.city}</span>
                          </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span>{store.totalReviews || 0} reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
