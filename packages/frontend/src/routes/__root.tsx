import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import appCss from "../styles.css?url"
import { Toaster } from "../components/ui/sonner"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "QueueGo - Smart Queue Management" },
      { name: "description", content: "Join queues digitally and skip the wait" }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  context: () => ({
    queryClient: undefined! as QueryClient,
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Outlet />
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
