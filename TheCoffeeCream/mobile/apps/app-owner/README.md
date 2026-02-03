# The Coffee Cream - Owner Portal (`app-owner`)

This is a dedicated web application for Super Admins (Owners) of **The Coffee Cream** ecosystem. It is built with **Angular 18** and features a modern, glassmorphism-inspired design system.

## 🚀 Purpose
The Owner Portal centralizes the management of all coffee shops in the network. It allows Super Admins to oversee shop registrations, manage subscriptions, and ensure operational health across the platform.

## ✨ Key Features
- **Shop Management Dashboard**: Real-time overview of all registered shops and their current statuses.
- **Detailed Shop Insights**: Click on any shop row to view comprehensive details including plan info, contact data, and address.
- **Onboarding**: Register new shop codes with their initial admin accounts.
- **Subscription Management**: Extend shop plans by specific durations directly from the portal.
- **Security Control**:
    - Toggle shop activation status (Activate/Deactivate).
    - Remote reset of shop admin passwords.
- **Role-Based Access**: Protected by robust authentication guards strictly for `Super_Admin` accounts.

## 🛠 Technology Stack
- **Framework**: Angular 18 (Module-based with Standalone components for pages)
- **Styling**: Vanilla SCSS with a custom Glassmorphism design system.
- **Communication**: RESTful API integration with JWT Bearer Authentication.
- **Dev Tools**: Pre-configured `proxy.conf.json` for seamless local development with the .NET backend.

## 🏁 Getting Started

### Prerequisites
- Node.js (v20.12.2 or higher)
- Angular CLI (`npm i -g @angular/cli@18`)

### Installation
```bash
# Navigate to the project directory
cd mobile/apps/app-owner

# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm start
```
The application will be available at `http://localhost:4200/`.

## 🏗 Android Build (Automated)
```bash
# Build and export the Android APK
npm run build:apk
```
*Auto-builds, syncs, compiles, and exports timestamped APK to `mobile/publish/` folder.*
*Output: `app-owner-debug-YYYYMMDD_HHMM.apk`*

## 🏗 Project Structure
- `src/app/pages`: Main view components (Login, Shop Management).
- `src/app/services`: Core logic for API interaction and Authentication.
- `src/app/guards`: Route protection logic.
- `src/app/interceptors`: HTTP request enrichment (Auth tokens).
- `src/styles.scss`: Global design system tokens and glassmorphism utilities.

---
© 2026 The Coffee Cream. All rights reserved.
