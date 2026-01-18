import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { X, SkipForward, CheckCircle2, Power, Plus, Settings, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { orpc, orpcClient } from "../lib/clientrpc"

/** Vendor dashboard route - for store owners to manage their queues */
export const Route = createFileRoute('/vendor/dashboard')({
  component: VendorDashboard,
})

/** Vendor dashboard component for managing store queue, calling next, and completing tickets */
function VendorDashboard() {
  const navigate = useNavigate()
  // Currently selected store (vendors can have multiple stores)
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)

  // Fetch all stores owned by this vendor with real-time updates
  const { data: stores = [], isLoading: loadingStores, refetch: refetchStores } = useQuery({
    ...orpc.stores.getMy.queryOptions(),
    refetchInterval: 1000, // Real-time polling
  })

  // Auto-select first store on page load
  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id)
    }
  }, [stores, selectedStoreId])

  // Get the currently selected store's data
  const currentStore = stores.find(s => s.id === selectedStoreId)

  // Fetch real-time queue for the selected store
  const { data: queue, refetch: refetchQueue } = useQuery({
    ...orpc.tickets.getStoreQueue.queryOptions({
      input: selectedStoreId ? { storeId: selectedStoreId } : { storeId: 0 },
    }),
    enabled: !!selectedStoreId,
    refetchInterval: 1000, // Real-time polling
  })

  // Live update indicator state
  const [livePulse, setLivePulse] = useState(false)
  const [prevQueueLength, setPrevQueueLength] = useState<number | null>(null)

  /**
   * Effect: Show pulse animation when queue length changes
   * Provides visual feedback that queue is updating in real-time
   */
  useEffect(() => {
    const queueData = queue as { queueLength?: number } | null
    const currentLength = queueData?.queueLength ?? 0

    if (prevQueueLength !== null && currentLength !== prevQueueLength) {
      setLivePulse(true)
      setTimeout(() => setLivePulse(false), 1200)
    }
    setPrevQueueLength(currentLength)
  }, [queue, prevQueueLength])

  /**
   * Toggle store open/closed status
   * When closed, customers cannot join the queue
   */
  const handleToggleStore = async (storeId: number, isOpen: boolean) => {
    try {
      await orpcClient.stores.toggleStatus({ id: storeId, isOpen })
      await Promise.all([refetchStores(), refetchQueue()])
    } catch (error) {
      console.error('Toggle store status error:', error)
    }
  }

  /**
   * Mark current ticket as completed
   * This moves the customer out of the queue
   */
  const handleComplete = async () => {
    if (!selectedStoreId) return
    try {
      const completedTicketNumber = currentTicket
      await orpcClient.tickets.complete({ storeId: selectedStoreId })
      await refetchQueue()

      // Show success toast with ticket info
      toast.success('Ticket Completed!', {
        description: `Ticket #${completedTicketNumber} has been successfully completed.`,
        duration: 3000,
      })
    } catch (error: any) {
      toast.error('Failed to complete ticket', {
        description: error.message || 'An error occurred',
      })
    }
  }

  /**
   * Call the next customer in queue
   * Updates the "now serving" number displayed to customers
   */
  const handleCallNext = async () => {
    if (!selectedStoreId) return
    try {
      await orpcClient.tickets.callNext({ storeId: selectedStoreId })
      await refetchQueue()
    } catch (error: any) {
      alert(error.message || 'Failed to call next ticket')
    }
  }

  // Extract queue data with type safety
  const queueData = (queue as {
    currentTicket?: number | null
    nextTicket?: number | null
    queueLength?: number
    waitingTickets?: any[]
  }) || null

  const currentTicket = queueData?.currentTicket || null
  const nextTicket = queueData?.nextTicket || null
  const queueLength = queueData?.queueLength || 0

  // Fetch details for the currently serving ticket (used to display secret code)
  const ticketQueryOptions = currentTicket ? orpc.tickets.get.queryOptions({ input: { id: currentTicket } }) : null
  const { data: currentTicketDetails } = useQuery({
    ...(ticketQueryOptions ?? {}),
    enabled: !!currentTicket,
    refetchInterval: 1000,
  })

  if (loadingStores) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">No Stores Yet</h2>
        <p className="text-muted-foreground mb-6 text-center">Create your first store to start managing queues</p>
        <Link to="/store/create">
          <Button className="h-12 rounded-xl font-bold">
            <Plus className="w-5 h-5 mr-2" />
            Create Store
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-8 lg:pb-8 relative flex flex-col">
      <header className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
        <div>
          <h1 className="font-bold text-lg">Vendor Dashboard</h1>
          <p className="text-xs text-zinc-400">Manage your stores and queues</p>
        </div>
        <button
          onClick={() => navigate({ to: '/profile' })}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6 py-6 max-w-md lg:max-w-6xl mx-auto w-full lg:flex-row">
        <div className="lg:w-64 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide">Your Stores</h2>
            <Link to="/store/create">
              <button
                disabled={stores.length >= 1}
                className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                <Plus className="w-3 h-3" />
                New Store
              </button>
            </Link>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`w-full bg-zinc-900 rounded-lg p-3 text-left hover:bg-zinc-800 transition-colors border ${selectedStoreId === store.id ? 'border-primary' : 'border-zinc-800 hover:border-primary/50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{store.name}</p>
                    <p className="text-xs text-zinc-400">{store.category}</p>
                    <p className="text-xs text-zinc-500 mt-1">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/store/$id/edit" params={{ id: String(store.id) }} onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                        <Settings className="w-3 h-3" />
                        <span className="sr-only">Edit store</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-800 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStore?.isOpen ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
              >
                <Power className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{currentStore?.isOpen ? "Store Open" : "Store Closed"}</p>
                <p className="text-xs text-zinc-500">{currentStore?.isOpen ? "Accepting new tickets" : "Queue paused"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {livePulse && (
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  Live update
                </div>
              )}
              <Switch
                checked={currentStore?.isOpen ?? false}
                onCheckedChange={(checked) => currentStore && handleToggleStore(currentStore.id, checked)}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8 lg:py-12">
            <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center relative mb-8">
              <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin duration-[3s]" />
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-2">Serving Now</p>
              <h2 className="text-7xl lg:text-8xl font-black tracking-tighter">{currentTicket || '-'}</h2>
            </div>

            {/* Secret Code for Current Ticket */}
            {currentTicket && queueData?.waitingTickets && (
              <div className="mb-6 text-center bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Customer Secret Code</p>
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-md px-5 py-2">
                    <span className="text-4xl lg:text-5xl font-bold font-mono tracking-wider">
                      {String(currentTicketDetails?.secretCode || queueData.waitingTickets.find((t: any) => t.ticketNumber === currentTicket)?.secretCode || 'N/A')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Verify with customer</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 w-full max-w-xs text-center">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Next Ticket</p>
                <p className="text-2xl lg:text-3xl font-bold">{nextTicket || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">In Queue</p>
                <p className="text-2xl lg:text-3xl font-bold">{queueLength}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <Button
              variant="default"
              className="h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold"
              onClick={handleComplete}
              disabled={!currentTicket}
            >
              <CheckCircle2 className="w-6 h-6 mr-2" />
              COMPLETE
            </Button>
            <Button
              className="h-16 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
              onClick={handleCallNext}
              disabled={queueLength === 0}
            >
              <SkipForward className="w-5 h-5 mr-2" />
              CALL NEXT
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
