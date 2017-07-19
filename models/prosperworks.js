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
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL)'
);

// Create PWMember table
client.query(
	'CREATE TABLE PWMember(\
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	email varchar(200))'
);

// Create Company table
client.query(
	'CREATE TABLE Company(\
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	address varchar(500), \
	details varchar(1500))'
);

// Create Pipeline table
client.query(
	'CREATE TABLE Pipeline(\
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	stages text[])' // stages stores PipelineStage id
);

// Create PipelineStage table
client.query(
	'CREATE TABLE PipelineStage(\
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	pipeline_id varchar(50) NOT NULL REFERENCES Pipeline(id), \
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
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL)'
);

// Create Opportunity table
client.query(
	'CREATE TABLE Opportunity(\
	id varchar(50) PRIMARY KEY, \
	name varchar(100) NOT NULL, \
	assignee_id varchar(50) REFERENCES PWMember(id), \
	company_id varchar(50), \
	company_name varchar(100), \
	details varchar(1000), \
	loss_reason_id varchar(50) REFERENCES LossReason(id), \
	monetary_value varchar(50), \
	pipeline_id varchar(50) REFERENCES Pipeline(id), \
	priority priority_type, \
	pipeline_stage_id varchar(50) REFERENCES PipelineStage(id), \
	status status_type, \
	win_probability integer, \
	date_created timestamp)'
);

// Create parent_resource_type
client.query(
	"CREATE TYPE parent_resource_type AS ENUM \
	('opportunity')"
);

// Create pw_action_type
client.query(
	"CREATE TYPE pw_action_type AS ENUM \
	('Stage Change', 'Created', 'Status Change')"
);

// Create PWAction table
const query = client.query(new pg.Query(
	'CREATE TABLE PWAction(\
	id varchar(50) PRIMARY KEY, \
	type pw_action_type, \
	opportunity_id varchar(50), \
	parent_resource parent_resource_type, \
	date timestamp, \
	stageCreated varchar(100), \
	stageBefore varchar(100), \
	stageAfter varchar(100), \
	stageClosed varchar(100), \
	stageCreatedId varchar(50), \
	stageBeforeId varchar(50), \
	stageAfterId varchar(50), \
	stageClosedId varchar(50), \
	closedStatus status_type, \
	closed boolean)'
));

query.on('end', () => { client.end(); });
