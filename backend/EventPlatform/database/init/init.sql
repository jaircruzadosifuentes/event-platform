USE master;
GO

IF DB_ID('EventServiceDb') IS NULL
BEGIN
    CREATE DATABASE EventServiceDb;
END
GO

IF DB_ID('NotificationServiceDb') IS NULL
BEGIN
    CREATE DATABASE NotificationServiceDb;
END
GO


USE EventServiceDb;
GO

IF OBJECT_ID('dbo.Event', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Event
    (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Event PRIMARY KEY,

        Name NVARCHAR(200) NOT NULL,

        Date DATETIME2 NOT NULL,

        Location NVARCHAR(300) NOT NULL,

        Status INT NOT NULL
            CONSTRAINT DF_Event_Status DEFAULT 0
    );
END
GO


IF OBJECT_ID('dbo.Zones', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Zones
    (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Zone PRIMARY KEY,

        EventId UNIQUEIDENTIFIER NOT NULL,

        Name NVARCHAR(200) NOT NULL,

        Price DECIMAL(18,2) NOT NULL,

        Capacity INT NOT NULL,

        CONSTRAINT FK_Zone_Event
            FOREIGN KEY (EventId)
            REFERENCES dbo.Event(Id)
            ON DELETE CASCADE
    );
END
GO


IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Zone_EventId'
      AND object_id = OBJECT_ID('dbo.Zones')
)
BEGIN
    CREATE INDEX IX_Zone_EventId
        ON dbo.Zones(EventId);
END
GO


USE NotificationServiceDb;
GO

IF OBJECT_ID('dbo.Notification', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notification
    (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Notification PRIMARY KEY,

        MessageId UNIQUEIDENTIFIER NOT NULL,

        EventId UNIQUEIDENTIFIER NOT NULL,

        EventName NVARCHAR(200) NOT NULL,

        OccurredAt DATETIME2 NOT NULL,

        CorrelationId UNIQUEIDENTIFIER NOT NULL,

        PayloadHash NVARCHAR(64) NOT NULL,

        Status INT NOT NULL,

        CreatedAt DATETIME2 NOT NULL
    );
END
GO


IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Notification_MessageId'
      AND object_id = OBJECT_ID('dbo.Notification')
)
BEGIN
    CREATE UNIQUE INDEX IX_Notification_MessageId
        ON dbo.Notification(MessageId);
END
GO