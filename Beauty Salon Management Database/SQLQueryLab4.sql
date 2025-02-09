IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[FK_TestRunTables_Tables]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestRunTables] DROP CONSTRAINT FK_TestRunTables_Tables
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestTables_Tables]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestTables] DROP CONSTRAINT FK_TestTables_Tables
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestRunTables_TestRuns]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestRunTables] DROP CONSTRAINT FK_TestRunTables_TestRuns
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestRunViews_TestRuns]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestRunViews] DROP CONSTRAINT FK_TestRunViews_TestRuns
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestTables_Tests]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestTables] DROP CONSTRAINT FK_TestTables_Tests
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestViews_Tests]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestViews] DROP CONSTRAINT FK_TestViews_Tests
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestRunViews_Views]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestRunViews] DROP CONSTRAINT FK_TestRunViews_Views
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[FK_TestViews_Views]') and OBJECTPROPERTY(id, N'IsForeignKey') = 1)
ALTER TABLE [TestViews] DROP CONSTRAINT FK_TestViews_Views
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[Tables]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [Tables]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[TestRunTables]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [TestRunTables]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[TestRunViews]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [TestRunViews]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[TestRuns]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [TestRuns]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[TestTables]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [TestTables]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[TestViews]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [TestViews]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[Tests]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [Tests]
GO


