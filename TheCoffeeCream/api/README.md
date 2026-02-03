# ⚙️ The Coffee Cream API

High-performance backend powered by ASP.NET Core 8, implementing Clean Architecture.

## 🏗️ Architecture
- **Web API**: RESTful endpoints with standard DTOs.
- **Domain**: Pure business logic and entities (Product, Order, Category).
- **Infrastructure**: Dapper implementation of Domain repositories.

## 🚀 Running Locally
```bash
cd TheCoffeeCream
dotnet run
```

## 🐳 Docker Build
Run from the repository **root**:
```bash
docker build -t coffee-cream-api -f Dockerfile .
```

## 🌐 Environment Variables


---
Proprietary © 2026 The Coffee Cream
