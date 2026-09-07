using EventPlataform.Contracts;
using MassTransit;
using NotificationService.Application.Interfaces;
using NotificationService.Domain;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace NotificationService.Infraestructure.Messaging
{
    public class EventCreatedConsumer : IConsumer<EventCreated>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IEmailSender _emailSender;

        public EventCreatedConsumer(INotificationRepository notificationRepository, IEmailSender emailSender)
        {
            _notificationRepository = notificationRepository;
            _emailSender = emailSender;
        }

        public async Task Consume(ConsumeContext<EventCreated> context)
        {
            var message = context.Message;

            Console.WriteLine("======================================");
            Console.WriteLine("EVENTO RECIBIDO DESDE RABBITMQ");
            Console.WriteLine($"MessageId: {message.MessageId}");
            Console.WriteLine($"EventId: {message.EventId}");
            Console.WriteLine($"Name: {message.Name}");
            Console.WriteLine($"OccurredAt: {message.OccurredAt}");
            Console.WriteLine($"CorrelationId: {message.CorrelationId}");
            Console.WriteLine($"Version: {message.Version}");

            var notification = await _notificationRepository.GetByMessageIdAsync(message.MessageId, context.CancellationToken);

            if (notification != null && notification.Status == NotificationStatus.Sent)
            {
                Console.WriteLine($"Mensaje ya procesado correctamente. " + $"MessageId: {message.MessageId}");
                Console.WriteLine("El mensaje será ignorado.");
                Console.WriteLine("======================================");
                return;
            }

            // Si existe Pending o Failed, continuamos con el procesamiento
            if (notification != null)
            {
                Console.WriteLine($"Notificación existente encontrada. " + $"Status: {notification.Status}");
                Console.WriteLine("Se continuará con el procesamiento.");
            }

            if (notification == null)
            {
                var payload = JsonSerializer.Serialize(message);

                var payloadHash = CalculateSha256(payload);

                notification = new Notification(
                    Guid.NewGuid(),
                    message.MessageId,
                    message.EventId,
                    message.Name,
                    message.OccurredAt,
                    message.CorrelationId,
                    payloadHash);

                await _notificationRepository.AddAsync(notification, context.CancellationToken);
                await _notificationRepository.SaveChangesAsync(context.CancellationToken);

                Console.WriteLine($"Notificación creada: {notification.Id}");
            }

            try
            {
                await _emailSender.SendEventCreatedAsync(message.Name, message.EventId, context.CancellationToken);
                notification.MarkAsSent();
                await _notificationRepository.SaveChangesAsync(context.CancellationToken);

                Console.WriteLine($"Correo enviado correctamente para: " + $"{message.Name}");
            }
            catch
            {
                notification.MarkAsFailed();
                await _notificationRepository.SaveChangesAsync(context.CancellationToken);
                Console.WriteLine($"Error enviando correo para: " + $"{message.Name}");

                throw;
            }

            Console.WriteLine("======================================");
        }

        private static string CalculateSha256(string value)
        {
            var bytes = Encoding.UTF8.GetBytes(value);
            var hash = SHA256.HashData(bytes);
            return Convert.ToHexString(hash);
        }
    }
}