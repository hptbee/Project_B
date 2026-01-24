# Dockerfile for TheCoffeeCream (.NET 8)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore as distinct layers
# DEBUG: List files to verify context
RUN ls -R

COPY ["api/TheCoffeeCream/TheCoffeeCream.csproj", "api/TheCoffeeCream/"]
COPY ["api/TheCoffeeCream.Application/TheCoffeeCream.Application.csproj", "api/TheCoffeeCream.Application/"]
COPY ["api/TheCoffeeCream.Domain/TheCoffeeCream.Domain.csproj", "api/TheCoffeeCream.Domain/"]

# Restore dependencies
RUN dotnet restore "api/TheCoffeeCream/TheCoffeeCream.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/api/TheCoffeeCream"
RUN dotnet publish "TheCoffeeCream.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS="http://+:${PORT:-80}"
EXPOSE 80

ENTRYPOINT ["dotnet", "TheCoffeeCream.dll"]
