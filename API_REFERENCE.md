# QueueGo API Quick Reference

## 📁 Backend Code Navigation Guide

### **How to Read the Backend Code**

The backend is organized into clear sections. Here's where to find everything:

#### **🗂️ Main Files**
- **`src/index.ts`** - Server entry point, handles HTTP requests, CORS, static files
- **`src/router/index.ts`** - Main router that combines all API endpoints

#### **🔌 API Endpoints (Router Files)**
All API methods are in `src/router/`:
- **`auth.ts`** - User registration, login, logout, get current user
- **`stores.ts`** - Store management (list, create, update, toggle status, services)
- **`tickets.ts`** - Queue management (join, cancel, call next, complete, get status)
- **`users.ts`** - User operations (list, find, create, update profile)
- **`upload.ts`** - File upload handling (base64 images)
- **`notifications.ts`** - Push notifications (disabled, table not in schema yet)

#### **🔒 Authentication & Security**
- **`src/middleware/auth.ts`** - Protects routes, validates users from cookies

#### **🛠️ Utility Functions**
All helper functions are in `src/lib/`:
- **`password.ts`** - Hash and verify passwords (SHA-256)
- **`queue.ts`** - Calculate wait times, generate secret codes, distance calculations
- **`messageClass.ts`** - WhatsApp notifications (Meta API integration)

#### **💾 Database Schema**
All table definitions are in `src/db/schema/`:
- **`users.ts`** - User accounts table
- **`stores.ts`** - Stores/vendors and their services
- **`tickets.ts`** - Queue tickets and service history
- **`index.ts`** - Exports all schemas

#### **🗄️ Database Setup**
- **`src/db/index.ts`** - Database connection (Turso/SQLite)
- **`src/db/migrate.ts`** - Run database migrations
- **`drizzle.config.ts`** - Drizzle ORM configuration

#### **📝 How Each API Method Works**

Every API endpoint follows this pattern:
```typescript
export const methodName = os
  .use(authMiddleware)        // Optional: Requires login
  .input(z.object({ ... }))   // Validates input with Zod
  .handler(async ({ input, context }) => {
    // 1. Validate permissions (check ownership, etc.)
    // 2. Query database
    // 3. Perform business logic
    // 4. Send notifications (if needed)
    // 5. Return result
  });
```

#### **🔍 Finding Specific Functionality**

**Want to understand how...?**
- **Login works** → `src/router/auth.ts` → `login` method
- **Queue joining works** → `src/router/tickets.ts` → `createTicket` method
- **Wait time is calculated** → `src/lib/queue.ts` → `calculateWaitTime` function
- **WhatsApp notifications are sent** → `src/lib/messageClass.ts`
- **Authentication is enforced** → `src/middleware/auth.ts`
- **Store owners manage queues** → `src/router/tickets.ts` → vendor methods

#### **🎯 Code Reading Tips**

1. **Start with the router** (`src/router/index.ts`) to see all available endpoints
2. **Each method is documented** with comments explaining what it does
3. **Follow imports** to understand dependencies
4. **Check middleware** to understand authentication flow
5. **Schema files** show database structure and relationships

---

## 🏪 Stores

### List Stores (Public)
```typescript
const stores = await client.stores.list({
  search?: string,      // Search in name, category, description
  category?: string,    // Filter by category
  isOpen?: boolean,     // Filter by open status
  limit?: number,       // Default: 50, Max: 100
  offset?: number       // Default: 0
});
// Returns: Array of stores with queueCount
```

### Get Store Details (Public)
```typescript
const store = await client.stores.get({
  id: number
});
// Returns: Store with services[], queueCount, currentTicket
```

### Create Store (Vendor - Auth Required)
```typescript
const store = await client.stores.create({
  name: string,                    // Required
  category: string,                // Required
  description?: string,
  address: string,                 // Required
  city?: string,
  state?: string,
  zipCode?: string,
  phone?: string,
  email?: string,
  imageUrl?: string,
  openTime?: string,              // Default: "10:00"
  closeTime?: string,             // Default: "20:00"
  deposit?: number,               // Default: 0
  defaultServiceTime?: number     // Default: 5 minutes
});
```

### Update Store (Vendor - Auth Required)
```typescript
const store = await client.stores.update({
  id: number,
  // All other fields optional (same as create)
});
```

### Toggle Store Status (Vendor - Auth Required)
```typescript
const store = await client.stores.toggleStatus({
  id: number,
  isOpen: boolean
});
```

### Get My Stores (Vendor - Auth Required)
```typescript
const stores = await client.stores.getMy();
```

