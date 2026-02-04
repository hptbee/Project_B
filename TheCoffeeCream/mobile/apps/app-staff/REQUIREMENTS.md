# The Coffee Cream - Staff App Requirements

## 1. Introduction
The **Staff App** is a mobile-first Point of Sale (POS) and order management application designed for the waitstaff of **The Coffee Cream**. It enables efficient table management, order taking, and payment processing directly from mobile devices.

## 2. Target Audience & Roles
*   **Staff (Waiters)**: Primary users. Responsible for taking orders, checking operational status, and processing payments.
*   **Admin**: Has full access to the staff application for oversight and management.
*   **Access Control**: Constrained by `ProtectedRoute`. Only users with `Admin` or `Staff` roles can access the application. Invalid attempts redirect to Login or show an Access Denied modal.

## 3. Functional Requirements

### 3.1 Authentication & Security
*   **Login**: secure login interface supporting username/password.
*   **Role Guard**: Restricts access to authorized roles only.
*   **Token Management**: Uses `auth_token` for session management.

### 3.2 Table Management
*   **Table List**: Visual representation of restaurant tables (Root path `/`).
*   **Table Status**: Indicators for table availability (e.g., Occupied, Vacant).
*   **Table Selection**: Select a table to initiate an order or view current status (`/table/:tableId`).

### 3.3 Order Management
*   **Product Catalog**: Browse and search products (`/products`).
*   **Product Details**: View product variants, options, and prices (`/products/:id`).
*   **Cart System**: Add items to cart, modify quantities, and review order before submission (`/cart`).
*   **Checkout**: Process payments for a specific table (`/checkout/:tableId`). Supports multiple payment methods (Cash, Transfer) and potentially split payments.
*   **Order History**: View past orders and their details (`/orders`, `/orders/:id`).

### 3.4 Operational Features
*   **Offline Mode**:
    *   **Offline Queue**: Orders taken while offline are queued locally using `OfflineQueue`.
    *   **Auto-Sync**: Background process syncs queued orders when connectivity is restored.
    *   **Data Sync**: Manual sync option for menus and settings (`/sync`).
*   **Kitchen Integration**: View kitchen notifications (`/kitchen`).
*   **Payment Requests**: Handle payment requests from customers (`/requests`).

### 3.5 Reporting
*   **End of Day Report**: Generate daily sales reports (`/report`).
*   **Receipts**: View and print receipts (`/receipts`).

### 3.6 Settings & Support
*   **Settings**: General app configuration (`/settings`).
*   **Theme & Language**:
    *   **Theme Toggle**: Switch between Dark and Light modes (Default: Dark).
    *   **Language Toggle**: Switch between supported languages.
    *   *Note*: Toggles are accessible via Login page, Register page, and Main Menu.
*   **Help & Support**: Access help documentation and support channels (`/help`, `/support`).
*   **Terms**: View terms of service (`/terms`).

### 3.7 System Behaviors (Non-Functional)
*   **Locality**: All dates and time comparisons MUST respect **Vietnam Standard Time (GMT+7)**.
*   **User Feedback**:
    *   **Loading States**: All async actions (Login, Save, Delete) typically show a loading spinner on the button or a full-page overlay.
    *   **Notifications**: Success/Error actions trigger a Toast notification (from `@thecoffeecream/ui-shared`).


## 4. Technical Requirements

### 4.1 Technology Stack
*   **Frontend**: React 18
*   **Build Tool**: Vite
*   **Mobile Runtime**: Capacitor (Android)
*   **Routing**: React Router DOM v6
*   **Styling**: SCSS (Sass)

### 4.2 Architecture
*   **Shared Library**: Heavily relies on `@thecoffeecream/ui-shared` for:
    *   UI Components (Modals, Toasts)
    *   Contexts (Auth, CoreProvider)
    *   Utilities (Logger, OfflineQueue)
*   **Context API**: `CoreProvider` wraps the app to provide global state.
*   **Navigation**: `SideMenu` for main navigation, integrated with hardware back button support on Android.

### 4.3 Environment
*   Configuration via `.env` files (e.g., `.env.local`, `.env.production`).

## 5. Build & Deployment
*   **Android Build**: Automated script `build-apk.ps1` to build web assets, sync with Capacitor, and generate an APK.
    *   Command: `npm run build:apk`

## 6. Future Considerations (To Be Defined)
*   Real-time websocket updates for order status changes?
*   Print integration for physical receipts?
