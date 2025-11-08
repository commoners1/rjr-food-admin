# Admin Web Cleanup Guide

## Summary

The admin-web application has been restructured to align with the food ordering project. Old ERP/HR features have been identified for removal.

## ✅ What to Keep (Food Ordering Features)

### Core Pages
1. **`page.tsx`** - Main dashboard
2. **`orders/`** - Order management (NEW - created)
3. **`menu/`** - Menu management
4. **`banner/`** - Banner management
5. **`media/`** - Media library
6. **`kds/`** - Kitchen Display System
7. **`reviews/`** - Reviews & sentiment dashboard
8. **`attendance/`** - Employee attendance (face recognition)
9. **`finance/`** - Finance & ledger
10. **`profile/`** - User profile
11. **`settings/general/`** - Restaurant settings (NEW - created)

### Essential Files
- **`layout.tsx`** - Dashboard layout

## ❌ What to Delete (Old ERP/HR Features)

Run the cleanup script or manually delete these directories:

```powershell
# From project root
.\apps\admin-web\cleanup.ps1
```

Or manually delete:
- `benefits/` - HR benefits
- `division/` - Organizational divisions
- `inventory/` - Old inventory (not food-related)
- `job-order/` - HR job orders
- `leave/` - HR leave management
- `location/` - Old location management
- `master-data/` - HR master data (division, role, overtime-type)
- `medical/` - HR medical records
- `overtime/` - HR overtime
- `reimbursement/` - HR reimbursement
- `salary/` - HR salary
- `timesheet/` - HR timesheet
- `users/` - HR user management
- `workflow/` - HR workflow
- `settings/company-profile/` - Old company profile (replaced with general settings)

## 📋 Final Structure

After cleanup, the structure should be:

```
apps/admin-web/src/app/(dashboard)/
├── page.tsx                    # Dashboard
├── layout.tsx                  # Layout
├── orders/                     # Order management
│   └── page.tsx
├── menu/                       # Menu management
│   └── page.tsx
├── banner/                     # Banner management
│   └── page.tsx
├── media/                      # Media library
│   └── page.tsx
├── kds/                        # Kitchen Display System
│   └── page.tsx
├── reviews/                    # Reviews & sentiment
│   └── page.tsx
├── attendance/                 # Attendance (face recognition)
│   ├── columns.tsx
│   └── page.tsx
├── finance/                    # Finance & ledger
│   └── page.tsx
├── profile/                    # User profile
│   └── page.tsx
└── settings/                   # Settings
    └── general/
        └── page.tsx
```

## 🎯 Alignment with Schema

All kept pages align with the Prisma database schema:

| Page | Database Models | Integration |
|------|----------------|-------------|
| Orders | `Order`, `OrderItem`, `OrderStatusHistory` | Backend API |
| Menu | `Product`, `Category`, `ProductVariant` | Backend API |
| Banner/Media | Media storage | MinIO/S3 |
| KDS | `Order` (status updates) | Workers (order-events) |
| Reviews | `Review`, `ReviewHelpful` | AI (sentiment-service) |
| Attendance | `Employee`, `FaceTemplate` | AI (face-verify-service) |
| Finance | `Payment`, `LedgerEntry`, `PromoUsage` | Workers (reconciliation) |

## 🚀 Next Steps

1. Run cleanup script: `.\apps\admin-web\cleanup.ps1`
2. Verify all old pages are removed
3. Test navigation - all links should work
4. Connect pages to actual API endpoints
5. Implement real-time features (KDS, orders)
6. Add proper data tables with columns

## 📝 Notes

- The `attendance/columns.tsx` file is kept as it may be useful for data tables
- Profile page is kept for admin user management
- Settings updated to restaurant-specific configuration
- Navigation has been updated to reflect new structure

