const pg = require('pg');
var config = require("../config.js");
const connectionString = "postgres://" + config.databaseUser + ":" 
+ config.databasePassword + "@" + config.databaseHost + ":" 
+ config.databasePort + "/" + config.databaseName;

const client = new pg.Client(connectionString);
client.connect();

// Members
client.query("INSERT INTO Member VALUES ('memberid1', 'Julie Wang', 'accesstoken1')");
client.query("INSERT INTO Member VALUES ('memberid2', 'Laura Cheung', 'accesstoken2')");
client.query("INSERT INTO Member VALUES ('memberid3', 'Hilary Tung', 'accesstoken3')");

// Boards
client.query("INSERT INTO Board VALUES ('boardid1', 'Board 1', 'https://www.google.com', '{memberid1, memberid2}')");
client.query("INSERT INTO Board VALUES ('boardid2', 'Board 2', 'https://www.google.com', '{memberid1}')");
client.query("INSERT INTO Board VALUES ('boardid3', 'Board 3', 'https://www.google.com', '{memberid1, memberid3}')");

// Lists
client.query("INSERT INTO List VALUES ('listid1', 'boardid1', 'List A1', 'false', '{memberid1, memberid2}')");
client.query("INSERT INTO List VALUES ('listid2', 'boardid1', 'List B1', 'false', '{memberid1, memberid2}')");
client.query("INSERT INTO List VALUES ('listid3', 'boardid1', 'List C1', 'false', '{memberid1, memberid2}')");
client.query("INSERT INTO List VALUES ('listid4', 'boardid2', 'List A2', 'false', '{memberid1}')");
client.query("INSERT INTO List VALUES ('listid5', 'boardid2', 'List B2', 'false', '{memberid1}')");
client.query("INSERT INTO List VALUES ('listid6', 'boardid3', 'List A3', 'false', '{memberid1, memberid3}')");
client.query("INSERT INTO List VALUES ('listid7', 'boardid3', 'List B3', 'false', '{memberid1, memberid3}')");

// Cards
// board 1 list 1
client.query("INSERT INTO Card VALUES ('cardid1', 'Card1', NULL, NULL, 'false', 'boardid1', 'listid1', 'https://www.google.com', 'false', '{memberid1, memberid2}')");
client.query("INSERT INTO Card VALUES ('cardid2', 'Card2', NULL, NULL, 'false', 'boardid1', 'listid1', 'https://www.google.com', 'false', '{memberid1, memberid2}')");
// board 1 list 2
client.query("INSERT INTO Card VALUES ('cardid3', 'Card3', NULL, NULL, 'false', 'boardid1', 'listid2', 'https://www.google.com', 'false', '{memberid1, memberid2}')");
// board 2 list 1
client.query("INSERT INTO Card VALUES ('cardid4', 'Card4', NULL, NULL, 'false', 'boardid2', 'listid4', 'https://www.google.com', 'false', '{memberid1}')");
// board 2 list 2
client.query("INSERT INTO Card VALUES ('cardid5', 'Card5', NULL, NULL, 'false', 'boardid2', 'listid5', 'https://www.google.com', 'false', '{memberid1}')");
// board 3 list 1
client.query("INSERT INTO Card VALUES ('cardid6', 'Card6', NULL, NULL, 'false', 'boardid3', 'listid6', 'https://www.google.com', 'false', '{memberid1, memberid3}')");
client.query("INSERT INTO Card VALUES ('cardid8', 'Card7', NULL, NULL, 'false', 'boardid2', 'listid4', 'htttps://www.google.com', 'false', '{memberid1}')");
// board 3 list 2
client.query("INSERT INTO Card VALUES ('cardid7', 'Card8', NULL, NULL, 'false', 'boardid3', 'listid7', 'https://www.google.com', 'false', '{memberid1, memberid3}')");
// closed cards
// CREATE MORE CASES FOR CLOSED CARDS
client.query("INSERT INTO Card VALUES ('cardid9', 'Card9', NULL, NULL, 'false', 'boardid2', 'listid4', 'htttps://www.google.com', 'true', '{memberid1}')");
client.query("INSERT INTO Card VALUES ('cardid10', 'Card10', NULL, NULL, 'false', 'boardid3', 'listid6', 'htttps://www.google.com', 'true', '{memberid1, memberid3}')");
client.query("INSERT INTO Card VALUES ('cardid11', 'Card11', NULL, NULL, 'false', 'boardid3', 'listid6', 'htttps://www.google.com', 'true', '{memberid1, memberid3}')");

// Actions

