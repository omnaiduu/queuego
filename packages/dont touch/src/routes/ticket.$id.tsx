import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChevronLeft, AlertCircle, Clock, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/ticket/$id')({
  component: TicketPage,
})

function TicketPage() {
  const navigate = useNavigate()
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [progress, setProgress] = useState(35)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLeaveQueue = () => {
    navigate({ to: '/' })
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
        <h1 className="font-bold text-lg">Ticket #55</h1>
        <div className="w-10" />
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
            <h2 className="text-6xl lg:text-8xl font-black text-primary tracking-tighter">55</h2>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Serving</p>
              <p className="text-2xl lg:text-3xl font-bold">42</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Est. Wait</p>
              <p className="text-2xl lg:text-3xl font-bold">~35m</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold text-lg mb-4">Dr. Smith Dental Clinic</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>123 Healthcare Ave, NY</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>You joined at 2:30 PM</span>
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
            <h3 className="text-xl font-bold mb-2 text-center">Leave Queue?</h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Are you sure? Your booking deposit of <span className="font-bold text-foreground">₹20</span> is
              non-refundable.
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
