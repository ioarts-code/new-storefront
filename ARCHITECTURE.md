# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Side)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    React Components                      │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │              app/page.tsx                        │   │  │
│  │  │  (State: config, services, search, filters)     │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │    │                                                      │  │
│  │    ├─→ Environment variables                            │  │
│  │    │   (NEXT_PUBLIC_HYGRAPH_ENDPOINT, optional token)    │  │
│  │    │                                                      │  │
│  │    ├─→ search-filter.tsx                                 │  │
│  │    │   (Search & category filter)                        │  │
│  │    │                                                      │  │
│  │    └─→ service-grid.tsx                                  │  │
│  │        (Render services)                                 │  │
│  │        ├─→ service-card.tsx (repeated)                   │  │
│  │            (Each service display)                        │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│    │                                                            │
│    ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Runtime Env Vars (config)                    │  │
│  │  - NEXT_PUBLIC_HYGRAPH_ENDPOINT                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│    │                                                            │
│    ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         GraphQL Client (lib/hygraph-client.ts)         │  │
│  │  - Creates GraphQLClient with auth headers            │  │
│  │  - Sends HTTP POST requests to Hygraph                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                    (HTTPS POST / GraphQL)
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    HYGRAPH CMS (Server)                        │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         GraphQL API Endpoint                         │    │
│  │  (https://api-[region].hygraph.com/content/...)     │    │
│  │                                                       │    │
│  │  ├─ GET_SERVICES query                             │    │
│  │  ├─ GET_CATEGORIES query                           │    │
│  │  ├─ SEARCH_SERVICES query                          │    │
│  │  └─ GET_SERVICES_BY_CATEGORY query                 │    │
│  └──────────────────────────────────────────────────────┘    │
│    │                                                           │
│    ↓                                                           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           Content Database                           │    │
│  │                                                       │    │
│  │  ├─ Services Table                                  │    │
│  │  ├─ Categories Table                                │    │
│  │  ├─ Tags Table                                       │    │
│  │  └─ Assets (Images)                                 │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - User Journey

### Step 1: App Launch
```
User opens app
    ↓
Read environment variables
    ↓
Validate endpoint config
    ├─ VALID → Fetch data from Hygraph
    └─ INVALID → Show setup / error message
```

### Step 2: Configuration
```
Developer sets env vars in `.env.local`
    ↓
Restart app
    ↓
App loads Hygraph endpoint and optional token from runtime config
    ↓
Fetch data from Hygraph
    ├─ SUCCESS → Render services
    └─ ERROR   → Show error message
```

### Step 3: Data Fetching
```
Config saved
    ↓
Create GraphQL client with credentials
    ↓
Execute GET_SERVICES query
    ↓
Execute GET_CATEGORIES query
    ↓
Hygraph API returns JSON
    ↓
Update React state
    ↓
Components re-render with data
```

### Step 4: Interaction
```
User types in search box
    ↓
Debounce 300ms
    ↓
Filter services on client-side
    ↓
Update displayed results (no API call)

OR

User clicks category button
    ↓
Filter services by category_id
    ↓
Update displayed results (no API call)
```

---

## Component Hierarchy

```
app/page.tsx (Root Component)
├── Header Section
│   ├── Title & Description
│   └── Optional navigation controls
│
├── search-filter.tsx (Controls)
│   ├── Search Input with clear button
│   └── Category Filter Buttons
│
└── service-grid.tsx (Content)
    ├── Loading Spinner (if loading)
    ├── Empty State (if no results)
    └── service-card.tsx (Repeated for each service)
        ├── Image
        ├── Service Name
        ├── Category Badge
        ├── Description
        ├── Tags (with count)
        └── Visit Link
```

---

## State Management

All state lives in `app/page.tsx`:

```typescript
// Configuration
const [config, setConfig] = useState<HygraphConfig | null>(null)

// Raw data from Hygraph
const [services, setServices] = useState<Service[]>([])
const [categories, setCategories] = useState<Category[]>([])

// User interactions
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

// UI state
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState('')
const [configOpen, setConfigOpen] = useState(false)
```

### State Flow
```
Config changes
    ↓ (useEffect)
Fetch from Hygraph
    ↓
Update services & categories state
    ↓
Components re-render

User searches/filters
    ↓ (useMemo)
Compute filteredServices
    ↓
service-grid re-renders with new list
```

---

## GraphQL Query Flow

### Query Lifecycle

```
1. User configures API
   → GraphQL client created with endpoint + auth

2. Fetch Data Phase
   → GET_SERVICES query sent to Hygraph
   → GET_CATEGORIES query sent to Hygraph
   ↓
   Both queries execute in parallel

3. Response Handling
   → Parse JSON responses
   → Update React state
   ↓
   Services: Service[]
   Categories: Category[]

4. Client-Side Filtering
   → No additional API calls
   → All filtering happens locally
   → Instant user feedback
```

### Example Query Execution

```graphql
// Original Query Definition (lib/graphql-queries.ts)
query GetServices {
  services(first: 100) {
    id
    name
    description
    category { id, name }
    tags(first: 10) { id, name }
  }
}

        ↓

// Sent to Hygraph (via graphql-request)
POST https://api-eu-central-1.hygraph.com/content/[id]/[stage]
Content-Type: application/json
Authorization: Bearer [token] (optional)

{
  "query": "query GetServices { services(first: 100) { ... } }"
}

        ↓

// Response from Hygraph
{
  "data": {
    "services": [
      {
        "id": "xyz123",
        "name": "My Service",
        "description": "...",
        "category": { "id": "abc", "name": "Category Name" },
        "tags": [...]
      },
      ...
    ]
  }
}

        ↓

// Stored in React state
services = [
  { id: "xyz123", name: "My Service", ... },
  ...
]
```

---

## Performance Optimizations

### 1. Debounced Search
```typescript
// User types rapidly
"h" → "he" → "hel" → "help" → "helps"

// Only execute after 300ms of inactivity
useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(searchQuery)  // Filter on client
  }, 300)
  return () => clearTimeout(timer)
}, [searchQuery])
```

### 2. Memoized Filtering
```typescript
// Recompute only when dependencies change
const filteredServices = useMemo(() => {
  // Apply search + category filters
  return services.filter(...)
}, [services, searchQuery, selectedCategory])
```

### 3. Single GraphQL Requests
```typescript
// Parallel requests, not sequential
Promise.all([
  client.request(GET_SERVICES),
  client.request(GET_CATEGORIES)
])
```

### 4. Client-Side Filtering
```
Search, Filter, Sort = NO API CALLS
All computations in browser
Instant feedback to user
```

---

## Error Handling Flow

```
User Action
    ↓
try {
    Execute GraphQL query
    Update state
} catch (error) {
    Set error message
    Log to console
    Display to user
}
    ↓
User sees error with option to:
├─ Click "Update config" to reconfigure
├─ Check browser console for details
└─ Review documentation
```

### Error Scenarios

```
No Config
├─ Show: "Setup Required" message
└─ Action: Check environment variables

Invalid Endpoint
├─ Show: "Invalid endpoint" error
└─ Action: Click "Update config"

Auth Token Expired
├─ Show: "Unauthorized" error
└─ Action: Update token in Settings

No Services
├─ Show: Empty state message
└─ Action: Check Hygraph dashboard

Network Error
├─ Show: "Failed to fetch data" error
└─ Action: Check internet connection
```

---

## TypeScript Type Flow

```
GraphQL Response (JSON)
    ↓
Parse with graphql-request
    ↓
Type-check with TypeScript
    ├─ Service (interface)
    ├─ Category (interface)
    ├─ Tag (interface)
    └─ ServicesResponse (interface)
    ↓
React State (Typed)
    ├─ services: Service[]
    ├─ categories: Category[]
    └─ ...
    ↓
Component Props (Typed)
    ├─ service: Service
    ├─ services: Service[]
    └─ ...
    ↓
No Runtime Errors
```

---

## Environment Variable Configuration

```
Runtime config
└─ NEXT_PUBLIC_HYGRAPH_ENDPOINT
```

Example:
```env
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/c1a2b3d4/published
```
```

---

## Caching & Revalidation

### Current Implementation
- ✅ All data fetched on config save
- ✅ Client-side filtering (instant)
- ✅ No re-fetching on search/filter
- ✅ Environment variables for config persistence

### Potential Future Enhancements
- Add SWR for automatic revalidation
- Implement pagination for large datasets
- Add cache busting on manual refresh
- Store last-fetch timestamp

---

## Security & Authentication

### API Endpoint
- ✅ HTTPS only
- ✅ User provides endpoint via env vars
- ✅ Validated before use

### Auth Token (Optional)
- ✅ Passed in Authorization header
- ✅ Supports Bearer token format
- ✅ Optional (public endpoints work)

### Runtime Config
- ✅ Browser-safe `NEXT_PUBLIC_` variables
- ✅ No server-side secrets exposed in client bundle
- ✅ User config controlled via `.env.local`

### Sensitive Data
- ✅ No passwords
- ✅ No API keys in code
- ✅ No personal data in logs

---

## Browser APIs Used

```
fetch() / graphql-request
├─ POST requests to GraphQL
└─ JSON parsing

React 19.2
├─ Hooks (useState, useEffect, useMemo, useCallback)
├─ Client components ('use client')
└─ Component composition

Next.js 16
├─ Image optimization
├─ Font loading
└─ Metadata

Tailwind CSS
├─ Responsive classes
└─ Component styling
```

---

## Scaling Considerations

The architecture can handle:

| Aspect | Capacity | Notes |
|--------|----------|-------|
| Services | 10,000+ | Use pagination |
| Categories | 100+ | No limit |
| Tags | 1,000+ | No limit |
| Concurrent Users | Unlimited | Client-side only |
| API Rate Limit | Depends on Hygraph plan | No per-request limit |
| Initial Load | <2 seconds | Depends on service count |
| Search Performance | Instant | Client-side |

---

## Future Extension Points

### Easy to Add
- ✅ More GraphQL queries
- ✅ Pagination
- ✅ Sorting (name, date, etc.)
- ✅ Favorites/bookmarks
- ✅ Dark mode
- ✅ Internationalization (i18n)
- ✅ Analytics tracking
- ✅ Comments/ratings

### Requires Changes
- ❌ User authentication (auth layer needed)
- ❌ Subscription management (payment integration)
- ❌ Admin dashboard (new routes)
- ❌ Real-time updates (WebSocket)

---

This architecture prioritizes:
- **Simplicity** - Easy to understand and modify
- **Performance** - Client-side filtering, minimal API calls
- **Maintainability** - Clear component structure, type safety
- **Extensibility** - Easy to add features without breaking changes
