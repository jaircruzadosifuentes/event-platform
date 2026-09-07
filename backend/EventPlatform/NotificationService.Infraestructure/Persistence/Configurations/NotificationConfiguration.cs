using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NotificationService.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Infraestructure.Persistence.Configurations
{
   
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notification");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.EventName)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(x => x.PayloadHash)
                .HasMaxLength(128)
                .IsRequired();

            builder.Property(x => x.Status)
                .IsRequired();

            builder.Property(x => x.OccurredAt)
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                .IsRequired();

            // Idempotencia
            builder.HasIndex(x => x.MessageId)
                .IsUnique();
        }
    }
}
