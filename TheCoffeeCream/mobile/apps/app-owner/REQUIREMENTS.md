# The Coffee Cream - Owner Portal Requirements

## 1. Introduction
The **Owner Portal** is a high-level administrative application for **Super Admins** (Owners) to manage the entire ecosystem of The Coffee Cream. Unlike the Admin and Staff apps, this application focuses on multi-tenancy management, ensuring the smooth operation of multiple coffee shops.

## 2. Target Audience & Roles
*   **Super Admin**: The exclusive user of this application. Responsible for onboarding new shops, managing subscriptions, and overseeing platform health.
*   **Access Control**: Protected by `authGuard`. Only users with the `Super_Admin` role can access protected routes.

## 3. Functional Requirements

### 3.1 Authentication & Security
*   **Login**: Dedicated login page for Super Admins (`/login`).
*   **Route Guards**: `authGuard` prevents unauthorized access to management pages.
*   **JWT Authentication**: Uses Bearer tokens for API security.

### 3.2 Shop Management
*   **Shop List**: View all registerd shops (`/shops`).
*   **Shop Details**: View detailed information about specific shops.
*   **Lifecycle Management**: Activate or Deactivate shops.
*   **Admin Reset**: Ability to reset passwords for shop admins.

### 3.3 Subscription & Plans
*   **Plan Management**: View and modify available subscription plans (`/plans`).
*   **Purchase Management**: Track and manage subscription purchases (`/purchases`).
*   **Extension**: Ability to extend shop plans.

### 3.4 User Experience & Localization
*   **Visual Style**: Glassmorphism design with Dark/Light theme support.
*   **Feedback**: Comprehensive System feedback (Loading spinners, Toasts) for all CRUD operations.
*   **Timezone**: All timestamp displays and logic should align with **Vietnam Standard Time (GMT+7)** where applicable.


## 4. Technical Requirements

### 4.1 Technology Stack
*   **Framework**: Angular 18
*   **Architecture**: Module-based with some Standalone components.
*   **Mobile Runtime**: Capacitor (Android)
*   **Styling**: SCSS (Glassmorphism design system).
*   **HTTP**: Angular `HttpClient` with Interceptors for token injection.

### 4.2 Application Structure
*   **Feature Modules**:
    *   `Auth`: Login handling.
    *   `Shops`: Shop management logic.
    *   `Plans`: Subscription and purchase logic.
*   **Shared Module**: Reusable guards, services, and components.

### 4.3 Environment
*   **Proxy**: configured via `proxy.conf.json` for local development.

## 5. Build & Deployment
*   **Android Build**: Automated script `build-apk.ps1`.
    *   Command: `npm run build:apk`
    *   Generates timestamped APKs in `mobile/publish/`.
