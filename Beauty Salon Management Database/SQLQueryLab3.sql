use [BeautySalon]
-- a. modify the type of a column
-- modify the type of the phone column in the clients table from VARCHAR(50) to VARCHAR(20)
CREATE OR ALTER PROCEDURE modifyClientsPhoneType AS
BEGIN
	ALTER TABLE clients
	ALTER COLUMN phone VARCHAR(20);
	SELECT 'Modified column phone in clients table to VARCHAR(20)'
END;
GO 
EXECUTE modifyClientsPhoneType;
GO


CREATE OR ALTER PROCEDURE revertClientsPhoneType AS
BEGIN
    ALTER TABLE clients 
    ALTER COLUMN phone VARCHAR(50);
    SELECT 'Reverted column phone in clients table to VARCHAR(50)'
END;
GO
EXECUTE revertClientsPhoneType;
GO


-- b. add / remove a column
-- add preferred_stylist column to clients table
CREATE OR ALTER PROCEDURE addPreferredStylist AS
BEGIN
	ALTER TABLE clients
	ADD preferred_stylist INT NULL;
	SELECT 'Added preferred_stylist column to clients table'
END;
GO
EXECUTE addPreferredStylist;
GO


CREATE OR ALTER PROCEDURE removePreferredStylist AS
BEGIN
	ALTER TABLE clients
	DROP COLUMN preferred_stylist;
	SELECT 'Removed preferred_stylist column from clients table'
END;
GO
EXECUTE removePreferredStylist;
GO


-- c. add / remove a DEFAULT constraint
-- add default constraint for status column in appointments table
CREATE OR ALTER PROCEDURE addDefaultStatusToAppointments AS
BEGIN
	ALTER TABLE appointments
	ADD CONSTRAINT default_status DEFAULT 'Scheduled' FOR status;
	SELECT 'Added a default constraint for status column in appointments table'
END;
GO
EXECUTE addDefaultStatusToAppointments;
GO


CREATE OR ALTER PROCEDURE removeDefaultStatusFromAppointments AS
BEGIN
	ALTER TABLE appointments
	DROP CONSTRAINT default_status;
	SELECT 'Removed a default constraint for status column in appointments table'
END;
GO
EXECUTE removeDefaultStatusFromAppointments;
GO


-- d. add / remove a primary key
-- add a primary key for awards table
CREATE OR ALTER PROCEDURE addAwardsPrimaryKey AS
    CREATE TABLE awards
	(
        award_id int NOT NULL,
        name varchar(50),
        edition int NOT NULL,
		stylist_id int FOREIGN KEY REFERENCES stylists(stylist_id)
	)
    ALTER TABLE awards
        ADD CONSTRAINT awards_primary_key PRIMARY KEY(award_id)
    SELECT 'Added primary key award_id to awards.'
GO
EXECUTE addAwardsPrimaryKey;
GO


CREATE OR ALTER PROCEDURE removeAwardsPrimaryKey AS
    ALTER TABLE awards
        DROP CONSTRAINT awards_primary_key
    DROP TABLE awards
    SELECT 'Removed primary key award_id from awards.'
GO 
EXECUTE removeAwardsPrimaryKey;
GO


-- e. add / remove a candidate key
-- add a candidate key on first_name, last_name in clients table
CREATE OR ALTER PROCEDURE addCandidateKeyToClients AS
BEGIN
	ALTER TABLE clients
	ADD CONSTRAINT unique_name UNIQUE (first_name, last_name);
	SELECT 'Added a candidate key on first_name, last_name in clients table'
END;
GO
EXECUTE addCandidateKeyToClients;
GO


CREATE OR ALTER PROCEDURE removeCandidateKeyFromClients AS
BEGIN
	ALTER TABLE clients
	DROP CONSTRAINT unique_name;
	SELECT 'Removed a candidate key on first_name, last_name in clients table'
END;
GO
EXECUTE removeCandidateKeyFromClients;
GO


