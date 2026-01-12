import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, AlertCircle, Clock, MapPin, Phone, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { orpc, orpcClient } from "../lib/clientrpc"

/** Ticket detail page route - shows live queue position and status */
export const Route = createFileRoute('/ticket/$id')({
  component: TicketPage,
})

/** Ticket page component showing real-time queue position, wait time, and live updates */
function TicketPage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const ticketId = parseInt(id)

  // UI state for confirmation dialog and animations
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [progress, setProgress] = useState(0) // Progress bar percentage
  const [livePulse, setLivePulse] = useState(false) // Live update indicator
  const [prevStatus, setPrevStatus] = useState<string | null>(null) // Track status changes

  // Fetch ticket details with real-time updates (every 1 second)
  const { data: ticket, isLoading } = useQuery({
    ...orpc.tickets.get.queryOptions({
      input: { id: ticketId },
    }),
    refetchInterval: 1000, // Real-time polling
  })

  /**
   * Effect: Handle ticket status changes and animations
   * - Shows live pulse indicator when status changes
   * - Updates progress bar based on queue position
   * - Auto-redirects to home when ticket is completed/cancelled
   */
  useEffect(() => {
    if (!ticket) return

    // Show pulse when status changes
    if (ticket.status !== prevStatus && prevStatus !== null) {
      setLivePulse(true)
      setTimeout(() => setLivePulse(false), 1200)
    }
    setPrevStatus(ticket.status)

    // Update progress bar based on position
    if (ticket.peopleAhead === 0) {
      setProgress(100)
    } else if (ticket.peopleAhead <= 5) {
      setProgress(75 + (5 - ticket.peopleAhead) * 5)
    } else {
      setProgress(Math.min(70, 100 - ticket.peopleAhead * 5))
    }

    // Auto-redirect when ticket is done
    if (["completed", "cancelled", "no_show"].includes(ticket.status)) {
      setTimeout(() => navigate({ to: '/' }), 1000)
    }
  }, [ticket, prevStatus, navigate])

  // Handle leaving queue - cancels ticket and returns to home
  const handleLeaveQueue = async () => {
    try {
      await orpcClient.tickets.cancel({ id: ticketId })
      navigate({ to: '/' })
    } catch (error: any) {
      alert(error.message || 'Failed to cancel ticket')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Ticket not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-8 lg:pb-8 relative flex flex-col">
      <header className="bg-background px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link
          to="/"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-bold text-lg">Ticket #{id}</h1>
        <div className="flex items-center gap-2 min-w-[64px] justify-end">
          <div className={`flex items-center gap-1 text-xs font-semibold ${livePulse ? 'text-primary' : 'text-muted-foreground'}`}>
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full ${livePulse ? 'animate-ping bg-primary/70' : 'bg-primary/30'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${livePulse ? 'bg-primary' : 'bg-primary/50'}`} />
            </span>
            {livePulse ? 'Live' : 'Listening'}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-4 flex flex-col gap-6 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden lg:p-12">
          <div className="absolute top-0 left-0 right-0 h-2 bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Your Number</p>
            <h2 className="text-6xl lg:text-8xl font-black text-primary tracking-tighter">{ticket.ticketNumber}</h2>

            {/* Secret Code Display */}
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Secret Code</p>
              <p className="text-2xl font-bold font-mono tracking-wider text-primary">{ticket.secretCode}</p>
              <p className="text-xs text-muted-foreground mt-1">Show this code at the counter</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Serving</p>
              <p className="text-2xl lg:text-3xl font-bold">{ticket.currentlyServing || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Est. Wait</p>
              <p className="text-2xl lg:text-3xl font-bold">~{ticket.estimatedWaitTime}m</p>
            </div>
          </div>

          {ticket.status === 'called' && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 text-center">
                🔔 You've been called! Please proceed to the counter.
              </p>
            </div>
          )}

          {ticket.status === 'serving' && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl">
              <p className="text-sm font-semibold text-green-800 dark:text-green-400 text-center">
                ✅ You're being served now!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold text-lg mb-4">{ticket.store.name}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{ticket.store.address}</span>
            </div>
            {ticket.store.phone && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{ticket.store.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>You joined at {new Date(ticket.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
            Please arrive 5 minutes before your estimated time. If you miss your turn, you may need to rejoin the queue.
          </p>
        </div>

        <div className="flex-1" />

        <Button
          variant="destructive"
          className="w-full h-14 rounded-xl font-bold text-base shadow-lg shadow-red-500/20 lg:w-64 lg:mx-auto"
          onClick={() => setShowLeaveConfirm(true)}
        >
          LEAVE QUEUE
        </Button>
      </main>

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-lg mb-3 text-center">Leave Queue?</h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              {ticket.depositAmount > 0 ? (
                <>Are you sure? Your booking deposit of <span className="font-bold text-foreground">₹{ticket.depositAmount}</span> is non-refundable.</>
              ) : (
                <>Are you sure you want to leave the queue?</>
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl bg-transparent"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 h-12 rounded-xl" onClick={handleLeaveQueue}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
