# Admin Web - Rumah Jajan Rara

Admin dashboard for managing the food ordering platform.

## Features

Based on the feature mapping plan, this admin web application includes:

### 1. Menu/Banner/Media Management
- **Menu Management** (`/menu`) - Manage menu items, categories, and variants
- **Banner Management** (`/banner`) - Manage promotional banners
- **Media Library** (`/media`) - Upload and manage media assets

### 2. Kitchen Display System (KDS) / Operations
- **KDS Dashboard** (`/kds`) - Real-time kitchen order management
- Monitor order status (pending, preparing, ready)
- Track preparation times
- Kitchen operations workflow

### 3. Reviews & Sentiment Dashboard
- **Reviews Dashboard** (`/reviews`) - View all customer reviews
- **Sentiment Analysis** - AI-powered sentiment analysis from sentiment-service
- Sentiment trends and analytics
- Review moderation

### 4. Attendance (Face Recognition)
- **Attendance Management** (`/attendance`) - Employee attendance tracking
- **Face Enrollment** - Enroll employees for face recognition
- Real-time attendance monitoring
- Integration with face-verify-service

### 5. Finance/Ledger
- **Finance Dashboard** (`/finance`) - Revenue and expense tracking
- **Ledger Management** - Financial transaction records
- **Payment Reconciliation** - Reconcile payments with ledger
- Financial reports and analytics

## Tech Stack

- **Next.js 16.0.1** - React framework (Latest stable 2025)
- **React 19.2.0** - UI library (Latest stable 2025)
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **TypeScript 5.7.3** - Type safety
- **Axios 1.7.9** - HTTP client
- **@rjr/types** - Shared types from monorepo

## Getting Started

### Development

```bash
# Install dependencies (from root)
npm install

# Start development server
npm run dev --filter=@rjr/admin-web

# Or from this directory
npm run dev
```

The admin web will be available at `http://localhost:9003`

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Project Structure

```
apps/admin-web/
├── src/
│   ├── app/
│   │   └── (dashboard)/
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── menu/              # Menu management
│   │       ├── banner/            # Banner management
│   │       ├── media/             # Media library
│   │       ├── kds/               # Kitchen Display System
│   │       ├── reviews/           # Reviews & sentiment
│   │       ├── attendance/        # Attendance management
│   │       └── finance/           # Finance & ledger
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   └── nav-links.tsx          # Navigation component
│   └── lib/
│       └── utils.ts               # Utility functions
```

## Integration Points

### Backend API (`services/api`)
- REST endpoints for all CRUD operations
- Authentication and authorization
- Real-time data updates

### AI Services
- **sentiment-service** - Review sentiment analysis
- **face-verify-service** - Face recognition for attendance

### Workers
- **review-pipeline** - Processes reviews and calls sentiment-service
- **order-events** - Updates KDS with order status changes
- **reconciliation** - Handles payment reconciliation

### Database
- Uses Prisma schema from `database/prisma`
- Models: Products, Orders, Reviews, Employee, FaceTemplate, Ledger

## Environment Variables

Create a `.env.local` file:

```env
# Backend API URL (without /api suffix - it's added automatically)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Other service URLs
NEXT_PUBLIC_FACE_VERIFY_URL=http://localhost:8001
NEXT_PUBLIC_SENTIMENT_URL=http://localhost:8002
```

**Important**: The API URL should NOT include `/api` - it's automatically appended by the axios configuration.

## Features in Detail

### Menu Management
- Create, edit, delete menu items
- Manage categories
- Set pricing and variants
- Stock management
- Product images

### KDS (Kitchen Display System)
- Real-time order updates
- Order status tracking
- Preparation time monitoring
- Kitchen workflow optimization

### Reviews & Sentiment
- View all customer reviews
- Sentiment analysis (positive/negative/neutral)
- Sentiment trends and charts
- Review moderation tools

### Attendance
- Face recognition-based check-in/check-out
- Employee enrollment
- Attendance history
- Real-time monitoring

### Finance
- Revenue tracking
- Expense management
- Ledger entries
- Payment reconciliation
- Financial reports

## Development Notes

- Uses Turborepo for monorepo management
- Shares types with `@rjr/types` package
- Follows Next.js 15 App Router conventions
- Uses server components where possible
- Client components for interactive features
