// Mock store data
export const MOCK_STORES = [
  {
    id: 1,
    name: "Dr. Smith Dental Clinic",
    category: "Medical",
    rating: 4.8,
    reviews: 124,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
    isOpen: true,
    waitTime: 35,
    address: "123 Healthcare Ave, New York, NY",
    phone: "+1 (555) 123-4567",
    openTime: "10:00",
    closeTime: "20:00",
    deposit: 20,
    description: "Professional dental care with modern equipment and experienced staff. Specializing in general dentistry, cosmetic procedures, and emergency care.",
  },
  {
    id: 2,
    name: "City Barber Shop",
    category: "Beauty",
    rating: 4.5,
    reviews: 89,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
    isOpen: true,
    waitTime: 15,
    address: "456 Style Street, New York, NY",
    phone: "+1 (555) 234-5678",
    openTime: "09:00",
    closeTime: "21:00",
    deposit: 10,
    description: "Traditional barbershop experience with modern styling. Expert barbers providing haircuts, beard trims, and grooming services.",
  },
  {
    id: 3,
    name: "Tech Fix Center",
    category: "Repair",
    rating: 4.9,
    reviews: 210,
    distance: "2.5 km",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
    isOpen: false,
    waitTime: 0,
    address: "789 Tech Plaza, New York, NY",
    phone: "+1 (555) 345-6789",
    openTime: "10:00",
    closeTime: "18:00",
    deposit: 25,
    description: "Professional electronics repair services. Smartphones, laptops, tablets, and gaming devices. Quick turnaround with warranty.",
  },
  {
    id: 4,
    name: "Green Leaf Cafe",
    category: "Food",
    rating: 4.7,
    reviews: 156,
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    isOpen: true,
    waitTime: 20,
    address: "321 Organic Avenue, New York, NY",
    phone: "+1 (555) 456-7890",
    openTime: "07:00",
    closeTime: "22:00",
    deposit: 5,
    description: "Organic cafe serving healthy breakfast, lunch, and specialty coffee. Farm-to-table ingredients.",
  },
]

export type Store = typeof MOCK_STORES[0]

// Mock ticket data
export interface Ticket {
  id: number
  storeId: number
  storeName: string
  ticketNumber: number
  queuePosition: number
  totalInQueue: number
  estimatedWait: number
  status: 'waiting' | 'ready' | 'completed' | 'cancelled'
  joinedAt: string
  category: string
  storeImage: string
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 55,
    storeId: 1,
    storeName: "Dr. Smith Dental Clinic",
    ticketNumber: 42,
    queuePosition: 3,
    totalInQueue: 12,
    estimatedWait: 15,
    status: 'waiting',
    joinedAt: new Date().toISOString(),
    category: "Medical",
    storeImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
  },
]

// Mock user profile
export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  initials: string
}

export const MOCK_USER: UserProfile = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 000-0000",
  initials: "JD",
}

// Mock activity data
export interface Activity {
  id: number
  type: 'queue_joined' | 'queue_completed' | 'queue_cancelled'
  storeName: string
  storeId: number
  timestamp: string
  ticketNumber?: number
  status: 'completed' | 'cancelled' | 'active'
  date: string
  waitTime: string
}

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'queue_completed',
    storeName: "Dr. Smith Dental Clinic",
    storeId: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ticketNumber: 38,
    status: 'completed',
    date: '2 hours ago',
    waitTime: '15 min',
  },
  {
    id: 2,
    type: 'queue_joined',
    storeName: "City Barber Shop",
    storeId: 2,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ticketNumber: 15,
    status: 'cancelled',
    date: '5 hours ago',
    waitTime: '10 min',
  },
  {
    id: 3,
    type: 'queue_completed',
    storeName: "Green Leaf Cafe",
    storeId: 4,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ticketNumber: 22,
    status: 'completed',
    date: '1 day ago',
    waitTime: '5 min',
  },
]
