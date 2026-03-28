# ⚙️ The Coffee Cream API

High-performance backend powered by ASP.NET Core 8, implementing Clean Architecture.

## 🏗️ Architecture
- **Web API**: RESTful endpoints with standard DTOs.
- **Domain**: Pure business logic and entities (Product, Order, Category, User, Plan).
- **Infrastructure**: Entity Framework Core integration with SQL Server for high-performance data access.

## 🗄️ Database Initialization
The API relies on a SQL Server instance (provisioned via `docker-compose.yml` at the root). 
To initialize schemas and seed starter data, execute the script located at:
`init_db.sql` on your SQL Server instance.

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
