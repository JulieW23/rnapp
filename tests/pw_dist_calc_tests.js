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

// PWActions

// CASE1: create opp and never move it
client.query("INSERT INTO PWAction VALUES ('action1', 'Created', 'oid1', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");

// CASE2: create opp, move it an odd number of times

// CASE3: create opp, move it an even number of times

// CASE4: create opp, close opp

// CASE5: create opp, move out, move in, close

// CASE6: create opp, close opp, reopen opp

// CASE7: create opp, move out, move back, close opp, reopen opp

// CASE 8: create opp, close opp, change status, reopen

// CASE 9: create opp, close opp, change statusx2, reopen

// CASE 10: create opp, move out, move in, close, change statusx2, reopen, move



