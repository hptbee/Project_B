# TheCoffeCream Mobile

Monorepo containing two Vite React apps and a shared UI package.

- packages/app-admin — Admin mobile web app (Vite + React)
- packages/app-staff — Staff mobile web app (Vite + React)
- packages/ui-shared — Shared React components/hooks/types

To get started:

```bash
cd mobile
pnpm install   # or npm install
pnpm --filter app-admin dev
pnpm --filter app-staff dev
```
