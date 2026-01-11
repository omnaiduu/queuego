import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChevronLeft, Share2, Clock, MapPin, Phone, Star, Users, CheckCircle2, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_STORES } from '@/lib/mock-data'

export const Route = createFileRoute('/store/$id')({
  component: StoreDetailPage,
})

function StoreDetailPage() {
  const { id } = useParams({ from: '/store/$id' })
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [queueCount, setQueueCount] = useState(12)
  const [waitTime, setWaitTime] = useState(35)

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prev) => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const store = MOCK_STORES.find((s) => s.id === parseInt(id))

  if (!store) {
    return <div className="p-6">Store not found</div>
  }

  const handleJoinQueue = () => {
    setIsJoining(true)
    setTimeout(() => {
      setIsJoining(false)
      setShowSuccess(true)
      setQueueCount((prev) => prev + 1)
      setWaitTime((prev) => prev + 5)
      setTimeout(() => {
        navigate({ to: '/ticket/$id', params: { id: '55' } })
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0 relative">
      <div className="max-w-md md:max-w-2xl lg:max-w-6xl mx-auto relative lg:mt-20">
        <header className="relative h-[35vh] lg:h-[40vh] w-full">
          <img
            src={store.image || '/placeholder.svg'}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <Link to="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-6 h-6" />
              <span className="sr-only">Back</span>
            </Link>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="sr-only">Share</span>
            </button>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
              {store.isOpen ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-green-700 tracking-wide">OPEN NOW</span>
                </>
              ) : (
                <span className="text-xs font-bold text-zinc-700 tracking-wide">CLOSED</span>
              )}
            </div>
          </div>
        </header>

        <div className="px-4 -mt-8 relative z-10 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-5 lg:p-8 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-500 tracking-wider uppercase">Live Queue Status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {queueCount}
                </span>
                <span className="text-sm text-zinc-500 font-medium">People Waiting</span>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-700" />
              </div>

              <div className="flex flex-col items-start md:items-end md:pl-4">
                <span className="text-3xl md:text-4xl font-bold text-primary tracking-tight">~{waitTime}</span>
                <span className="text-sm text-zinc-500 font-medium">Mins Wait</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 lg:px-8 pt-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">{store.name}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">{store.category}</span>
              <span>•</span>
              <span>{store.distance}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium">{store.rating}</span>
                <span className="text-zinc-400 font-normal">({store.reviews})</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">About</h3>
            <p
              className={cn("text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed", !isExpanded && "line-clamp-3")}
            >
              Specialists in root canals, general checkups, and cosmetic dentistry. Our clinic is equipped with
              state-of-the-art technology to ensure a pain-free experience. We have been serving the community for over
              15 years with a focus on patient comfort and care. Walk-ins are welcome but joining the digital queue is
              recommended to minimize wait times.
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-primary hover:underline focus:outline-none"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              Services & Pricing
            </h3>

            <div className="space-y-3">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3 divide-y divide-zinc-200 dark:divide-zinc-700">
                {[
                  { name: "Dental Checkup", description: "Routine cleaning and examination", price: "500" },
                  { name: "Root Canal", description: "Advanced root canal treatment", price: "2000" },
                  { name: "Cosmetic Dentistry", description: "Teeth whitening and alignment", price: "3500" },
                ].map((service, index) => (
                  <div key={index} className={index !== 0 ? "pt-3" : ""}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{service.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{service.description}</p>
                      </div>
                      <p className="text-sm font-bold text-primary flex-shrink-0">₹{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">Details</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">10:00 AM - 8:00 PM</p>
                  <p className="text-xs text-zinc-500">Open today</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=123+Healthcare+Ave,+New+York,+NY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                    123 Healthcare Ave, Medical District
                  </p>
                  <p className="text-xs text-zinc-500">New York, NY 10012</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">+1 (555) 123-4567</p>
                  <p className="text-xs text-zinc-500">Reception desk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 md:max-w-2xl lg:max-w-6xl mx-auto lg:relative lg:border-t lg:bottom-auto lg:left-auto lg:right-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Booking Deposit</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">₹20</span>
              <span className="text-xs text-zinc-400">/ person</span>
            </div>
            <span className="text-[10px] text-green-600 font-medium">Deductible from final bill</span>
          </div>

          <button
            onClick={handleJoinQueue}
            disabled={isJoining}
            className="w-full md:flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-12 rounded-xl font-bold text-sm shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>JOINING...</span>
              </>
            ) : (
              <>
                <span>JOIN QUEUE</span>
                <Users className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">You're in line!</h2>
                <p className="text-zinc-500">We'll notify you when it's your turn.</p>
              </div>

              <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 my-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Ticket Number</span>
                  <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Est. Wait</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">#55</span>
                  <span className="text-xl font-bold text-primary">~40m</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: '/ticket/$id', params: { id: '55' } })}
                className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                GO TO TICKET
              </button>

              <button
                onClick={() => setShowSuccess(false)}
                className="text-sm text-zinc-400 font-medium hover:text-zinc-600 py-2"
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
