FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["NotificationService.Api/NotificationService.Api.csproj", "NotificationService.Api/"]
COPY ["NotificationService.Application/NotificationService.Application.csproj", "NotificationService.Application/"]
COPY ["NotificationService.Domain/NotificationService.Domain.csproj", "NotificationService.Domain/"]
COPY ["NotificationService.Infraestructure/NotificationService.Infraestructure.csproj", "NotificationService.Infraestructure/"]
COPY ["EventPlataform.Contracts/EventPlataform.Contracts.csproj", "EventPlataform.Contracts/"]

RUN dotnet restore "NotificationService.Api/NotificationService.Api.csproj"

COPY . .

WORKDIR "/src/NotificationService.Api"

RUN dotnet build "NotificationService.Api.csproj" \
    -c Release \
    -o /app/build

FROM build AS publish

RUN dotnet publish "NotificationService.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

EXPOSE 8080

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "NotificationService.Api.dll"]