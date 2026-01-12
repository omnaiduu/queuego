import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from "lucide-react"
import { BottomNav } from "../components/bottom-nav"
import { ActiveTicketCard } from "../components/ActiveTicketCard.tsx"
import { HistoryTicketCard } from "../components/HistoryTicketCard.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { orpc } from "../lib/clientrpc"

/** Activity page route - shows user's active and historical queue tickets */
export const Route = createFileRoute('/activity')({
  component: ActivityPage,
})

/** Main activity page component displaying live queue tickets and booking history */
function ActivityPage() {
  // Fetch user's currently active tickets from all stores
  const { data: activeTickets = [], isLoading: loadingActive } = useQuery(
    orpc.tickets.getMyActive.queryOptions()
  )

  // Fetch user's ticket history (completed, cancelled, etc.) with limit of 20
  const { data: history = [], isLoading: loadingHistory } = useQuery(
    orpc.tickets.getMyHistory.queryOptions({
      input: { limit: 20 },
    })
  )
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      {/* Sticky page header */}
      <header className="bg-background px-4 md:px-8 py-6 sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-2xl font-bold tracking-tight">My Activity</h1>
      </header>

      {/* Main content area with responsive padding and max width */}
      <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
        {/* Tabs for switching between active tickets and history */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-secondary/50 p-1">
            <TabsTrigger value="live" className="rounded-lg text-sm font-medium">
              Live Queue
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg text-sm font-medium">
              History
            </TabsTrigger>
          </TabsList>

          {/* Live Queue Tab - Shows currently active tickets with real-time updates */}
          <TabsContent value="live" className="space-y-4 animate-in slide-in-from-left-2 duration-300">
            {loadingActive ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : activeTickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No active tickets</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTickets.map((ticket: any) => (
                  <ActiveTicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab - Shows past tickets with dates and rebook options */}
          <TabsContent value="history" className="space-y-4 animate-in slide-in-from-right-2 duration-300">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No history yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((ticket: any) => (
                  <HistoryTicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomNav />
    </div>
  )
}