if exists (select * from dbo.sysobjects where id = object_id(N'[Views]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [Views]
GO


CREATE TABLE [Tables] (
	[TableID] [int] IDENTITY (1, 1) NOT NULL ,
	[Name] [nvarchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [TestRunTables] (
	[TestRunID] [int] NOT NULL ,
	[TableID] [int] NOT NULL ,
	[StartAt] [datetime] NOT NULL ,
	[EndAt] [datetime] NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [TestRunViews] (
	[TestRunID] [int] NOT NULL ,
	[ViewID] [int] NOT NULL ,
	[StartAt] [datetime] NOT NULL ,
	[EndAt] [datetime] NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [TestRuns] (
	[TestRunID] [int] IDENTITY (1, 1) NOT NULL ,
	[Description] [nvarchar] (2000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL ,
	[StartAt] [datetime] NULL ,
	[EndAt] [datetime] NULL 
) ON [PRIMARY]
GO


CREATE TABLE [TestTables] (
	[TestID] [int] NOT NULL ,
	[TableID] [int] NOT NULL ,
	[NoOfRows] [int] NOT NULL ,
	[Position] [int] NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [TestViews] (
	[TestID] [int] NOT NULL ,
	[ViewID] [int] NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [Tests] (
	[TestID] [int] IDENTITY (1, 1) NOT NULL ,
	[Name] [nvarchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL 
) ON [PRIMARY]
GO


CREATE TABLE [Views] (
	[ViewID] [int] IDENTITY (1, 1) NOT NULL ,
	[Name] [nvarchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL 
) ON [PRIMARY]
GO


ALTER TABLE [Tables] WITH NOCHECK ADD 
	CONSTRAINT [PK_Tables] PRIMARY KEY  CLUSTERED 
	(
		[TableID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestRunTables] WITH NOCHECK ADD 
	CONSTRAINT [PK_TestRunTables] PRIMARY KEY  CLUSTERED 
	(
		[TestRunID],
		[TableID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestRunViews] WITH NOCHECK ADD 
	CONSTRAINT [PK_TestRunViews] PRIMARY KEY  CLUSTERED 
	(
		[TestRunID],
		[ViewID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestRuns] WITH NOCHECK ADD 
	CONSTRAINT [PK_TestRuns] PRIMARY KEY  CLUSTERED 
	(
		[TestRunID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestTables] WITH NOCHECK ADD 
	CONSTRAINT [PK_TestTables] PRIMARY KEY  CLUSTERED 
	(
		[TestID],
		[TableID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestViews] WITH NOCHECK ADD 
	CONSTRAINT [PK_TestViews] PRIMARY KEY  CLUSTERED 
	(
		[TestID],
		[ViewID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [Tests] WITH NOCHECK ADD 
	CONSTRAINT [PK_Tests] PRIMARY KEY  CLUSTERED 
	(
		[TestID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [Views] WITH NOCHECK ADD 
	CONSTRAINT [PK_Views] PRIMARY KEY  CLUSTERED 
	(
		[ViewID]
	)  ON [PRIMARY] 
GO


ALTER TABLE [TestRunTables] ADD 
	CONSTRAINT [FK_TestRunTables_Tables] FOREIGN KEY 
	(
		[TableID]
	) REFERENCES [Tables] (
		[TableID]
	) ON DELETE CASCADE  ON UPDATE CASCADE ,
	CONSTRAINT [FK_TestRunTables_TestRuns] FOREIGN KEY 
	(
		[TestRunID]
	) REFERENCES [TestRuns] (
		[TestRunID]
	) ON DELETE CASCADE  ON UPDATE CASCADE 
GO


ALTER TABLE [TestRunViews] ADD 
	CONSTRAINT [FK_TestRunViews_TestRuns] FOREIGN KEY 
	(
		[TestRunID]
	) REFERENCES [TestRuns] (
		[TestRunID]
	) ON DELETE CASCADE  ON UPDATE CASCADE ,
	CONSTRAINT [FK_TestRunViews_Views] FOREIGN KEY 
	(
		[ViewID]
	) REFERENCES [Views] (
		[ViewID]
	) ON DELETE CASCADE  ON UPDATE CASCADE 
GO


ALTER TABLE [TestTables] ADD 
	CONSTRAINT [FK_TestTables_Tables] FOREIGN KEY 
	(
		[TableID]
	) REFERENCES [Tables] (
		[TableID]
	) ON DELETE CASCADE  ON UPDATE CASCADE ,
	CONSTRAINT [FK_TestTables_Tests] FOREIGN KEY 
	(
		[TestID]
	) REFERENCES [Tests] (
		[TestID]
	) ON DELETE CASCADE  ON UPDATE CASCADE 
GO


ALTER TABLE [TestViews] ADD 
CONSTRAINT [FK_TestViews_Tests] FOREIGN KEY 
	(
		[TestID]
	) REFERENCES [Tests] (
		[TestID]
	),

	CONSTRAINT [FK_TestViews_Views] FOREIGN KEY 
	(
		[ViewID]
	) REFERENCES [Views] (
		[ViewID]
	)
GO





------------------PROCEDURES---------------------------

CREATE TABLE Customer(
	cid INT NOT NULL,
	CONSTRAINT PK_Customer PRIMARY KEY(cid)
);

CREATE TABLE Appointment(
	id INT NOT NULL,
	CONSTRAINT PK_Appointment PRIMARY KEY(id),
	customer_id INT REFERENCES Customer(cid)
);

CREATE TABLE Transactions(
	buyer_id INT NOT NULL,
	service_id INT NOT NULL,
	CONSTRAINT PK_Transactions PRIMARY KEY (buyer_id, service_id)
);

CREATE TABLE Service(
	id INT NOT NULL, 
	CONSTRAINT PK_Services PRIMARY KEY (id)
);

INSERT INTO Service VALUES (1),(2),(3);
GO 
CREATE VIEW ViewCustomer 
AS 
	SELECT * 
	FROM Customer 
GO 

CREATE OR ALTER VIEW ViewAppointment 
AS 
	SELECT Appointment.id
	FROM Appointment INNER JOIN Transactions ON Appointment.id = Transactions.buyer_id
GO

CREATE OR ALTER VIEW ViewTransactions
AS 
	SELECT Transactions.buyer_id
	FROM Transactions INNER JOIN Service ON Service.id = Transactions.service_id
	GROUP BY buyer_id
	
GO

DELETE FROM Tables;
SET IDENTITY_INSERT Tables ON;
INSERT INTO Tables (TableID, Name) 
VALUES (7, 'Customer'), (8, 'Appointment'), (9, 'Transactions');
SET IDENTITY_INSERT Tables OFF;
SELECT * FROM Tables;

DELETE FROM Views 
INSERT INTO Views VALUES ('viewCustomer'),('viewAppointment'),('viewTransactions')

DELETE FROM Tests 
INSERT INTO Tests VALUES('selectView'),('insertCustomer'),('deleteCustomer'),('insertAppointment'),('deleteAppointment'),('insertTransactions'),('deleteTransactions') 

SELECT * FROM Tests
SELECT * FROM Tables 
SELECT * FROM Views

DELETE FROM TestViews
INSERT INTO TestViews VALUES (1,1)
INSERT INTO TestViews VALUES (1,2)
INSERT INTO TestViews VALUES (1,3)

SELECT * FROM TestViews

--(testId, tableId, NoOfRows, Position) 
-- position denotes the order in which they will be executed
-- no of rows= how many to be inserted
DELETE FROM TestTables 
INSERT INTO TestTables VALUES (2, 7, 100, 1)
INSERT INTO TestTables VALUES (4, 8, 100, 2)
INSERT INTO TestTables VALUES (6, 9, 100, 3)

SELECT * FROM TestTables

GO
CREATE OR ALTER PROC insertCustomer 
AS 
	DECLARE @crt INT = 1
	DECLARE @rows INT
	SELECT @rows = NoOfRows FROM TestTables WHERE TestId = 2
	--PRINT (@rows)
	WHILE @crt <= @rows 
	BEGIN 
		INSERT INTO Customer VALUES (@crt + 1)
		SET @crt = @crt + 1 
	END 

GO 
CREATE OR ALTER PROC deleteCustomer 
AS 
	DELETE FROM Customer WHERE cid>1;

GO 
CREATE OR ALTER PROC insertAppointment
AS 
	DECLARE @crt INT = 1
	DECLARE @rows INT
	SELECT @rows = NoOfRows FROM TestTables WHERE TestId = 4
	WHILE @crt <= @rows 
	BEGIN 
		INSERT INTO Appointment VALUES (@crt,1)
		SET @crt = @crt + 1 
	END 

GO 
CREATE OR ALTER PROC deleteAppointment 
AS 
	DELETE FROM Appointment;

GO
CREATE OR ALTER PROC insertTransactions
AS 
	DECLARE @crt INT = 1
	DECLARE @rows INT
	SELECT @rows = NoOfRows FROM TestTables WHERE TestId = 6
	--PRINT (@rows)
	WHILE @crt <= @rows 
	BEGIN 
		INSERT INTO Transactions VALUES (@crt,@crt)
		SET @crt = @crt + 1 
	END 

GO 
CREATE OR ALTER PROC deleteTransactions 
AS 
	DELETE FROM Transactions;

SELECT * FROM Views


GO
CREATE OR ALTER PROC TestRunViewsProc
AS 
	DECLARE @start1 DATETIME;
	DECLARE @start2 DATETIME;
	DECLARE @start3 DATETIME;
	DECLARE @end1 DATETIME;
	DECLARE @end2 DATETIME;
	DECLARE @end3 DATETIME;
	
	SET @start1 = GETDATE();
	PRINT ('executing select * from customer')
	EXEC ('SELECT * FROM ViewCustomer');
	SET @end1 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_view', @start1, @end1)
    INSERT INTO TestRunViews VALUES (@@IDENTITY, 1, @start1, @end1);

	SET @start2 = GETDATE();
	PRINT ('executing select * from appointment')
	EXEC ('SELECT * FROM ViewAppointment');
	SET @end2 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_view2', @start2, @end2)
    INSERT INTO TestRunViews VALUES (@@IDENTITY, 2, @start2, @end2);


	SET @start3 = GETDATE();
	PRINT ('executing select * from transactions')
	EXEC ('SELECT * FROM ViewTransactions');
	SET @end3 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_view3', @start3, @end3)
    INSERT INTO TestRunViews VALUES (@@IDENTITY, 3, @start3, @end3);

GO
CREATE OR ALTER PROC TestRunTablesProc
AS 
	DECLARE @start1 DATETIME;
	DECLARE @start2 DATETIME;
	DECLARE @start3 DATETIME;
	DECLARE @start4 DATETIME;
	DECLARE @start5 DATETIME;
	DECLARE @start6 DATETIME;
	DECLARE @end1 DATETIME;
	DECLARE @end2 DATETIME;
	DECLARE @end3 DATETIME;
	DECLARE @end4 DATETIME;
	DECLARE @end5 DATETIME;
	DECLARE @end6 DATETIME;


	SET @start2 = GETDATE();
	PRINT('deleting data from Customer')
	EXEC deleteCustomer;
	SET @end2 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_delete_customer',@start2, @end2);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 7, @start2, @end2);

	SET @start1 = GETDATE();
	PRINT('inserting data into Customer')
	EXEC insertCustomer;
	SET @end1 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_insert_customer',@start1, @end1);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 7, @start1, @end1);

	SET @start4 = GETDATE();
	PRINT('deleting data from Appointment')
	EXEC deleteAppointment;
	SET @end4 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_delete_appointment',@start4, @end4);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 8, @start4, @end4);

	SET @start3 = GETDATE();
	PRINT('inserting data into Appointment')
	EXEC insertAppointment;
	SET @end3 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_insert_appointment',@start3, @end3);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 8, @start3, @end3);

	SET @start6 = GETDATE();
	PRINT('deleting data from Transactions')
	EXEC deleteTransactions;
	SET @end6 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_delete_transactions',@start6, @end6);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 9, @start6, @end6);

	SET @start5 = GETDATE();
	PRINT('inserting data into Transactions')
	EXEC insertTransactions;
	SET @end5 = GETDATE();
	INSERT INTO TestRuns VALUES ('test_insert_transactions',@start5, @end5);
	INSERT INTO TestRunTables VALUES (@@IDENTITY, 9, @start5, @end5);

	

GO 
EXEC TestRunTablesProc;
EXEC TestRunViewsProc;

SELECT * FROM TestRuns
SELECT * FROM TestRunViews
SELECT * FROM TestRunTables

DELETE FROM Appointment 
--DELETE FROM Customer
DELETE FROM Transactions
--INSERT INTO Customer VALUES (1)

DELETE FROM TestTables 
INSERT INTO TestTables VALUES (2, 7, 100, 1)
INSERT INTO TestTables VALUES (4, 8, 100, 2)
INSERT INTO TestTables VALUES (6, 9, 100, 3)

DELETE FROM TestRunViews
DELETE FROM TestRunTables
DELETE FROM TestRuns

SELECT * FROM Appointment



