const pg = require('pg');
var config = require("../config.js");
const connectionString = "postgres://" + config.databaseUser + ":" 
+ config.databasePassword + "@" + config.databaseHost + ":" 
+ config.databasePort + "/" + config.databaseName;

const client = new pg.Client(connectionString);
client.connect();

// Create PWAccount table (an account can have multiple users)
client.query(
	'CREATE TABLE PWAccount(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL)'
);

// Create PWMember table
client.query(
	'CREATE TABLE PWMember(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	email varchar(200))'
);

// Create Company table
client.query(
	'CREATE TABLE Company(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	address varchar(500), \
	details varchar(1500))'
);

// Create Pipeline table
client.query(
	'CREATE TABLE Pipeline(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	stages integer[])' // stages stores PipelineStage id
);

// Create PipelineStage table
client.query(
	'CREATE TABLE PipelineStage(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	pipeline_id integer NOT NULL REFERENCES Pipeline(id), \
	win_probability integer)'
);

// Create priority type
client.query(
	"CREATE TYPE priority_type AS ENUM \
	('None', 'Low', 'Medium', 'High')"
);

// Create status type
client.query(
	"CREATE TYPE status_type AS ENUM \
	('Open', 'Won', 'Lost', 'Abandoned')"
);

// Create LossReason table
client.query(
	'CREATE TABLE LossReason(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL)'
);

// Create Opportunity table
client.query(
	'CREATE TABLE Opportunity(\
	id integer PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	assignee_id integer, \
	company_id integer, \
	company_name varchar(100), \
	details varchar(1000), \
	loss_reason_id integer, \
	monetary_value integer, \
	pipeline_id integer, \
	priority priority_type, \
	pipeline_stage_id integer, \
	status status_type, \
	win_probability integer, \
	date_created timestamp)'
);

// Create parent_resource_type
client.query(
	"CREATE TYPE parent_resource_type AS ENUM \
	('opportunity')"
);

// Create PWAction table
const query = client.query(new pg.Query(
	'CREATE TABLE PWAction(\
	id integer PRIMARY KEY, \
	type varchar(100), \
	parent_resource parent_resource_type, \
	date timestamp, \
	stageBefore integer, \
	stageAfter integer)'
));

query.on('end', () => { client.end(); });