### Add Service (Vendor - Auth Required)
```typescript
const service = await client.stores.addService({
  storeId: number,
  name: string,
  description?: string,
  price?: string
});
```

### Remove Service (Vendor - Auth Required)
```typescript
await client.stores.removeService({
  serviceId: number
});
```

---

## 🎫 Tickets & Queue

### Create Ticket / Join Queue (Customer - Auth Required)
```typescript
const ticket = await client.tickets.create({
  storeId: number
});
// Returns: Ticket with estimatedWaitTime
```

### Get Ticket Details (Customer - Auth Required)
```typescript
const ticket = await client.tickets.get({
  id: number
});
// Returns: Ticket with store, currentlyServing, peopleAhead, estimatedWaitTime
```

### Cancel Ticket / Leave Queue (Customer - Auth Required)
```typescript
const ticket = await client.tickets.cancel({
  id: number
});
```

### Get Active Tickets (Customer - Auth Required)
```typescript
const tickets = await client.tickets.getMyActive();
// Returns: Array of active tickets with wait time info
```

### Get Ticket History (Customer - Auth Required)
```typescript
const history = await client.tickets.getMyHistory({
  limit?: number,    // Default: 20, Max: 100
  offset?: number    // Default: 0
});
```

### Call Next Ticket (Vendor - Auth Required)
```typescript
const ticket = await client.tickets.callNext({
  storeId: number
});
// Marks current as completed, calls next waiting ticket
```

### Skip Ticket (Vendor - Auth Required)
```typescript
const ticket = await client.tickets.skip({
  storeId: number,
  ticketId: number
});
// Marks ticket as no_show
```

### Get Store Queue (Vendor - Auth Required)
```typescript
const queue = await client.tickets.getStoreQueue({
  storeId: number
});
// Returns: { currentTicket, nextTicket, queueLength, waitingTickets[] }
```

---

## 📡 Real-time SSE Streams

### Stream Queue Updates (Public)
```typescript
for await (const update of client.tickets.streamQueueUpdates({ storeId: number })) {
  console.log(update);
  // { currentTicket, queueLength, timestamp }
}
// Updates every 3 seconds
```

### Stream Ticket Status (Customer - Auth Required)
```typescript
for await (const update of client.tickets.streamTicketStatus({ ticketId: number })) {
  console.log(update);
  // { status, currentlyServing, peopleAhead, estimatedWaitTime, timestamp }
}
// Updates every 3 seconds, auto-closes when completed/cancelled
```

---

## 🔔 Notifications

### Subscribe to Push (Auth Required)
```typescript
const subscription = await client.notifications.subscribe({
  endpoint: string,  // From browser push subscription
  p256dh: string,    // Public key
  auth: string       // Auth secret
});
```

### Unsubscribe (Auth Required)
```typescript
await client.notifications.unsubscribe({
  endpoint: string
});
```

### Get My Subscriptions (Auth Required)
```typescript
const subscriptions = await client.notifications.getMy();
```

---

## 📤 Upload

### Upload Image (Auth Required)
```typescript
// 1. Compress image first
import { compressImageToBase64 } from '@/lib/image-utils';
const dataUrl = await compressImageToBase64(file);

// 2. Upload
const result = await client.upload.image({
  dataUrl: string,    // base64 data URL
  filename: string
});
// Returns: { url, filename }
```

---

## 🔐 Authentication

### Register
```typescript
const user = await client.auth.register({
  name: string,
  email: string,
  password: string
});
```

### Login
```typescript
const user = await client.auth.login({
  email: string,
  password: string
});
```

### Logout
```typescript
await client.auth.logout();
```

### Get Current User
```typescript
const user = await client.auth.getCurrentUser();
```

---

## 🎯 Common Patterns

### Search Stores Near Me
```typescript
const stores = await client.stores.list({
  isOpen: true,
  limit: 10
});

// Filter by distance (do on frontend after getting coords)
const nearby = stores.filter(store => {
  // Calculate distance using store.latitude, store.longitude
  return distance < 5; // 5km
});
```

### Join Queue with Notification
```typescript
// 1. Create ticket
const ticket = await client.tickets.create({ storeId: 1 });

// 2. Subscribe to updates
for await (const update of client.tickets.streamTicketStatus({ ticketId: ticket.id })) {
  if (update.status === 'called') {
    // Show notification: "Your turn is coming!"
  }
  if (update.status === 'serving') {
    // Show notification: "You're being served now!"
    break;
  }
}
```

