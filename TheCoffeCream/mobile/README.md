# TheCoffeeCream Mobile

Monorepo containing two Vite React apps and a shared UI package.

- apps/app-admin — Admin mobile web app (Vite + React)
- apps/app-staff — Staff mobile web app (Vite + React)
- apps/ui-shared — Shared React components/hooks/types

To get started:

```bash
cd mobile
pnpm install   # or npm install
pnpm --filter app-admin dev
pnpm --filter app-staff dev
```
