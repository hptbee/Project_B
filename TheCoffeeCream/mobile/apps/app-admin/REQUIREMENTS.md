# The Coffee Cream - Admin App Requirements

## 1. Introduction
The **Admin App** is a centralized dashboard designed for shop managers to oversee business operations. It focuses on analytics, order management, and administrative tasks.

## 2. Target Audience & Roles
*   **Admin**: Primary users. Shop managers who need access to sales data, order history, and product settings.
*   **Access Control**: Constrained by `ProtectedRoute`. Only users with the `Admin` role can access the application. Invalid attempts redirect to Login or show an Access Denied modal.

## 3. Functional Requirements

### 3.1 Authentication & Security
*   **Login**: Secure login interface (`/login`).
*   **Registration**: Account creation for new admins (`/register`).
*   **Email Verification**: Verify email address (`/verify-email`).
*   **Role Guard**: strict role-based access control checking for 'Admin' role.

### 3.2 Dashboard & Analytics
*   **Insights**: Homepage (`/`) providing real-time business health metrics using `dashboardApi`.
    *   Sales trends.
    *   Revenue tracking.

### 3.3 Core Management Features
*   **Order Management**: View and manage all store orders (`/orders`).
*   **Product Management**: Manage product catalog, prices, and availability (`/products`).
*   **User Management**: View and manage system users (`/users`).
    *   **Staff Limit**: Maximum of **5 Active Staff** accounts per shop. Creating or activating more requires disabling existing ones.
### 3.4 User Interface & UX
*   **Theme & Language**: universal toggles for Dark/Light mode and Language selection (Login, Register, and Sidebar).
*   **Visual Feedback**:
    *   **Loading States**: Interactive elements display spinners during async operations.
    *   **Toasts**: Actionable toast notifications for system events (Success/Error).

### 3.5 Localization
*   **Timezone**: Application logic, specifically Analytics and Order filtering, must strictly adhere to **Vietnam Standard Time (GMT+7)** to ensure accurate daily reporting.


## 4. Technical Requirements

### 4.1 Technology Stack
*   **Frontend**: React 18
*   **Build Tool**: Vite
*   **Mobile Runtime**: Capacitor (Android)
*   **Routing**: React Router DOM v6
*   **Styling**: SCSS (Sass)

### 4.2 Architecture
*   **Layered Architecture**: Uses `ui-shared` for core logic and UI components.
*   **Lazy Loading**: Route components (`Insights`, `OrderList`, etc.) are lazy-loaded for performance.
*   **Context API**: `CoreProvider` provides global state management.
*   **Layout**: Wrapped in `MainLayout` for consistent navigation and structure.

### 4.3 Environment
*   Configuration via `.env` files.

## 5. Build & Deployment
*   **Android Build**: Automated script `build-apk.ps1`.
    *   Command: `npm run build:apk`
    *   Generates timestamped APKs in `mobile/publish/`.
