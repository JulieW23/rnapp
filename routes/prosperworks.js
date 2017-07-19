var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const app = require('../app');
var config = require("../config.js");
var store_data = require('../login/prosperworks.js')

var pool = new pg.Pool({
    database: config.databaseName,
    user: config.databaseUser,
    password: config.databasePassword,
    port: config.databasePort,
    host: config.databaseHost
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	store_data.storeData();
  	res.render('prosperworks', { title: 'ProsperWorks' });
});

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
// PIPELINE
================================================================ */ 

/* GET all pipelines */
router.get('/pipelines', (req, res, next) => {
	const qs = 'SELECT * FROM Pipeline';
	getHelper(req, res, next, qs);
});

/* ================================================================
// PIPELINE STAGE
================================================================ */ 

/* GET all pipeline stages */
router.get('/pipelinestages', (req, res, next) => {
	const qs = 'SELECT * FROM PipelineStage';
	getHelper(req, res, next, qs);
});

/* ================================================================
// OPPORTUNITIES
================================================================ */ 
router.get('/opportunities', (req, res, next) => {
	const qs = 'SELECT * FROM Opportunity';
	getHelper(req, res, next, qs);
});


