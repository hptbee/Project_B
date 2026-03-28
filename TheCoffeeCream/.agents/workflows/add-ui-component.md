---
description: Standardized way to scaffold React Components for the Frontend (TheCoffeeCream)
---

# Adding a new React UI Component

Whenever creating new user interface components in `app-staff`, `app-admin`, or the cross-platform `ui-shared` framework, adhere to these strict sequential steps.

## Step 1: Boilerplate Generation
1. Formulate a pure functional standard React 18 component using standard `export default function ComponentName()` syntax.
2. Initialize an adjacent `.scss` file for styling containing scoped properties.

## Step 2: Utilize the Single Source of Truth (`ui-shared`)
Never try to recreate buttons, complex cards, or primitives randomly. ALWAYS pull primitive elements from `@thecoffeecream/ui-shared`.
```jsx
// Correct
import { Icon, Button, Badge } from '@thecoffeecream/ui-shared';
```

## Step 3: Global SCSS Styling (Glassmorphism)
1. In your scoped `.scss` file, start by evaluating whether a global Glassmorphism variable will suit your needs. Do not hardcode `#FFFFFF` or raw opacities if variables like `$color-glass-primary` or `$shadow-glass-blur` exist.
2. Ensure you import global variables cleanly. E.g., `@import '../../../ui-shared/styles/variables.scss';`

## Step 4: Validate Data Needs
1. If the component requires fetching data upon layout, DO NOT use native `fetch`.
2. Connect cleanly to the existing Service Hooks provided by the `ui-shared` library (For instance, `import { productsApi } from '@thecoffeecream/ui-shared/services/productsApi';`).

## Step 5: Test via Desktop Browser
Remind the user to load `http://localhost:4000` (Admin) or `http://localhost:4001` (Staff) to ensure the component behaves normally within the scoped interface. Evaluate mobile responsibilities as well (using Chrome dev tools / Capacitor outputs).
