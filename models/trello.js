const pg = require('pg');
var config = require("../config.js");
const connectionString = "postgres://" + config.databaseUser + ":" 
+ config.databasePassword + "@" + config.databaseHost + ":" 
+ config.databasePort + "/" + config.databaseName;

const client = new pg.Client(connectionString);
client.connect();

// Create Board table
client.query(
	'CREATE TABLE Board(\
	id varchar(25) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	shortURL varchar(40) NOT NULL, \
	memberships text[])'
);

// Create List table
client.query(
	'CREATE TABLE List(\
	id varchar(25) PRIMARY KEY, \
	idBoard varchar(25) NOT NULL REFERENCES Board(id), \
	name varchar(100) NOT NULL, \
	closed boolean DEFAULT false, \
	memberships text[])'
);

// Create Card table
client.query(
	'CREATE TABLE Card(\
	id varchar(25) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	description varchar(1000), \
	due timestamp, \
	dueComplete boolean DEFAULT false, \
	idBoard varchar(25) NOT NULL REFERENCES Board(id), \
	idList varchar(25) NOT NULL REFERENCES List(id), \
	shortURL varchar(40) NOT NULL, \
	closed boolean DEFAULT false, \
	memberships text[])'
);

// Create Checklist table
// client.query(
// 	'CREATE TABLE Checklist(\
// 	id varchar(25) PRIMARY KEY, \
// 	idBoard varchar(25) NOT NULL REFERENCES Board(id), \
// 	idCard varchar(25) NOT NULL REFERENCES Card(id), \
// 	name varchar(100) NOT NULL)'
// );
// Create ChecklistItem table
// client.query(
// 	'CREATE TABLE ChecklistItem(\
// 	id varchar(25) PRIMARY KEY, \
// 	idChecklist varchar(25) NOT NULL REFERENCES Checklist(id), \
// 	name varchar(100) NOT NULL, \
// 	state boolean DEFAULT false)'
// );

// Create Member table
client.query(
	'CREATE TABLE Member(\
	id varchar(25) PRIMARY KEY, \
	name varchar(50), \
	accessToken varchar(100) NOT NULL)'
);

// Store Trello actions
// Create action type
client.query(
	"CREATE TYPE actiontype AS ENUM \
	('updateCard', 'createCard', 'empty')"
);

// relevant card actions:
// then type is one of: updateCard:closed, updateCard:idList, createCard

// Create Action table
const query = client.query(new pg.Query(
	'CREATE TABLE Action(\
	id varchar(25) PRIMARY KEY, \
	idCard varchar(25),\
	date timestamp, \
	type actiontype NOT NULL, \
	createdInList varchar(100), \
	listBefore varchar(100), \
	listAfter varchar(100), \
	closedInList varchar(100), \
	createdInListId varchar(25), \
	listBeforeId varchar(25), \
	listAfterId varchar(25), \
	closedInListId varchar(25), \
	boardBeforeId varchar(25), \
	boardAfterId varchar(25), \
	closed boolean)'
));

query.on('end', () => { client.end(); });
