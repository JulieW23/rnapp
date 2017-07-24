const pg = require('pg');
var config = require("../config.js");
const connectionString = "postgres://" + config.databaseUser + ":" 
+ config.databasePassword + "@" + config.databaseHost + ":" 
+ config.databasePort + "/" + config.databaseName;

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(new pg.Query(
	'CREATE TABLE SystemAccount(\
	id varchar(50) PRIMARY KEY, \
	email varchar(100) NOT NULL, \
	password varchar(30) NOT NULL, \
	firstname varchar(20) NOT NULL, \
	lastname varchar(20) NOT NULL)'
));

query.on('end', () => { client.end(); });
