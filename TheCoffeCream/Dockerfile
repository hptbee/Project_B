# Dockerfile for TheCoffeeCream (.NET 8)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy everything into the build context and restore
COPY . .
RUN dotnet restore TheCoffeeCream.slnx

# publish
RUN dotnet publish TheCoffeeCream/TheCoffeeCream.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS="http://+:${PORT:-80}"
EXPOSE 80

ENTRYPOINT ["dotnet", "TheCoffeeCream.dll"]
