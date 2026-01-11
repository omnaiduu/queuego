# QueueGo Frontend

Modern queue management application built with [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router).

## Tech Stack

- **TanStack Start** - Full-stack React framework with SSR
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **Tailwind CSS v4** - Utility-first CSS with OKLch color system
- **shadcn/ui** - Beautifully designed components built with Radix UI
- **Bun** - Fast all-in-one JavaScript runtime

## Getting Started

First, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing routes by modifying files in `src/routes/`. The page auto-updates as you edit the file.

This project uses [Geist](https://vercel.com/font) font family for optimal typography.

## Project Structure

```
src/
├── routes/              # File-based routes
│   ├── __root.tsx      # Root layout with providers
│   ├── index.tsx       # Home page (store listings)
│   ├── login.tsx       # Authentication page
│   ├── activity.tsx    # Activity history
│   ├── profile.tsx     # User profile
│   ├── profile.edit.tsx # Edit profile
│   ├── store.$id.tsx   # Store detail (dynamic)
│   ├── store.$id.edit.tsx # Edit store
│   ├── store.create.tsx # Create store
│   ├── ticket.$id.tsx  # Ticket detail (dynamic)
│   └── vendor.dashboard.tsx # Vendor dashboard
├── components/
│   ├── ui/             # shadcn/ui components
│   └── bottom-nav.tsx  # Mobile navigation
├── lib/
│   ├── mock-data/      # Mock data for development
│   ├── orpc-client.ts  # API client setup
│   ├── query-client.ts # TanStack Query setup
│   └── utils.ts        # Utility functions
├── styles/
│   └── globals.css     # Global styles & design system
└── public/             # Static assets

```

## Available Routes

- `/` - Home page with store listings
- `/login` - Authentication
- `/activity` - Activity history
- `/profile` - User profile
- `/profile/edit` - Edit profile
- `/store/[id]` - Store detail page (dynamic)
- `/store/[id]/edit` - Edit store
- `/store/create` - Create new store
- `/ticket/[id]` - Ticket detail page (dynamic)
- `/vendor/dashboard` - Vendor management dashboard

## Design System

The project uses a custom design system with OKLch color space for better color perception:

- **Primary**: oklch(47.07% 0.235 264.36)
- **Secondary**: oklch(90.48% 0.005 286.75)
- **Accent**: oklch(62.83% 0.245 268.48)

Dark mode is fully supported with semantic color tokens.

## Development

### Mock Data

Currently using mock data in `src/lib/mock-data/`. To connect to the backend:

1. Update `src/lib/orpc-client.ts` with backend URL
2. Replace mock data imports with actual API calls using TanStack Query

### Adding New Routes

Create a new file in `src/routes/`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/your-route')({
  component: YourComponent,
})

function YourComponent() {
  return <div>Your content</div>
}
```

For dynamic routes, use `$` prefix: `store.$id.tsx`

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add a new component:

```bash
bunx shadcn@latest add [component-name]
```

## Learn More

To learn more about the technologies used:

- [TanStack Start Documentation](https://tanstack.com/start/latest/docs/overview) - full-stack React framework
- [TanStack Router Documentation](https://tanstack.com/router/latest/docs/overview) - type-safe routing
- [TanStack Query Documentation](https://tanstack.com/query/latest) - data fetching and caching
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) - utility-first CSS
- [shadcn/ui Documentation](https://ui.shadcn.com) - component library

## Building for Production

```bash
bun run build
```

The optimized build will be output to the `dist/` directory.
