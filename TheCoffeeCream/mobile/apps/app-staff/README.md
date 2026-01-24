# The Coffee Cream - Staff App

Mobile application for staff to manage orders, products, and daily operations.

## Features

- 📱 **Order Management**: Create, view, and manage customer orders.
- 🍰 **Product Catalog**: Browse menu with categories and search.
- 🪑 **Table Service**: Dine-in order management with table assignments.
- 💰 **Checkout**: Multiple payment methods (Cash, Transfer, Combined).
- 📊 **Reports**: End-of-day sales reports.
- 🔄 **Offline Support**: Queue orders when offline, auto-sync when online.
- 🎨 **Premium UI**: Dark-mode glassmorphism interface powered by `@thecoffeecream/ui-shared`.

## Tech Stack

- **Framework**: React 18 + Vite
- **Mobile**: Capacitor 6 (Android)
- **Routing**: React Router v6
- **Styling**: SCSS with shared Design System variables
- **State**: Context API + useReducer
- **Shared Library**: `@thecoffeecream/ui-shared` (Core UI, Auth, API, Logger)

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# Install dependencies (from monorepo root)
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API URL
```

### Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build
```

### Mobile Development

```bash
# Sync with Capacitor
npx cap sync

# Build APK (Debug)
cd android && ./gradlew assembleDebug
```

## Project Structure

```
src/
├── features/          # Feature modules (auth, products, orders, cart, etc.)
├── shared/
│   ├── contexts/      # App-specific contexts (Cart, Product)
│   ├── services/      # Offline queue, cache
│   ├── utils/         # Helper functions
│   └── constants/     # App constants
├── styles/            # Local styles and variables
├── App.jsx            # Root component with sync logic
└── routes.jsx         # Route definitions
```

## Internal Architecture

### Unified UI Components
All core atoms (Buttons, Icons, Badges, Modals) and the global navigation (SideMenu) are imported from the shared library to ensure pixel-perfect consistency with the Admin portal.

### Offline-First Logic
Orders are safely stored in localStorage when the network is unstable and automatically synchronized when the device returns online.

### Shared Logic Integration
Authentication handling, centralized API fetching with interceptors, and file-based logging are entirely managed by `@thecoffeecream/ui-shared`.

## Environment Variables

```env
VITE_API_BASE_URL=https://your-api-url.com
```

## License

Proprietary - The Coffee Cream
