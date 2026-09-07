using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using NotificationService.Application.Interfaces;

namespace NotificationService.Infraestructure.Email
{
    public class MailKitEmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public MailKitEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEventCreatedAsync(string eventName, Guid eventId, CancellationToken cancellationToken)
        {
            var smtpHost = _configuration["Smtp:Host"] ?? "localhost";

            var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "1025");

            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(
                    "Event Platform",
                    "noreply@eventplatform.local"));

            message.To.Add(
                new MailboxAddress(
                    "Administrador",
                    "admin@eventplatform.local"));

            message.Subject = $"Nuevo evento creado: {eventName}";

            message.Body = new TextPart("plain")
            {
                Text =
                    $"Se ha creado un nuevo evento.\n\n" +
                    $"Evento: {eventName}\n" +
                    $"EventId: {eventId}\n"
            };

            using var client = new SmtpClient();

            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.None, cancellationToken);

            await client.SendAsync(message, cancellationToken);

            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}