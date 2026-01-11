import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { X, SkipForward, CheckCircle2, Power, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/vendor/dashboard')({
  component: VendorDashboard,
})

function VendorDashboard() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [currentTicket, setCurrentTicket] = useState(42)
  const [queueLength, setQueueLength] = useState(12)
  const [stores] = useState([
    {
      id: 1,
      name: "Dr. Smith Dental Clinic",
      category: "Medical",
      address: "123 Healthcare Ave, New York, NY",
      openTime: "10:00",
      closeTime: "20:00",
      deposit: 20,
      isActive: true,
    },
  ])

  const handleCallNext = () => {
    setCurrentTicket((prev) => prev + 1)
    setQueueLength((prev) => Math.max(0, prev - 1))
  }

  const handleSkip = () => {
    setCurrentTicket((prev) => prev + 1)
    setQueueLength((prev) => Math.max(0, prev - 1))
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
              <button className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Plus className="w-3 h-3" />
                New Store
              </button>
            </Link>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => { }}
                className="w-full bg-zinc-900 rounded-lg p-3 text-left hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{store.name}</p>
                    <p className="text-xs text-zinc-400">{store.category}</p>
                    <p className="text-xs text-zinc-500 mt-1">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/store/$id/edit" params={{ id: store.id.toString() }} onClick={(e) => e.stopPropagation()}>
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
          <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpen ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
              >
                <Power className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{isOpen ? "Store Open" : "Store Closed"}</p>
                <p className="text-xs text-zinc-500">{isOpen ? "Accepting new tickets" : "Queue paused"}</p>
              </div>
            </div>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8 lg:py-12">
            <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center relative mb-8">
              <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin duration-[3s]" />
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-2">Serving Now</p>
              <h2 className="text-7xl lg:text-8xl font-black tracking-tighter">{currentTicket}</h2>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-xs text-center">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Next Ticket</p>
                <p className="text-2xl lg:text-3xl font-bold">{currentTicket + 1}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">In Queue</p>
                <p className="text-2xl lg:text-3xl font-bold">{queueLength}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <Button
              variant="outline"
              className="h-16 rounded-2xl border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
              onClick={handleSkip}
            >
              <SkipForward className="w-5 h-5 mr-2" />
              SKIP
            </Button>
            <Button className="h-16 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20" onClick={handleCallNext}>
              <CheckCircle2 className="w-6 h-6 mr-2" />
              CALL NEXT
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
