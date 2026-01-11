import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, MapPin, Star, Clock, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/bottom-nav'
import { MOCK_STORES } from '@/lib/mock-data'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasActiveTicket] = useState(true) // Simulate active ticket

  const filteredStores = MOCK_STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-0">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-6 py-4 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Discover</h1>
            <div className="flex items-center text-muted-foreground text-xs mt-0.5">
              <MapPin className="w-3 h-3 mr-1" />
              <span>New York, NY</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Active Queue Widget (Floating) */}
      {hasActiveTicket && (
        <div className="px-6 py-4">
          <Link to="/ticket/$id" params={{ id: '55' }}>
            <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-4 shadow-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Active Queue</p>
                  <p className="font-bold text-sm">Dr. Smith Dental Clinic</p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <div className="text-right">
                  <p className="text-xs opacity-80">Est. Wait</p>
                  <p className="font-bold">35m</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Store List */}
      <div className="max-w-md lg:max-w-6xl mx-auto relative">
        <div className="px-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Nearby Services</h2>
            <button className="text-xs text-primary font-medium hover:underline">See All</button>
          </div>

          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredStores.map((store) => (
              <Link to="/store/$id" params={{ id: String(store.id) }} key={store.id} className="group">
                <div className="bg-background rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
                  <div className="relative h-40 w-full">
                    <img
                      src={store.image || '/placeholder.svg'}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    {store.isOpen && (
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>~{store.waitTime} min wait</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">{store.name}</h3>
                      <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{store.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{store.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span>{store.distance}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span>{store.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
