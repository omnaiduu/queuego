"use client"
import Link from "next/link"
import { Calendar, ChevronRight, RotateCcw } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
      <header className="bg-background px-4 md:px-8 py-6 sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-2xl font-bold tracking-tight">My Activity</h1>
      </header>

      <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-secondary/50 p-1">
            <TabsTrigger value="live" className="rounded-lg text-sm font-medium">
              Live Queue
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg text-sm font-medium">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4 animate-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Dr. Smith Dental Clinic</h3>
                    <p className="text-sm text-muted-foreground">Ticket #55</p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Serving</p>
                    <p className="text-2xl font-bold">42</p>
                  </div>
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Wait</p>
                    <p className="text-2xl font-bold text-primary">~35m</p>
                  </div>
                </div>

                <Link href="/ticket/55">
                  <Button className="w-full h-12 rounded-xl font-bold shadow-md">
                    View Ticket
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 animate-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">City Barber Shop</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Yesterday, 4:30 PM
                    </p>
                  </div>
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-2.5 py-1 rounded-full">
                    COMPLETED
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
                  <span className="text-sm font-medium">Paid: ₹20</span>
                  <Link href="/store/2">
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

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 opacity-75">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">Green Leaf Cafe</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Oct 24, 11:00 AM
                    </p>
                  </div>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    CANCELLED
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
                  <span className="text-sm font-medium">Refunded</span>
                  <Link href="/store/4">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
