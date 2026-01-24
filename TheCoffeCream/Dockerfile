# Dockerfile for TheCoffeeCream (.NET 8)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY TheCoffeeCream.slnx ./
COPY TheCoffeeCream/TheCoffeeCream.csproj TheCoffeeCream/
COPY TheCoffeeCream.Application/TheCoffeeCream.Application.csproj TheCoffeeCream.Application/
COPY TheCoffeeCream.Domain/TheCoffeeCream.Domain.csproj TheCoffeeCream.Domain/

RUN dotnet restore TheCoffeeCream.slnx

# copy everything else and build
COPY . .
RUN dotnet publish TheCoffeeCream/TheCoffeeCream.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS="http://+:${PORT:-80}"
EXPOSE 80

ENTRYPOINT ["dotnet", "TheCoffeeCream.dll"]