// CASE 1: create a card and move it odd number of times
// created cardid1 in listid1
client.query("INSERT INTO Action VALUES ('actionid1', 'cardid1', '2016-01-01 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid1 from listid1 to listid2
client.query("INSERT INTO Action VALUES ('actionid2', 'cardid1', '2016-01-14 00:00:00.000', 'updateCard', NULL, 'LIST A1', 'LIST B1', NULL, NULL, 'listid1', 'listid2', NULL, NULL, NULL, 'false')");
// moved cardid1 from listid2 back to listid1
client.query("INSERT INTO Action VALUES ('actionid3', 'cardid1', '2016-01-15 00:00:00.000', 'updateCard', NULL, 'LIST B1', 'LIST A1', NULL, NULL, 'listid2', 'listid1', NULL, NULL, NULL, 'false')");

// CASE 2: create a card and never move it
// created cardid2 in listid1
client.query("INSERT INTO Action VALUES ('actionid4', 'cardid2', '2016-01-20 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");

// CASE 3: create a card and move it an even number of times
// created cardid3 in listid1
client.query("INSERT INTO Action VALUES ('actionid5', 'cardid3', '2016-01-02 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid3 from listid1 to listid2
client.query("INSERT INTO Action VALUES ('actionid6', 'cardid3', '2016-02-01 00:00:00.000', 'updateCard', NULL, 'List A1', 'List B1', NULL, NULL, 'listid1', 'listid2', NULL, NULL, NULL, 'false')");

// CASE 4: move a card across to a new board
// created cardid4 in listid1
client.query("INSERT INTO Action VALUES ('actionid7', 'cardid4', '2016-01-03 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid4 from listid1 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid8', 'cardid4', '2016-02-03 00:00:00.000', 'updateCard', NULL, 'List A1', 'List A2', NULL, NULL, 'listid1', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");

// CASE 5: move a card within the board, and then to a new board, and then within the new board
// created cardid5 in listid1
client.query("INSERT INTO Action VALUES ('actionid9', 'cardid5', '2016-01-01 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid5 from listid1 to listid2
client.query("INSERT INTO Action VALUES ('actionid10', 'cardid5', '2016-01-28 00:00:00.000', 'updateCard', NULL, 'List A1', 'List B1', NULL, NULL, 'listid1', 'listid2', NULL, NULL, NULL, 'false')");
// moved cardid5 from listid2 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid11', 'cardid5', '2016-02-04 00:00:00.000', 'updateCard', NULL, 'List B1', 'List A2', NULL, NULL, 'listid2', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");
// moved cardid5 from listid4 to listid5
client.query("INSERT INTO Action VALUES ('actionid12','cardid5', '2016-02-05 00:00:00.000', 'updateCard', NULL, 'List A2', 'List B2', NULL, NULL, 'listid4', 'listid5', NULL, NULL, NULL, 'false')");

// CASE 6: move a card to a new board twice
// created cardid6 in listid1 
client.query("INSERT INTO Action VALUES ('actionid13', 'cardid6', '2016-01-05 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid6 from listid1 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid14', 'cardid6', '2016-02-04 00:00:00.000', 'updateCard', NULL, 'List A1', 'List A2', NULL, NULL, 'listid1', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");
// moved cardid6 from listid4 to listid6 (boardid2 to boardid3)
client.query("INSERT INTO Action VALUES ('actionid15', 'cardid6', '2016-02-05 00:00:00.000', 'updateCard', NULL, 'List A2', 'List A3', NULL, NULL, 'listid4', 'listid6', NULL, 'boardid2', 'boardid3', 'false')");

// CASE 7: move a card to a new board twice, with movements within board before and after
// created cardid7 in listid1
client.query("INSERT INTO Action VALUES ('actionid16', 'cardid7', '2016-01-02 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid7 from listid1 to listid2
client.query("INSERT INTO Action VALUES ('actionid17', 'cardid7', '2016-01-26 00:00:00.000', 'updateCard', NULL, 'List A1', 'List B1', NULL, NULL, 'listid1', 'listid2', NULL, NULL, NULL, 'false')");
// moved cardid7 from listid2 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid18', 'cardid7', '2016-02-04 00:00:00.000', 'updateCard', NULL, 'List B1', 'List A2', NULL, NULL, 'listid2', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");
// moved cardid7 from listid4 to listid6 (boardid2 to boardid3)
client.query("INSERT INTO Action VALUES ('actionid19', 'cardid7', '2016-02-05 00:00:00.000', 'updateCard', NULL, 'List A2', 'List A3', NULL, NULL, 'listid4', 'listid6', NULL, 'boardid2', 'boardid3', 'false')");
// moved cardid7 from listid6 to listid7
client.query("INSERT INTO Action VALUES ('actionid20', 'cardid7', '2016-02-26 00:00:00.000', 'updateCard', NULL, 'List A3', 'List B3', NULL, NULL, 'listid6', 'listid7', NULL, NULL, NULL, 'false')");

// CASE 8: move a card to a new board twice, with momvements within board in between
// created cardid8 in listid1
client.query("INSERT INTO Action VALUES ('actionid21', 'cardid8', '2016-01-04 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid8 from listid1 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid22', 'cardid8', '2016-01-05 00:00:00.000', 'updateCard', NULL, 'List A1', 'List A2', NULL, NULL, 'listid1', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");
// moved cardid8 from listid4 to listid5
client.query("INSERT INTO Action VALUES ('actionid23','cardid8', '2016-01-15 00:00:00.000', 'updateCard', NULL, 'List A2', 'List B2', NULL, NULL, 'listid4', 'listid5', NULL, NULL, NULL, 'false')");
// moved cardid8 from listid5 to listid6 (boardid2 to boardid3)
client.query("INSERT INTO Action VALUES ('actionid24', 'cardid8', '2016-02-05 00:00:00.000', 'updateCard', NULL, 'List B2', 'List A3', NULL, NULL, 'listid5', 'listid6', NULL, 'boardid2', 'boardid3', 'false')");

// CASE 9: move a card to around within the same board, and then close it
// created cardid9 in listid1
client.query("INSERT INTO Action VALUES ('actionid25', 'cardid9', '2016-01-06 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid9 from listid1 to listid2
client.query("INSERT INTO Action VALUES ('actionid26', 'cardid9', '2016-01-16 00:00:00.000', 'updateCard', NULL, 'List A1', 'List B1', NULL, NULL, 'listid1', 'listid2', NULL, NULL, NULL, 'false')");
// closed cardid9 in listid2
client.query("INSERT INTO Action VALUES ('actionid27', 'cardid9', '2016-01-26 00:00:00.000', 'updateCard', NULL, NULL, NULL, 'List B1', NULL, NULL, NULL, 'listid2', NULL, NULL, 'true')");

// CASE 10: move a card to a new boad and then close it
// created cardid10 in listid1
client.query("INSERT INTO Action VALUES ('actionid29', 'cardid10', '2016-01-01 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid10 from listid1 to listid4 (boardid1 to boardid2)
client.query("INSERT INTO Action VALUES ('actionid30', 'cardid10', '2016-01-05 00:00:00.000', 'updateCard', NULL, 'List A1', 'List A2', NULL, NULL, 'listid1', 'listid4', NULL, 'boardid1', 'boardid2', 'false')");
// closed cardid10 in listid4
client.query("INSERT INTO Action VALUES ('actionid31', 'cardid10', '2016-01-26 00:00:00.000', 'updateCard', NULL, NULL, NULL, 'List A2', NULL, NULL, NULL, 'listid4', NULL, NULL, 'true')");

// Case 11: close and reopen a card
// created cardid11 in listid1
client.query("INSERT INTO Action VALUES ('actionid32', 'cardid11', '2016-01-01 00:00:00.000', 'createCard', 'List A1', NULL, NULL, NULL, 'listid1', NULL, NULL, NULL, NULL, NULL, 'false')");
// moved cardid11 from listid1 to listid7 (boardid1 to boardid3)
client.query("INSERT INTO Action VALUES ('actionid33', 'cardid11', '2016-01-05 00:00:00.000', 'updateCard', NULL, 'List A1', 'List B3', NULL, NULL, 'listid1', 'listid7', NULL, 'boardid1', 'boardid3', 'false')");
// closed cardid11 in listid7
client.query("INSERT INTO Action VALUES ('actionid34', 'cardid11', '2016-01-25 00:00:00.000', 'updateCard', NULL, NULL, NULL, 'List B3', NULL, NULL, NULL, 'listid7', NULL, NULL, 'true')");
// reopened cardid11 in listid7
client.query("INSERT INTO Action VALUES ('actionid35', 'cardid11', '2016-01-26 00:00:00.000', 'updateCard', NULL, NULL, NULL, 'List B3', NULL, NULL, NULL, 'listid7', NULL, NULL, 'false')");
// moved cardid11 from listid7 to listid6
const query = client.query(new pg.Query("INSERT INTO Action VALUES ('actionid36', 'cardid11', '2016-01-27 00:00:00.000', 'updateCard', NULL, 'List B3', 'List A3', NULL, NULL, 'listid7', 'listid6', NULL, NULL, NULL, 'false')"));

// close psql connection
query.on('end', () => { client.end(); });

