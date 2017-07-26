const pg = require('pg');
var config = require("../config.js");
const connectionString = "postgres://" + config.databaseUser + ":" 
+ config.databasePassword + "@" + config.databaseHost + ":" 
+ config.databasePort + "/" + config.databaseName;

const client = new pg.Client(connectionString);
client.connect();

// PWAccount
client.query("INSERT INTO PWAccount VALUES ('account1', 'account1')");

// PWMember
client.query("INSERT INTO PWMember VALUES ('member1', 'member1', \
	'member1@member1.com')");

// Company
client.query("INSERT INTO Company VALUES ('company1', 'company1', \
	'address of company', 'details of company')");

// Pipeline
client.query("INSERT INTO Pipeline VALUES ('pipeline1', 'pipeline1', \
	'{ps1, ps2, ps3}')");

// Pipline Stages
// ps1
client.query("INSERT INTO PipelineStage VALUES ('ps1', 'ps1', 'pipeline1', \
	'10')");
// ps2
client.query("INSERT INTO PipelineStage VALUES ('ps2', 'ps2', 'pipeline1', \
	'10')");
// ps3
client.query("INSERT INTO PipelineStage VALUES ('ps3', 'ps3', 'pipeline1', \
	'10')");

// SELECT TIME FRAME: 2017-07-05 to 2017-07-25

// Opportunities
// ps1
// oid1
client.query("INSERT INTO Opportunity VALUES ('oid1', 'oid1', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Abandoned', 10, '2017-07-01 00:00:00')");
// oid2
client.query("INSERT INTO Opportunity VALUES ('oid2', 'oid2', 'member1', \
	'company1', 'company1', 'opportunity details', null, 15000, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-07-06 00:00:00')");
// oid3
client.query("INSERT INTO Opportunity VALUES ('oid3', 'oid3', 'member1', \
	'company1', 'company1', 'opportunity details', null, 12000, 'pipeline1', \
	'None', 'ps1', 'Won', 10, '2017-07-06 00:00:00')");
// oid4
client.query("INSERT INTO Opportunity VALUES ('oid4', 'oid4', 'member1', \
	'company1', 'company1', 'opportunity details', null, 22000, 'pipeline1', \
	'None', 'ps1', 'Lost', 10, '2017-07-06 00:00:00')");
// ps2
// oid5
client.query("INSERT INTO Opportunity VALUES ('oid5', 'oid5', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps2', 'Open', 10, '2017-07-06 00:00:00')");
// oid6
client.query("INSERT INTO Opportunity VALUES ('oid6', 'oid6', 'member1', \
	'company1', 'company1', 'opportunity details', null, 1000, 'pipeline1', \
	'None', 'ps2', 'Won', 10, '2017-07-06 00:00:00')");
// oid7
client.query("INSERT INTO Opportunity VALUES ('oid7', 'oid7', 'member1', \
	'company1', 'company1', 'opportunity details', null, 30000, 'pipeline1', \
	'None', 'ps2', 'Open', 10, '2017-07-06 00:00:00')");
// ps3
// oid8
client.query("INSERT INTO Opportunity VALUES ('oid8', 'oid8', 'member1', \
	'company1', 'company1', 'opportunity details', null, 40000, 'pipeline1', \
	'None', 'ps3', 'Open', 10, '2017-07-06 00:00:00')");
// oid9
client.query("INSERT INTO Opportunity VALUES ('oid9', 'oid9', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Lost', 10, '2017-07-06 00:00:00')");
// oid10
client.query("INSERT INTO Opportunity VALUES ('oid10', 'oid10', 'member1', \
	'company1', 'company1', 'opportunity details', null, 1000, 'pipeline1', \
	'None', 'ps3', 'Open', 10, '2017-07-06 00:00:00')");


// PWActions

// CASE1: created, won, lost, abandoned outside of time range
client.query("INSERT INTO PWAction VALUES ('action1', 'Created', 'oid1', \
	'opportunity', '2017-07-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action2', 'Status Change', \
	'oid1', 'opportunity', '2017-07-02 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action3', 'Status Change', \
	'oid1', 'opportunity', '2017-07-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");
client.query("INSERT INTO PWAction VALUES ('action4', 'Status Change', \
	'oid1', 'opportunity', '2017-07-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', null)");

// CASE2: created within time range
// ps1
client.query("INSERT INTO PWAction VALUES ('action5', 'Created', 'oid2', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action6', 'Created', 'oid3', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action7', 'Created', 'oid4', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
// ps2
client.query("INSERT INTO PWAction VALUES ('action8', 'Created', 'oid5', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action9', 'Created', 'oid6', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action10', 'Created', 'oid7', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
// ps3
client.query("INSERT INTO PWAction VALUES ('action11', 'Created', 'oid8', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action12', 'Created', 'oid9', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action13', 'Created', 'oid10', \
	'opportunity', '2017-07-06 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");

// CASE3: won within time range
client.query("INSERT INTO PWAction VALUES ('action14', 'Status Change', \
	'oid3', 'opportunity', '2017-07-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action15', 'Status Change', \
	'oid6', 'opportunity', '2017-07-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");

// CASE4: lost within time range
client.query("INSERT INTO PWAction VALUES ('action16', 'Status Change', \
	'oid4', 'opportunity', '2017-07-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action17', 'Status Change', \
	'oid4', 'opportunity', '2017-07-09 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");

client.query("INSERT INTO PWAction VALUES ('action18', 'Status Change', \
	'oid9', 'opportunity', '2017-07-09 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', 't')");

// CASE5: abandoned within time range
client.query("INSERT INTO PWAction VALUES ('action19', 'Status Change', \
	'oid7', 'opportunity', '2017-07-09 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', 't')");
client.query("INSERT INTO PWAction VALUES ('action20', 'Status Change', \
	'oid7', 'opportunity', '2017-07-10 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', null)");

client.query("INSERT INTO PWAction VALUES ('action21', 'Stage Change', \
	'oid10', 'opportunity', '2017-07-09 00:00:00', null, 'ps1', 'ps3', null, \
	null, 'ps1', 'ps3', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action22', 'Status Change', \
	'oid10', 'opportunity', '2017-07-10 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");

// CASE6: abandoned outside time range
const query = client.query(new pg.Query("INSERT INTO PWAction VALUES ('action23', 'Status Change', \
	'oid9', 'opportunity', '2017-12-10 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', null)"));

// close psql connection
query.on('end', () => { client.end(); });
