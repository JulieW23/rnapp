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
// ps4
client.query("INSERT INTO PipelineStage VALUES ('ps4', 'ps4', 'pipeline1', \
	'10')");
// ps5
client.query("INSERT INTO PipelineStage VALUES ('ps5', 'ps5', 'pipeline1', \
	'10')");

// Opportunities
// oid1
client.query("INSERT INTO Opportunity VALUES ('oid1', 'oid1', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Open', 10, '2017-01-01 00:00:00')");
// oid2
client.query("INSERT INTO Opportunity VALUES ('oid2', 'oid2', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps1', 'Abandoned', 10, '2017-01-02 00:00:00')");
// oid3
client.query("INSERT INTO Opportunity VALUES ('oid3', 'oid3', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps2', 'Open', 10, '2017-01-02 00:00:00')");
// oid4
client.query("INSERT INTO Opportunity VALUES ('oid4', 'oid4', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps2', 'Abandoned', 10, '2017-01-02 00:00:00')");
// oid5
client.query("INSERT INTO Opportunity VALUES ('oid5', 'oid5', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Abandoned', 10, '2017-01-02 00:00:00')");
// oid6
client.query("INSERT INTO Opportunity VALUES ('oid6', 'oid6', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Lost', 10, '2017-01-02 00:00:00')");
// oid7
client.query("INSERT INTO Opportunity VALUES ('oid7', 'oid7', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Open', 10, '2017-01-02 00:00:00')");
// oid8
client.query("INSERT INTO Opportunity VALUES ('oid8', 'oid8', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps3', 'Won', 10, '2017-01-02 00:00:00')");
// oid9
client.query("INSERT INTO Opportunity VALUES ('oid9', 'oid9', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps5', 'Open', 10, '2017-01-02 00:00:00')");
// oid10
client.query("INSERT INTO Opportunity VALUES ('oid10', 'oid10', 'member1', \
	'company1', 'company1', 'opportunity details', null, 100, 'pipeline1', \
	'None', 'ps5', 'Lost', 10, '2017-01-02 00:00:00')");


// PWActions

// TEST1: no move actions
// create
client.query("INSERT INTO PWAction VALUES ('action1', 'Created', 'oid1', \
	'opportunity', '2017-01-01 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");

// TEST2: no move actions
// create, (change status)x2
client.query("INSERT INTO PWAction VALUES ('action2', 'Created', 'oid2', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action3', 'Status Change', \
	'oid2', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action4', 'Status Change', \
	'oid2', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', null)");

// TEST3: one move action with nothing after it
// create, (change status)x2, move
client.query("INSERT INTO PWAction VALUES ('action5', 'Created', 'oid3', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action6', 'Status Change', \
	'oid3', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action7', 'Status Change', \
	'oid3', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action8', 'Stage Change', \
	'oid3', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");

// TEST4: one move action, with change status after it
// create, (change status)x2, move, change status
client.query("INSERT INTO PWAction VALUES ('action9', 'Created', 'oid4', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action10', 'Status Change', \
	'oid4', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action11', 'Status Change', \
	'oid4', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action12', 'Stage Change', \
	'oid4', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action13', 'Status Change', \
	'oid4', 'opportunity', '2017-01-06 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");

// *TEST5: multiple move actions with nothing after the last move
// create, (change status)x2, move, change status, move
client.query("INSERT INTO PWAction VALUES ('action14', 'Created', 'oid5', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action15', 'Status Change', \
	'oid5', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action16', 'Status Change', \
	'oid5', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action17', 'Stage Change', \
	'oid5', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action18', 'Status Change', \
	'oid5', 'opportunity', '2017-01-06 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action19', 'Stage Change', \
	'oid5', 'opportunity', '2017-01-07 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");

// *TEST6: multiple move actions with change status at the end
// create, (change status)x2, move, change status, move, change status
client.query("INSERT INTO PWAction VALUES ('action20', 'Created', 'oid6', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action21', 'Status Change', \
	'oid6', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action22', 'Status Change', \
	'oid6', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action23', 'Stage Change', \
	'oid6', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action24', 'Status Change', \
	'oid6', 'opportunity', '2017-01-06 00:00:00', null, null, null, null, \
	null, null, null, null, 'Abandoned', 't')");
