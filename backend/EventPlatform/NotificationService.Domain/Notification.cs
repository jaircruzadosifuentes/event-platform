using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Domain
{
    public class Notification
    {
        public Guid Id { get; private set; }

        public Guid MessageId { get; private set; }

        public Guid EventId { get; private set; }

        public string EventName { get; private set; } = string.Empty;

        public DateTime OccurredAt { get; private set; }

        public Guid CorrelationId { get; private set; }

        public string PayloadHash { get; private set; } = string.Empty;

        public NotificationStatus Status { get; private set; }

        public DateTime CreatedAt { get; private set; }

        private Notification()
        {
        }
        public Notification(
            Guid id,
            Guid messageId,
            Guid eventId,
            string eventName,
            DateTime occurredAt,
            Guid correlationId,
            string payloadHash)
        {
            Id = id;
            MessageId = messageId;
            EventId = eventId;
            EventName = eventName;
            OccurredAt = occurredAt;
            CorrelationId = correlationId;
            PayloadHash = payloadHash;
            Status = NotificationStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        public void MarkAsSent()
        {
            Status = NotificationStatus.Sent;
        }
        public void MarkAsFailed()
        {
            Status = NotificationStatus.Failed;
        }
    }
}
