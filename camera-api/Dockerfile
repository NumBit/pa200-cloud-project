#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["camera-api.csproj", "camera-api/"]
RUN dotnet restore "camera-api/camera-api.csproj"
COPY . .
WORKDIR "/src/camera-api"
RUN dotnet build "camera-api.csproj" -c Release -o /app/publish

FROM build AS publish
RUN dotnet publish "camera-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "camera-api.dll"]