var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const app = require('../app')
var config = require("../config.js");
const connectionString = config.databaseURL;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
module.exports = router;

/* GET helper function */
function getHelper(req, res, next, queryString) {
    const results = [];
    pg.connect(connectionString, (err, client, done) => {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({sucess: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query(queryString);
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
}

/* ================================================================
// BOARDS
================================================================ */ 

/* GET all boards */
router.get('/boards', (req, res, next) => {
    //console.log('GET BOARDS!');
    const qs = 'SELECT * FROM Board';
    getHelper(req, res, next, qs);
});

/* ================================================================
// LISTS
================================================================ */ 
/* GET all lists */
router.get('/lists', (req, res, next) => {
    const qs = 'SELECT * FROM List';
    getHelper(req, res, next, qs);
});

/* GET unarchived lists */
router.get('/openlists', (req, res, next) => {
    const qs = "SELECT * FROM List WHERE closed='f'";
    getHelper(req, res, next, qs);
});

/* GET lists by idBoard */
router.get('/lists/:idBoard', (req, res, next) => {
    const idBoard = req.params.idBoard;
    const qs = "SELECT * FROM List WHERE idBoard='" + idBoard + "'";
    getHelper(req, res, next, qs);
});

/* POST list */
router.post('/lists', (req, res, next) => {
    const results = [];
    const data = {id: req.body.id, idBoard: req.body.idBoard, 
    name: req.body.name, closed: req.body.closed};
    pg.connect(connectionString, (err, client, done) => {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const check_list = client.query("SELECT count(*) FROM List WHERE id='" + data.id + "'");
        check_list.on('row', (row) => {
            if (row.count == 0){
          	     client.query('INSERT INTO List(id, idBoard, name, closed) values($1, $2, $3, $4)', 
      			[data.id, data.idBoard, data.name, data.closed]);
            }
        });
        const query = client.query('SELECT * FROM List');
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});

/* ================================================================
// CARDS
================================================================ */ 
/* GET all cards */
router.get('/cards', (req, res, next) => {
    const qs = 'SELECT * FROM Card';
    getHelper(req, res, next, qs);
});

/* GET unarchived cards */
router.get('/opencards', (req, res, next) => {
    const qs = "SELECT * FROM Card WHERE closed='f'";
    getHelper(req, res, next, qs);
});

/* GET archived cards */
router.get('/archivedcards', (req, res, next) => {
    const qs = "SELECT * FROM Card WHERE closed='t'";
    getHelper(req, res, next, qs);
});

/* GET cards by idBoard */
router.get('/cards/:idBoard', (req, res, next) => {
    const idBoard = req.params.idBoard;
    const qs = "SELECT * FROM Card WHERE idBoard='" + idBoard + "'";
    getHelper(req, res, next, qs);
});

/* GET cards by idList */
router.get('/cards/list/:idList', (req, res, next) => {
    const idList = req.params.idList;
    const qs = "SELECT * FROM Card WHERE idList='" + idList + "'";
    getHelper(req, res, next, qs);
});

/* POST a card */
router.post('/cards', (req, res, next) => {
    const results = [];
    const data = {id: req.body.id, name: req.body.name, 
    description: req.body.description, due: req.body.due, 
    dueComplete: req.body.dueComplete, idBoard: req.body.idBoard, 
    idList: req.body.idList, idMembers: req.body.idMembers, 
    shortURL: req.body.shortURL, closed: req.body.closed};
    pg.connect(connectionString, (err, client, done) => {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const check_card = client.query("SELECT count(*) FROM Card WHERE id='" + data.id + "'");
        check_card.on('row', (row) => {
            if (row.count == 0){
          	     client.query('INSERT INTO Card(id, name, description, due, \
      			dueComplete, idBoard, idList, idMembers, shortURL, closed)\
       			values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', 
      			[data.id, data.name, data.description, data.due, data.dueComplete, 
      			data.idBoard, data.idList, data.idMembers, 
      			data.shortURL, data.closed]);
            }
        });
        const query = client.query('SELECT * FROM Card');
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});

/* ================================================================
// ACTIONS
================================================================ */ 
/* GET all actions */
router.get('/actions', (req, res, next) => {
    const qs = 'SELECT * FROM ACTION';
    getHelper(req, res, next, qs);
});

/* GET actions by id */
router.get('/actions/:idCard', (req, res, next) => {
    const results = [];
    const idCard = req.params.idCard;
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const query = client.query('SELECT * FROM Action WHERE idCard=($1)', [idCard]);
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

/* GET actions by list */
router.get('/actions_by_list/:listid', (req, res, next) => {
    const listid = req.params.listid;
    const qs = "SELECT * FROM Action WHERE createdInListId='" + listid + "' or listBeforeId='" + listid + "' or listAfterId='" + listid + "' or closedInListId='" + listid + "' order by idcard, date";
    //console.log(qs);
    getHelper(req, res, next, qs);
});

/* POST an action */
router.post('/actions', (req, res, next) => {
    const results = [];
    const data = {id: req.body.id, idCard: req.body.idCard, date: req.body.date, 
    type: req.body.type, createdInList: req.body.createdInList, 
    listBefore: req.body.listBefore, listAfter: req.body.listAfter, closedInList: req.body.closedInList, 
    createdInListId: req.body.createdInListId, listBeforeId: req.body.listBeforeId, listAfterId: req.body.listAfterId, 
    closedInListId: req.body.closedInListId, closed: req.body.closed};
    pg.connect(connectionString, (err, client, done) => {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const check_action = client.query("SELECT count(*) FROM Action WHERE id='" + data.id + "'");
        check_action.on('row', (row) => {
            if (row.count == 0){
          	     client.query('INSERT INTO Action(id, idCard, date, type, createdInList, \
     			listBefore, listAfter, closedInList, createdInListId, listBeforeId, \
                ListAfterId, closedInListId, closed)\
       			values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', 
      			[data.id, data.idCard, data.date, data.type, data.createdInList, 
      			data.listBefore, data.listAfter, data.closedInList, data.createdInListId, 
                data.listBeforeId, data.listAfterId, data.closedInListId, data.closed]);
            }
        });
        const query = client.query('SELECT * FROM Action');
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});
