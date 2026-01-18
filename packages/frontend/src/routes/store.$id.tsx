import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Share2, Clock, MapPin, Phone, Star, CheckCircle2, Ticket, Loader2 } from "lucide-react"
import { cn } from "../lib/utils"
import { orpc, orpcClient } from "../lib/clientrpc"
import { Button } from "../components/ui/button"

/** Store detail page route - shows individual store info and allows joining queue */
export const Route = createFileRoute('/store/$id')({
  component: StoreDetailPage,
})

/** Store detail page component displaying store info, queue status, and join button */
function StoreDetailPage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const storeId = parseInt(id)

  // UI state for description expansion and join flow
  const [isExpanded, setIsExpanded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch store details with real-time updates (every 1 second)
  const { data: store, isLoading } = useQuery({
    ...orpc.stores.get.queryOptions({
      input: { id: storeId },
    }),
    refetchInterval: 1000, // Real-time polling
  })

  // Check if user already has an active ticket for this store
  const { data: activeTickets } = useQuery({
    ...orpc.tickets.getMyActive.queryOptions({}),
    refetchInterval: 1000,
  })

  // Find existing ticket for this store (prevents duplicate joins)
  const existingTicket = activeTickets?.find((t: any) => t.store.id === storeId)

  // Display live queue stats from store data
  const displayQueueCount = store?.queueCount ?? 0
  const displayWaitTime = store?.estimatedWaitTime ?? 0

  // Handle joining the queue - creates ticket and navigates to ticket page
  const handleJoinQueue = async () => {
    setIsJoining(true)
    try {
      const ticket = await orpcClient.tickets.create({ storeId })
      setIsJoining(false)
      setShowSuccess(true)
      setTimeout(() => {
        navigate({ to: '/ticket/$id', params: { id: String(ticket.id) } })
      }, 1500)
    } catch (error: any) {
      setIsJoining(false)
      alert(error.message || 'Failed to join queue')
    }
  }

  // Show loading spinner while fetching store data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Store not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Desktop: Two-column layout, Mobile: Stack */}
      <div className="max-w-md md:max-w-4xl lg:max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-8">
        {/* Left Column: Image & Info (Desktop), Stacked (Mobile) */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          {/* Header - Responsive height */}
          <header className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full overflow-hidden lg:rounded-2xl">
            <img
              src={store.imageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop"}
              alt={store.name}
              className="object-cover w-full h-full"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

            {/* Navigation Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
              <Link
                to="/"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="sr-only">Back</span>
              </Link>
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                <Share2 className="w-5 h-5" />
                <span className="sr-only">Share</span>
              </button>
            </div>

            {/* Store Status Badge */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
              <div className={cn(
                "backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-2",
                store.isOpen ? "bg-white/95" : "bg-zinc-800/95"
              )}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    store.isOpen ? "bg-green-400" : "bg-zinc-400"
                  )}></span>
                  <span className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    store.isOpen ? "bg-green-500" : "bg-zinc-500"
                  )}></span>
                </span>
                <span className={cn(
                  "text-xs md:text-sm font-bold tracking-wide",
                  store.isOpen ? "text-green-700" : "text-zinc-300"
                )}>
                  {store.isOpen ? "OPEN NOW" : "CLOSED"}
                </span>
              </div>
            </div>
          </header>

          {/* Title Block - Desktop: Below image */}
          <div className="px-4 md:px-6 lg:px-0 pt-4 lg:pt-6 space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance">{store.name}</h1>
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground">{store.category}</span>
              {store.city && (
                <>
                  <span>•</span>
                  <span>{store.city}</span>
                </>
              )}
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{store.rating || "4.5"}</span>
                <span className="text-muted-foreground font-normal">({store.totalReviews || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Dashboard & Details (Desktop), Below image (Mobile) */}
        <div className="lg:py-0">
          {/* 2. Live Dashboard */}
          <div className="px-4 md:px-6 lg:px-0 -mt-6 lg:mt-0 relative z-10 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 md:p-8 border border-border">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold text-red-500 tracking-wider uppercase">Live Queue Status</span>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                    {displayQueueCount}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground font-medium mt-1">People Waiting</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">~{displayWaitTime}</span>
                  <span className="text-sm md:text-base text-muted-foreground font-medium mt-1">Mins Wait</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Store Details & Info */}
          <div className="px-4 md:px-6 lg:px-0 space-y-6 md:space-y-8 pb-32 md:pb-24 lg:pb-8">
            {/* About Section */}
            <div className="space-y-3">
              <h3 className="text-sm md:text-base font-bold text-foreground uppercase tracking-wide">About</h3>
              <p
                className={cn("text-muted-foreground text-sm md:text-base leading-relaxed", !isExpanded && "line-clamp-3")}
              >
                {store.description || "No description available"}
              </p>
              {store.description && store.description.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm md:text-base font-semibold text-primary hover:underline focus:outline-none transition-all duration-300"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Services Section */}
            {store.services && store.services.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm md:text-base font-bold text-foreground uppercase tracking-wide">
                  Services & Pricing
                </h3>

                <div className="space-y-3">
                  <div className="bg-secondary/50 rounded-2xl p-4 md:p-6 space-y-3 divide-y divide-border">
                    {store.services.map((service: any, index: number) => (
                      <div key={service.id} className={index !== 0 ? "pt-3" : ""}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-semibold text-foreground">{service.name}</p>
                            {service.description && (
                              <p className="text-xs md:text-sm text-muted-foreground mt-1">{service.description}</p>
                            )}
                          </div>
                          {service.price && (
                            <p className="text-sm md:text-base font-bold text-primary flex-shrink-0">₹{service.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Operations Block */}
            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-foreground uppercase tracking-wide">Details</h3>

              <div className="space-y-4 md:space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-foreground">
                      {store.openTime} - {store.closeTime}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">Operating hours</p>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-all duration-300">
                      {store.address}
                    </p>
                    {(store.city || store.state || store.zipCode) && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {[store.city, store.state, store.zipCode].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </a>

                {store.phone && (
                  <a href={`tel:${store.phone}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                      <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-all duration-300">
                        {store.phone}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">Reception desk</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 dark:bg-background/95 backdrop-blur-xl border-t border-border p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 safe-area-inset-bottom">
        <div className="max-w-md md:max-w-4xl lg:max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Booking Deposit</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">
                  ₹{store.deposit || 0}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">/ person</span>
              </div>
              {store.deposit > 0 && (
                <span className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                  Deductible from final bill
                </span>
              )}
            </div>

            <Button
              onClick={existingTicket ? () => navigate({ to: '/ticket/$id', params: { id: String(existingTicket.id) } }) : handleJoinQueue}
              disabled={isJoining || !store.isOpen}
              className="w-full md:w-auto md:min-w-[240px] h-12 md:h-14 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin mr-2" />
                  Joining...
                </>
              ) : !store.isOpen ? (
                "Store Closed"
              ) : existingTicket ? (
                <>
                  <Ticket className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  View My Ticket
                </>
              ) : (
                <>
                  <Ticket className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  Join Queue
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal - Responsive */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background w-full max-w-sm md:max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-border animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">You're in line!</h2>
                <p className="text-sm md:text-base text-muted-foreground">We'll notify you when it's your turn.</p>
              </div>

              <div className="w-full bg-secondary rounded-2xl p-6 border border-border my-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs md:text-sm text-muted-foreground uppercase font-bold tracking-wider">Ticket Number</span>
                  <span className="text-xs md:text-sm text-muted-foreground uppercase font-bold tracking-wider">Est. Wait</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">#55</span>
                  <span className="text-2xl md:text-3xl font-bold text-primary">~40m</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: '/ticket/$id', params: { id: '55' } })}
                className="w-full bg-primary text-primary-foreground h-12 md:h-14 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                GO TO TICKET
              </button>

              <button
                onClick={() => setShowSuccess(false)}
                className="text-sm md:text-base text-muted-foreground font-medium hover:text-foreground transition-all duration-300 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