client.query("INSERT INTO PWAction VALUES ('action25', 'Stage Change', \
	'oid6', 'opportunity', '2017-01-07 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action26', 'Status Change', \
	'oid6', 'opportunity', '2017-01-08 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', null)");

// TEST7: two consecutive move actions with nothing after it
// create, (change status)x2, (move)x2
client.query("INSERT INTO PWAction VALUES ('action27', 'Created', 'oid7', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action28', 'Status Change', \
	'oid7', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action29', 'Status Change', \
	'oid7', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action30', 'Stage Change', \
	'oid7', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action31', 'Stage Change', \
	'oid7', 'opportunity', '2017-01-06 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");

// *TEST8: two consecutive move actions with change status after it
// create, (change status)x2, (move)x2, change status
client.query("INSERT INTO PWAction VALUES ('action32', 'Created', 'oid8', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action33', 'Status Change', \
	'oid8', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action34', 'Status Change', \
	'oid8', 'opportunity', '2017-01-04 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action35', 'Stage Change', \
	'oid8', 'opportunity', '2017-01-05 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action36', 'Stage Change', \
	'oid8', 'opportunity', '2017-01-06 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action37', 'Status Change', \
	'oid8', 'opportunity', '2017-01-07 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");

// *TEST9: create, ((change status), (move)x2) x2
client.query("INSERT INTO PWAction VALUES ('action38', 'Created', 'oid9', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action39', 'Status Change', \
	'oid9', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action41', 'Stage Change', \
	'oid9', 'opportunity', '2017-01-04 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action42', 'Stage Change', \
	'oid9', 'opportunity', '2017-01-05 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action43', 'Status Change', \
	'oid9', 'opportunity', '2017-01-06 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action44', 'Stage Change', \
	'oid9', 'opportunity', '2017-01-07 00:00:00', null, 'ps3', 'ps4', null, \
	null, 'ps3', 'ps4', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action45', 'Stage Change', \
	'oid9', 'opportunity', '2017-01-08 00:00:00', null, 'ps4', 'ps5', null, \
	null, 'ps4', 'ps5', null, null, null)");

// *TEST10: create, ((change status), (move)x2) x2, change status
client.query("INSERT INTO PWAction VALUES ('action46', 'Created', 'oid10', \
	'opportunity', '2017-01-02 00:00:00', null, null, null, null, null, \
	null, null, null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action47', 'Status Change', \
	'oid10', 'opportunity', '2017-01-03 00:00:00', null, null, null, null, \
	null, null, null, null, 'Won', 't')");
client.query("INSERT INTO PWAction VALUES ('action48', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-04 00:00:00', null, 'ps1', 'ps2', null, \
	null, 'ps1', 'ps2', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action49', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-05 00:00:00', null, 'ps2', 'ps3', null, \
	null, 'ps2', 'ps3', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action50', 'Status Change', \
	'oid10', 'opportunity', '2017-01-06 00:00:00', null, null, null, null, \
	null, null, null, null, 'Open', 'f')");
client.query("INSERT INTO PWAction VALUES ('action51', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-07 00:00:00', null, 'ps3', 'ps4', null, \
	null, 'ps3', 'ps4', null, null, null)");
client.query("INSERT INTO PWAction VALUES ('action52', 'Stage Change', \
	'oid10', 'opportunity', '2017-01-08 00:00:00', null, 'ps4', 'ps5', null, \
	null, 'ps4', 'ps5', null, null, null)");
const query = client.query(new pg.Query("INSERT INTO PWAction VALUES ('action53', 'Status Change', \
	'oid10', 'opportunity', '2017-01-09 00:00:00', null, null, null, null, \
	null, null, null, null, 'Lost', 't')"));

// close psql connection
query.on('end', () => { client.end(); });
