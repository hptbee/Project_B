# 📋 The Coffee Cream - Product Requirements Document

## 1. Product Vision
A premium, end-to-end multi-tenant coffee shop management system giving shop owners powerful tools to run their stores offline-first, while giving Super Admins the ability to easily onboard and manage shop subscriptions at scale.

## 2. System Architecture
- **Backend Infrastructure**:
  - **Framework**: .NET Core 8 Web API
  - **Architecture**: Domain-Driven Design (DDD) & Clean Architecture
  - **Database**: SQL Server (MSSQL) using Entity Framework Core ORM
- **Frontend Suites**:
  - **Shop Operations (Admin/Staff)**: React 18, Vite, and Capacitor (Cross-platform WebView / Android APK)
  - **Shared Kit**: `@thecoffeecream/ui-shared` (UI Tokens, API clients, Offline capabilities)
  - **Owner Portal**: Standalone Angular 18 Web Application

## 3. User Roles
1. **Super Admin (Owner)**: Managed via the `app-owner` portal. Controls shop subscriptions, onboarding, and platform-level administration.
2. **Shop Admin**: Managed via `app-admin`. Monitors their shop's health, views revenue and product reports, manages staff orders. 
3. **Staff (Cashier/Server)**: Managed via `app-staff`. Performs point-of-sale activities, table management, order splitting, and checkouts.

## 4. Sub-Application Core Features

### 4.1. Staff App (`app-staff`)
*👉 [View Detailed Product Requirements](./mobile/apps/app-staff/REQUIREMENTS.md)*
- **Offline-First Resilience**: Order taking and caching (`OfflineQueue`) continue to function without internet latency. 
- **Point of Sale (POS)**: Core checkout flow supporting Cash and Transfer methods.
- **Table Management**: Real-time table states (Empty, Occupied, Ordered).
- **Cart & Split Payments**: Dynamic management of the active cart items.

### 4.2. Admin Dashboard (`app-admin`)
*👉 [View Detailed Product Requirements](./mobile/apps/app-admin/REQUIREMENTS.md)*
- **Business Intelligence**: Rich analytics covering Sales Trends and best selling products via `reportsApi`.
- **Order Overrides**: Ability to review, track, and update the status of active and historical orders.
- **Data Visualization**: Date range filtering for granular insights.

### 4.3. Owner Portal (`app-owner`)
*👉 [View Detailed Product Requirements](./mobile/apps/app-owner/REQUIREMENTS.md)*
- **Tenant Onboarding**: Register new shop instances and their respective admin accounts.
- **Subscription Engine**: Manage active plans (Trial, Basic, Premium) and exact expiry lengths.
- **Security Control**: Remotely enable/disable shops or reset credentials.

## 5. Non-Functional Requirements
- **Design System Excellence**: Dark-mode primary interfaces utilizing premium Glassmorphism traits.
- **Build Targets**: Fully deployable via Docker (`docker-compose.yml`), natively exported to Android APKs via Capacitor/Gradle (`build-apk.ps1`).
- **Performance**: High throughput operations via Entity Framework Core on the backend and local in-memory caching mechanisms.
