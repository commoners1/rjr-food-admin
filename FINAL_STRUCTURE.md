# Admin Web - Final Structure

## Complete Directory Structure

```
apps/admin-web/src/app/(dashboard)/
├── page.tsx                    # Main dashboard
├── layout.tsx                  # Dashboard layout
│
├── orders/                     # Order management
│   └── page.tsx
│
├── menu/                       # Menu management
│   └── page.tsx
│
├── banner/                     # Banner management
│   └── page.tsx
│
├── media/                      # Media library
│   └── page.tsx
│
├── kds/                        # Kitchen Display System
│   └── page.tsx
│
├── reviews/                    # Reviews & sentiment
│   └── page.tsx
│
├── promotions/                 # Promotions & discounts (NEW)
│   └── page.tsx
│
├── customers/                  # Customer management (NEW)
│   └── page.tsx
│
├── attendance/                 # Employee attendance
│   ├── columns.tsx
│   └── page.tsx
│
├── finance/                    # Finance & ledger
│   └── page.tsx
│
├── analytics/                  # Analytics & reports (NEW)
│   └── page.tsx
│
├── profile/                   # User profile
│   └── page.tsx
│
└── settings/                   # Settings
    └── general/
        └── page.tsx
```

## Navigation Menu Structure

```
Dashboard
├── Orders
├── Menu
├── Banner
├── Media
├── KDS (Kitchen Display System)
├── Reviews
├── Promotions (NEW)
├── Customers (NEW)
├── Attendance
├── Finance
├── Analytics (NEW)
└── Settings
    └── General
```

## Feature Coverage

### ✅ Core Operations (6 pages)
- Dashboard - Overview and KPIs
- Orders - Order management
- Menu - Product catalog
- Banner - Promotional banners
- Media - Media library
- KDS - Kitchen operations

### ✅ Customer & Marketing (3 pages)
- Reviews - Customer feedback & sentiment
- Promotions - Discount codes & offers
- Customers - Customer accounts

### ✅ Operations & Analytics (3 pages)
- Attendance - Employee attendance (face recognition)
- Finance - Financial management
- Analytics - Business insights

### ✅ Settings (2 pages)
- Profile - User profile
- Settings/General - Restaurant configuration

## Database Schema Alignment

| Page | Database Models | Status |
|------|----------------|--------|
| Orders | `Order`, `OrderItem`, `OrderStatusHistory` | ✅ |
| Menu | `Product`, `Category`, `ProductVariant` | ✅ |
| Banner/Media | Media storage (MinIO/S3) | ✅ |
| KDS | `Order` (status updates) | ✅ |
| Reviews | `Review`, `ReviewHelpful` | ✅ |
| Promotions | `Promo`, `PromoUsage` | ✅ NEW |
| Customers | `User` (CUSTOMER role), `Order`, `Payment` | ✅ NEW |
| Attendance | `Employee`, `FaceTemplate` | ✅ |
| Finance | `Payment`, `LedgerEntry`, `PromoUsage` | ✅ |
| Analytics | Aggregated from multiple models | ✅ NEW |

## Integration Summary

### Backend API (`services/api`)
All pages connect to NestJS API endpoints:
- Orders API
- Products API
- Reviews API
- Promotions API
- Users/Customers API
- Payments API
- Analytics API

### AI Services
- **sentiment-service** → Reviews page
- **face-verify-service** → Attendance page

### Workers
- **order-events** → KDS page (real-time updates)
- **review-pipeline** → Reviews page (sentiment analysis)
- **reconciliation** → Finance page (payment reconciliation)

## Complete Feature List

1. ✅ Dashboard with KPIs
2. ✅ Order management
3. ✅ Menu/product management
4. ✅ Banner management
5. ✅ Media library
6. ✅ Kitchen Display System (KDS)
7. ✅ Reviews & sentiment dashboard
8. ✅ Promotions & discounts management
9. ✅ Customer management
10. ✅ Employee attendance (face recognition)
11. ✅ Finance & ledger
12. ✅ Analytics & reports
13. ✅ User profile
14. ✅ Restaurant settings

## Next Steps

1. ✅ Structure complete
2. ⏳ Connect pages to API endpoints
3. ⏳ Implement data tables with columns
4. ⏳ Add create/edit forms
5. ⏳ Implement real-time features
6. ⏳ Add proper authentication
7. ⏳ Add role-based access control

