FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["EventService.Api/EventService.Api.csproj", "EventService.Api/"]
COPY ["EventService.Application/EventService.Application.csproj", "EventService.Application/"]
COPY ["EventService.Domain/EventService.Domain.csproj", "EventService.Domain/"]
COPY ["EventService.Infraestructure/EventService.Infraestructure.csproj", "EventService.Infraestructure/"]
COPY ["EventPlataform.Contracts/EventPlataform.Contracts.csproj", "EventPlataform.Contracts/"]

RUN dotnet restore "EventService.Api/EventService.Api.csproj"

COPY . .

WORKDIR "/src/EventService.Api"

RUN dotnet build "EventService.Api.csproj" \
    -c Release \
    -o /app/build

FROM build AS publish

RUN dotnet publish "EventService.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

EXPOSE 8080

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "EventService.Api.dll"]