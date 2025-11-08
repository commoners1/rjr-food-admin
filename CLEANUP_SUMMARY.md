# Admin Web Cleanup Summary

## Overview
Cleaned up the admin-web application to align with the food ordering project schema and remove unnecessary ERP/HR features.

## Pages Kept (Food Ordering Related)

### Core Features
1. **Dashboard** (`/`) - Main dashboard with stats and quick actions
2. **Orders** (`/orders`) - Order management and tracking
3. **Menu** (`/menu`) - Menu items, categories, and variants management
4. **Banner** (`/banner`) - Promotional banner management
5. **Media** (`/media`) - Media library for images and assets
6. **KDS** (`/kds`) - Kitchen Display System for order operations
7. **Reviews** (`/reviews`) - Reviews & sentiment dashboard
8. **Attendance** (`/attendance`) - Employee attendance with face recognition
9. **Finance** (`/finance`) - Finance & ledger management

### User & Settings
10. **Profile** (`/profile`) - User profile management
11. **Settings** (`/settings/general`) - Restaurant-specific settings

## Pages Removed (Old ERP/HR Features)

The following directories and files were removed as they don't align with the food ordering project:

- ❌ `benefits/` - HR benefits management
- ❌ `division/` - Organizational divisions
- ❌ `inventory/` - Old inventory system (not food-related)
- ❌ `job-order/` - HR/project job orders
- ❌ `leave/` - HR leave management
- ❌ `location/` - Old location management
- ❌ `master-data/` - HR master data (division, role, overtime-type)
- ❌ `medical/` - HR medical records
- ❌ `overtime/` - HR overtime management
- ❌ `reimbursement/` - HR reimbursement
- ❌ `salary/` - HR salary management
- ❌ `timesheet/` - HR timesheet tracking
- ❌ `users/` - HR user management (not for restaurant customers)
- ❌ `workflow/` - HR workflow management
- ❌ `dashboard-client-page.tsx` - Old dashboard component

## New Pages Added

1. **Orders Management** (`/orders`) - Complete order management interface
   - View all orders
   - Filter by status (pending, preparing, ready, delivered)
   - Search functionality
   - Order details view

2. **General Settings** (`/settings/general`) - Restaurant-specific settings
   - Restaurant information
   - Operating hours
   - Delivery settings (fees, minimum order, radius)

## Navigation Structure

The navigation has been updated to reflect only food ordering features:

```
Dashboard
├── Orders
├── Menu
├── Banner
├── Media
├── KDS (Kitchen Display System)
├── Reviews
├── Attendance
├── Finance
└── Settings
    └── General
```

## Alignment with Database Schema

All kept pages align with the Prisma schema:

- **Orders** → `Order`, `OrderItem`, `OrderStatusHistory`
- **Menu** → `Product`, `Category`, `ProductVariant`
- **Banner/Media** → Media storage (MinIO/S3)
- **KDS** → `Order` status management
- **Reviews** → `Review`, `ReviewHelpful` (with sentiment from AI service)
- **Attendance** → `Employee`, `FaceTemplate` (face-verify-service)
- **Finance** → `Payment`, `LedgerEntry`, `PromoUsage`

## Integration Points

### Backend API (`services/api`)
- All pages connect to NestJS API endpoints
- REST API for CRUD operations

### AI Services
- **sentiment-service** → Reviews page
- **face-verify-service** → Attendance page

### Workers
- **order-events** → KDS page (real-time updates)
- **review-pipeline** → Reviews page (sentiment analysis)
- **reconciliation** → Finance page (payment reconciliation)

## Next Steps

1. ✅ Cleanup completed
2. ⏳ Connect pages to actual API endpoints
3. ⏳ Implement real-time updates for KDS
4. ⏳ Add data tables with proper columns
5. ⏳ Integrate with AI services
6. ⏳ Add proper authentication and authorization

## Notes

- Profile page kept for admin user management
- Settings updated to restaurant-specific configuration
- All old ERP/HR features removed
- Structure now aligns with food ordering business model

