# @thecoffeecream/ui-shared

Shared UI components, services, and utilities for The Coffee Cream mobile applications.

## Overview

This package contains common code shared between `app-staff` and `app-admin` to ensure consistency, reduce duplication, and maintain a unified design language across the ecosystem.

## Contents

### Components
- **LoadingSpinner**: Full-screen and inline loading indicators.
- **Icon**: Unified Feather icon wrapper.
- **IconChevron**: Rotatable chevron SVG component.
- **Badge**: Status and label indicators with multiple variants.
- **ConfirmModal**: Standardized glassmorphism confirmation dialogs.
- **Fab**: Floating Action Button component.
- **SearchBar**: Standardized search input with auto-focus support.
- **SideMenu**: Generic, configurable navigation drawer.

### Services
- **API Client** (`apiFetch`): Centralized HTTP client with retry logic, auth token injection, and error handling.
- **Logger**: File-based logging system using Capacitor Filesystem.

### Contexts
- **AuthContext**: Authentication state management (`useAuth`).
- **ThemeContext**: Light/Dark mode management (`useTheme`).
- **UIContext**: Global menu and toast signaling (`useMenu`, `useToast`).

### Styles
- **Variables**: Centralized SCSS variables for colors, spacing, and glassmorphism effects (`src/styles/variables.scss`).

## Usage

Import shared components and services in your app:

```javascript
import { 
    LoadingSpinner, 
    Icon, 
    Badge, 
    SideMenu, 
    useAuth, 
    useTheme, 
    apiFetch 
} from '@thecoffeecream/ui-shared'
```

## Development

This package is consumed directly as source code by Vite. No build step is required during development.

### Structure
```
src/
├── components/
│   ├── layout/SideMenu/
│   └── ui/ (Icon, Badge, ConfirmModal, etc.)
├── contexts/ (Auth, Theme, UI)
├── services/api/
├── styles/variables.scss
└── index.jsx (exports)
```

## Notes

- All exports are **named exports**.
- Consumer apps must support SCSS and CSS Variables.
- Requires `@capacitor/filesystem` for Logger functionality.