-- f. add / remove a foreign key
-- add a foreign key from appointments to stylists table
CREATE OR ALTER PROCEDURE addForeignKeyToAppointments AS
BEGIN
	ALTER TABLE appointments
	ADD CONSTRAINT fk_stylist_id FOREIGN KEY (stylist_id) REFERENCES stylists (stylist_id);
	SELECT 'Added a foreign key from appointments to stylists table'
END;
GO
EXECUTE addForeignKeyToAppointments;
GO


CREATE OR ALTER PROCEDURE removeForeignKeyFromAppointments AS
BEGIN
	ALTER TABLE appointments
	DROP CONSTRAINT fk_stylist_id;
	SELECT 'Removed a foreign key from appointments to stylists table'
END;
GO
EXECUTE removeForeignKeyFromAppointments
GO


-- g. create / drop a table
-- create client_feedback table
CREATE OR ALTER PROCEDURE createClientFeedbackTable AS
BEGIN
	CREATE TABLE client_feedback (
		feedback_id INT PRIMARY KEY,
		client_id INT,
		feedback TEXT,
		rating INT CHECK (rating BETWEEN 1 AND 5),
		feedback_date DATE,
		FOREIGN KEY (client_id) REFERENCES clients(client_id)
	);
	SELECT 'Created client_feedback table'
END;
GO
EXECUTE createClientFeedbackTable;
GO


CREATE OR ALTER PROCEDURE dropClientFeedbackTable AS
BEGIN
    DROP TABLE IF EXISTS client_feedback;
    SELECT 'Dropped client_feedback table'
END;
GO
EXECUTE dropClientFeedbackTable;
GO

DROP TABLE VersionTable
-- version table setup
CREATE TABLE VersionTable (
    Version INT
);
INSERT INTO VersionTable VALUES (1);

DROP TABLE ProcedureTable
CREATE TABLE ProcedureTable (
    FirstVersion INT,
    LastVersion INT,
    ProcedureName VARCHAR(MAX),
    PRIMARY KEY(FirstVersion, LastVersion)
);
INSERT INTO ProcedureTable VALUES 
    (1, 2, 'modifyClientsPhoneType'),
    (2, 1, 'revertClientsPhoneType'),
    (2, 3, 'addPreferredStylist'),
    (3, 2, 'removePreferredStylist'),
    (3, 4, 'addDefaultStatusToAppointments'),
    (4, 3, 'removeDefaultStatusFromAppointments'),
    (4, 5, 'addAwardsPrimaryKey'),
    (5, 4, 'removeAwardsPrimaryKey'),
    (5, 6, 'addCandidateKeyToClients'),
    (6, 5, 'removeCandidateKeyFromClients'),
    (6, 7, 'addForeignKeyToAppointments'),
    (7, 6, 'removeForeignKeyFromAppointments'),
    (7, 8, 'createClientFeedbackTable'),
    (8, 7, 'dropClientFeedbackTable');
GO


-- versioning procedure
CREATE OR ALTER PROCEDURE restoreVersion(@version INT) AS
BEGIN
    DECLARE @currentVersion INT;
    DECLARE @procedureName VARCHAR(MAX);
    SELECT @currentVersion = Version FROM VersionTable;
	IF @version > (SELECT MAX(firstVersion) FROM ProcedureTable)
        RAISERROR('Invalid version.', 10, 1);
    WHILE @currentVersion > @version BEGIN
        SELECT @procedureName = ProcedureName 
        FROM ProcedureTable WHERE FirstVersion = @currentVersion AND LastVersion = @currentVersion - 1;
        PRINT('Executing ' + @procedureName);
        EXEC (@procedureName);
        SET @currentVersion = @currentVersion - 1;
    END;
    WHILE @currentVersion < @version BEGIN
        SELECT @procedureName = ProcedureName 
        FROM ProcedureTable WHERE FirstVersion = @currentVersion AND LastVersion = @currentVersion + 1;
        PRINT('Executing ' + @procedureName);
        EXEC (@procedureName);
        SET @currentVersion = @currentVersion + 1;
    END;
    UPDATE VersionTable SET Version = @version;
    RETURN;
END;
GO
EXECUTE restoreVersion 8;
GO
