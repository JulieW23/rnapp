var express = require('express');
var router = express.Router();
const pg = require('pg');
//const {Client, Query} = require('pg');
const path = require('path');
const app = require('../app');
var config = require("../config.js");
//const connectionString = config.databaseURL;
var pool = new pg.Pool({
    database: config.databaseName,
    user: config.databaseUser,
    password: config.databasePassword,
    port: config.databasePort,
    host: config.databaseHost
});


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
module.exports = router;

/* GET helper function */
function getHelper(req, res, next, queryString) {
    const results = [];
    pool.connect(function (err, client, done){
        if(err){
            done();
            console.log(err);
            return res.status(500).json({sucess: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query(new pg.Query(queryString));
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

/* GET all boards containing the given member */
router.get('/boards/:idmember', (req, res, next) =>{
    const idMember = req.params.idmember;
    const qs = "SELECT * FROM Board WHERE memberships @> array ['" + idMember + "']::text[]";
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
    pool.connect(function(err, client, done) {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const query = client.query(new pg.Query('SELECT * FROM Action WHERE idCard=($1)', [idCard]));
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


/* ================================================================
// MEMBERS
================================================================ */ 

/* GET member by token */
router.get('/member/:token', (req, res, next) => {
    const token = req.params.token;
    const qs = "SELECT * FROM Member WHERE accesstoken='" + token + "'";
    //console.log(qs);
    getHelper(req, res, next, qs);
});
