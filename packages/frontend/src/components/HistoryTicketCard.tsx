import { Link } from '@tanstack/react-router'
import { Calendar, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"

/** Displays a completed ticket from history with booking date and rebook option */
export function HistoryTicketCard({ ticket }: { ticket: any }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            {/* Ticket header with store name, date, and status */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg">{ticket.store.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-2.5 py-1 rounded-full">
                    {ticket.status.toUpperCase()}
                </span>
            </div>

            {/* Footer with deposit info and rebook action */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
                {ticket.depositAmount > 0 && (
                    <span className="text-sm font-medium">Paid: ₹{ticket.depositAmount}</span>
                )}
                <Link to="/store/$id" params={{ id: String(ticket.store.id) }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Book Again
                    </Button>
                </Link>
            </div>
        </div>
    )
}