### Vendor Dashboard Updates
```typescript
// Get initial queue state
const queue = await client.tickets.getStoreQueue({ storeId: 1 });

// Subscribe to real-time updates
for await (const update of client.tickets.streamQueueUpdates({ storeId: 1 })) {
  // Update UI with latest queue info
  updateDashboard(update);
}
```

---

## ❌ Error Handling

All endpoints throw descriptive errors:

```typescript
try {
  await client.tickets.create({ storeId: 1 });
} catch (error) {
  // Possible errors:
  // - "Store not found"
  // - "Store is currently closed"
  // - "You already have an active ticket for this store"
  console.error(error.message);
}
```

---

## 📊 Ticket States

- `waiting` - In queue
- `called` - Vendor called the ticket
- `serving` - Currently being served
- `completed` - Successfully served
- `cancelled` - User left queue
- `no_show` - User didn't show up when called

---

## 🧮 Wait Time Formula

```
W = N × [(0.7 × T_recent) + (0.3 × T_default)]
```

- Calculated automatically
- Updates based on last 3 completed services
- More weight on recent performance (70%)
- Falls back to default when no history (30%)
- **Implementation**: See `src/lib/queue.ts` → `calculateWaitTime()`

---

## 🏗️ Backend Architecture

### **Technology Stack**
- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: oRPC (type-safe RPC framework)
- **Database**: Turso (SQLite for production) / Local SQLite (dev)
- **ORM**: Drizzle ORM (type-safe database queries)
- **Validation**: Zod (schema validation)
- **Auth**: Cookie-based (no session table, token in cookie)

### **Request Flow**
```
1. HTTP Request → index.ts (Bun server)
2. Route to /rpc → RPCHandler
3. Match procedure → router/[endpoint].ts
4. Run middleware → auth.ts (if protected)
5. Validate input → Zod schemas
6. Execute handler → Business logic
7. Query database → Drizzle ORM
8. Send notifications → WhatsApp API (optional)
9. Return response → Type-safe JSON
```

### **Database Schema Overview**

**`users` table**:
- User accounts (name, email, passwordHash)
- Referenced by stores and tickets

**`stores` table**:
- Store/vendor information
- Operating hours, location, settings
- Owner reference to users
- Queue settings (deposit, service time)

**`tickets` table**:
- Queue tickets with status tracking
- Foreign keys: storeId, userId
- Timestamps for each status change
- Position tracking for queue

**`service_history` table**:
- Tracks actual service times
- Used for adaptive wait time calculation
- Links to tickets and stores

**`store_services` table**:
- Services offered by each store
- Name, description, price

### **Key Design Patterns**

**Authentication Middleware**:
- Extracts user from cookie
- Adds user to context for all protected routes
- Throws UNAUTHORIZED error if invalid

**Error Handling**:
- All procedures can throw typed errors
- Frontend automatically redirects to login on UNAUTHORIZED
- Descriptive error messages for debugging

**Real-time Updates**:
- Frontend polls every 1 second using React Query
- `refetchInterval: 1000` in all live data queries
- No WebSockets needed for this use case

**Type Safety**:
- Backend router types are imported in frontend
- Full autocomplete for all API calls
- Compile-time checking of input/output

---

## 🚀 Getting Started with the Code

### **Running the Backend**
```bash
cd packages/backend
bun install
bun dev  # Starts on port 4000
```

### **Database Migrations**
```bash
bun run db:generate  # Generate migration from schema changes
bun run db:migrate   # Apply migrations
bun run db:push      # Push schema directly (dev only)
```

### **Testing API Endpoints**
```typescript
// Use the frontend client
import { orpcClient } from '@/lib/clientrpc'

// All endpoints are typed
const stores = await orpcClient.stores.list({ isOpen: true })
const ticket = await orpcClient.tickets.create({ storeId: 1 })
```

### **Adding a New Endpoint**

1. **Create the procedure** in `src/router/[domain].ts`:
```typescript
export const myMethod = os
  .use(authMiddleware)  // If auth required
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    // Your logic here
    return { success: true }
  })
```

2. **Add to router** in `src/router/index.ts`:
```typescript
export const router = {
  // ...existing routes
  myDomain: {
    myMethod,
  }
}
```

3. **Use in frontend**:
```typescript
const result = await orpcClient.myDomain.myMethod({ id: 1 })
```

---

## 📚 Further Reading

- **oRPC Docs**: [orpc.io](https://orpc.io) - RPC framework
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team) - Database queries
- **Zod**: [zod.dev](https://zod.dev) - Schema validation
- **Bun**: [bun.sh](https://bun.sh) - JavaScript runtime
