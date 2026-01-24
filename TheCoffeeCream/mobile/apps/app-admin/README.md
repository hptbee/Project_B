# The Coffee Cream - Admin Portal

Web-based administration portal for managing the coffee shop system, orders, and business analytics.

## Features

- 🔐 **Secure Authentication**: Shared login system with the Staff app.
- 📊 **Analytics Dashboard**: Real-time sales metrics (Revenue, Order volume) and a 7-day performance chart.
- 📋 **Order Management**: Comprehensive list view of all transactions with real-time status filtering and search.
- 👥 **Shared UI**: Consistent Design System utilizing the local `@thecoffeecream/ui-shared` library.
- 📱 **Mobile Ready**: Fully responsive and buildable as an Android APK via Capacitor.

## Tech Stack

- **Framework**: React 18 + Vite
- **Mobile**: Capacitor 6 (Android)
- **Routing**: React Router v6
- **Styling**: SCSS + design tokens from shared library.
- **Shared Library**: `@thecoffeecream/ui-shared`

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# Install dependencies (from monorepo root)
npm install

# Setup local environment
cp .env.example .env.local
```

### Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build
```

### Android/APK Build

```bash
# Sync with Capacitor
npx cap sync

# Open in Android Studio
npx cap open android

# Or build APK directly
cd android && ./gradlew assembleDebug
```

## Project Structure

```
src/
├── features/
│   ├── auth/          # Login and session handling
│   ├── dashboard/     # Analytics and metric cards
│   └── orders/        # Order list and filtering logic
├── shared/
│   ├── services/api/  # Dashboard and Order API services
│   └── contexts/      # CoreProvider wrapper
├── App.jsx            # Layout and navigation setup
└── routes.jsx         # Protected route definitions
```

## Shared Library Integration

This application relies on `@thecoffeecream/ui-shared` for:
- Global Theming (Dark/Light mode)
- Global Toast notifications
- All core UI components (Icons, Badges, Modals, Spinners)
- Standardized API Client and Logger

## Development Roadmap

- [x] Authentication system
- [x] Login page with shared design
- [x] Dashboard with analytics
- [x] Order Management (List/Filter)
- [ ] User management (Staff/Roles)
- [ ] Product/Menu management (CRUD)
- [ ] Insights & Exporting reports

## License

Proprietary - The Coffee Cream
