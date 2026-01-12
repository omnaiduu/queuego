import { Link } from '@tanstack/react-router'
import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

/** Displays a single active ticket in the live queue with real-time wait information */
export function ActiveTicketCard({ ticket }: { ticket: any }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            {/* Ticket header with store name and status badge */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">{ticket.store.name}</h3>
                    <p className="text-sm text-muted-foreground">Ticket #{ticket.ticketNumber}</p>
                </div>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    {ticket.status.toUpperCase()}
                </span>
            </div>

            {/* Queue information: currently serving number and estimated wait time */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Serving</p>
                    <p className="text-2xl font-bold">{ticket.currentlyServing || '-'}</p>
                </div>
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Wait</p>
                    <p className="text-2xl font-bold text-primary">~{ticket.estimatedWaitTime}m</p>
                </div>
            </div>

            {/* Action button to view full ticket details */}
            <Link to="/ticket/$id" params={{ id: String(ticket.id) }}>
                <Button className="w-full h-12 rounded-xl font-bold shadow-md">
                    View Ticket
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </div>
    )
}
