using MassTransit;
using Microsoft.EntityFrameworkCore;
using NotificationService.Infraestructure.Messaging;
using NotificationService.Infraestructure.Persistence;
using NotificationService.Application.Interfaces;
using NotificationService.Infraestructure.Repositories;
using NotificationService.Infraestructure.Email;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<NotificationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IEmailSender, MailKitEmailSender>();

var rabbitMqHost =
    builder.Configuration["RabbitMq:Host"]
    ?? "localhost";

var rabbitMqUsername =
    builder.Configuration["RabbitMq:Username"]
    ?? "admin";

var rabbitMqPassword =
    builder.Configuration["RabbitMq:Password"]
    ?? "admin";

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EventCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(
            rabbitMqHost,
            "/",
            h =>
            {
                h.Username(rabbitMqUsername);
                h.Password(rabbitMqPassword);
            });

        cfg.UseMessageRetry(retry =>
        {
            retry.Interval(
                3,
                TimeSpan.FromSeconds(5));
        });

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();