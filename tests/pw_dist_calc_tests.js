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

// Opportunities
// oid1
client.query("INSERT INTO Opportunity VALUES ('oid1', 'oid1', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid2
client.query("INSERT INTO Opportunity VALUES ('oid2', 'oid2', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps2', 'Open', 10, '2017-01-01 00:00:00')");
// oid3
client.query("INSERT INTO Opportunity VALUES ('oid3', 'oid3', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Open', 10, '2017-01-01 00:00:00')");
// oid4
client.query("INSERT INTO Opportunity VALUES ('oid4', 'oid4', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid5
client.query("INSERT INTO Opportunity VALUES ('oid5', 'oid5', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid6
client.query("INSERT INTO Opportunity VALUES ('oid6', 'oid6', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid7
client.query("INSERT INTO Opportunity VALUES ('oid7', 'oid7', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid8
client.query("INSERT INTO Opportunity VALUES ('oid8', 'oid8', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid9
client.query("INSERT INTO Opportunity VALUES ('oid9', 'oid9', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid10
client.query("INSERT INTO Opportunity VALUES ('oid10', 'oid10', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps2', 'Open', 10, '2017-01-01 00:00:00')");


// PWActions

// CASE1: create opp and never move it
client.query("INSERT INTO PWAction VALUES ('action1', 'Created', 'oid1', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");

// CASE2: create opp, move it an odd number of times
client.query("INSERT INTO PWAction VALUES ('action2', 'Created', 'oid2', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action3', 'Stage Change', \
	'oid2', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");

// CASE3: create opp, move it an even number of times
client.query("INSERT INTO PWAction VALUES ('action4', 'Created', 'oid3', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action5', 'Stage Change', \
	'oid3', 'opportunity', '2017-01-03 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action6', 'Stage Change', \
	'oid3', 'opportunity', '2017-01-06 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");

// CASE4: create opp, close opp
client.query("INSERT INTO PWAction VALUES ('action7', 'Created', 'oid4', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action8', 'Status Change', \
	'oid4', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");

// CASE5: create opp, move out, move in, close
client.query("INSERT INTO PWAction VALUES ('action9', 'Created', 'oid5', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action10', 'Stage Change', \
	'oid5', 'opportunity', '2017-01-03 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action11', 'Stage Change', \
	'oid5', 'opportunity', '2017-01-10 00:00:00', null, 'ps2', 'ps1', null, \
	null, 'ps2', 'ps1', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action12', 'Status Change', \
	'oid5', 'opportunity', '2017-01-15 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");

// CASE6: create opp, close opp, reopen opp
client.query("INSERT INTO PWAction VALUES ('action13', 'Created', 'oid6', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action14', 'Status Change', \
	'oid6', 'opportunity', '2017-01-05 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action15', 'Status Change', \
	'oid6', 'opportunity', '2017-01-13 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 'f')");

// CASE7: create opp, move out, move back, close opp, reopen opp
client.query("INSERT INTO PWAction VALUES ('action16', 'Created', 'oid7', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action17', 'Stage Change', \
	'oid7', 'opportunity', '2017-01-03 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action18', 'Stage Change', \
	'oid7', 'opportunity', '2017-01-07 00:00:00', null, 'ps2', 'ps1', null, \
	null, 'ps2', 'ps1', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action19', 'Status Change', \
	'oid7', 'opportunity', '2017-01-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action20', 'Status Change', \
	'oid7', 'opportunity', '2017-01-13 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 'f')");

// CASE 8: create opp, close opp, change status, reopen
client.query("INSERT INTO PWAction VALUES ('action21', 'Created', 'oid8', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action22', 'Status Change', \
	'oid8', 'opportunity', '2017-01-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action23', 'Status Change', \
	'oid8', 'opportunity', '2017-01-09 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");
client.query("INSERT INTO PWAction VALUES ('action24', 'Status Change', \
	'oid8', 'opportunity', '2017-01-12 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");

// CASE 9: create opp, close opp, change statusx2, reopen
client.query("INSERT INTO PWAction VALUES ('action25', 'Created', 'oid9', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action26', 'Status Change', \
	'oid9', 'opportunity', '2017-01-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action27', 'Status Change', \
	'oid9', 'opportunity', '2017-01-10 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', null)");
client.query("INSERT INTO PWAction VALUES ('action28', 'Status Change', \
	'oid9', 'opportunity', '2017-01-11 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");
client.query("INSERT INTO PWAction VALUES ('action29', 'Status Change', \
	'oid9', 'opportunity', '2017-01-16 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");

// CASE 10: create opp, move out, move in, close, change statusx2, reopen, move
client.query("INSERT INTO PWAction VALUES ('action30', 'Created', 'oid10', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action31', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-03 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action32', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-07 00:00:00', null, 'ps2', 'ps1', null, \
	null, 'ps2', 'ps1', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action33', 'Status Change', \
	'oid10', 'opportunity', '2017-01-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action34', 'Status Change', \
	'oid10', 'opportunity', '2017-01-10 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', null)");
client.query("INSERT INTO PWAction VALUES ('action35', 'Status Change', \
	'oid10', 'opportunity', '2017-01-11 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");
client.query("INSERT INTO PWAction VALUES ('action36', 'Status Change', \
	'oid10', 'opportunity', '2017-01-16 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
const query = client.query(new pg.Query("INSERT INTO PWAction VALUES ('action37', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-17 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)"));

// close psql connection
query.on('end', () => { client.end(); });
