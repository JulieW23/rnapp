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

/* GET pipeline stages by pipeline */
router.get('/pipelinestages/pipeline/:pipelineid', (req, res, next) => {
    const pipelineid = req.params.pipelineid;
    const qs = "SELECT * FROM PipelineStage WHERE pipeline_id='" + pipelineid + "'";
    getHelper(req, res, next, qs);
});

/* ================================================================
// OPPORTUNITIES
================================================================ */ 
/* GET all opportunities */
router.get('/opportunities', (req, res, next) => {
	const qs = 'SELECT * FROM Opportunity';
	getHelper(req, res, next, qs);
});

/* GET opportunities by pipeline */
router.get('/opportunities/pipeline/:pipelineid', (req, res, next) => {
    const pipelineid = req.params.pipelineid;
    const qs = "SELECT * FROM Opportunity WHERE pipeline_id='" + pipelineid + "'";
    getHelper(req, res, next, qs);
});

/* ================================================================
// PWAction
================================================================ */ 
/* GET actions by stage */
router.get('/actions_by_stage/:stageid', (req, res, next) => {
    const stageid = req.params.stageid;
    const qs = "SELECT * FROM PWAction WHERE stagecreatedid='" + stageid + 
    "' or stagebeforeid='" + stageid + "' or stageafterid='" + stageid 
    + "' or (stageclosedid='" + stageid + 
    "' and closed is not null) order by opportunity_id, date";
    getHelper(req, res, next, qs);
});

/* GET created actions count for a pipeline_stage_id between a time range*/
router.get('/created_actions/:stageid/:fromDate/:toDate', (req, res, next) => {
    const stageid = req.params.stageid;
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    const qs = "SELECT opportunity_id FROM PWAction WHERE stagecreatedid='" + stageid + 
    "' AND date BETWEEN '" + fromDate + 
    "'::timestamp AND '" + toDate + "'::timestamp";
    getHelper(req, res, next, qs);
});

/* GET won actions count for a pipeline_stage_id between a time range*/
router.get('/won_actions/:stageid/:fromDate/:toDate', (req, res, next) => {
    const stageid = req.params.stageid;
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    const qs = "SELECT opportunity_id FROM PWAction WHERE stageclosedid='" + stageid + 
    "' AND closedstatus='Won' AND date BETWEEN '" + fromDate + 
    "'::timestamp AND '" + toDate + "'::timestamp";
    getHelper(req, res, next, qs);
});

/* GET lost actions count for a pipeline_stage_id between a time range*/
router.get('/lost_actions/:stageid/:fromDate/:toDate', (req, res, next) => {
    const stageid = req.params.stageid;
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    const qs = "SELECT opportunity_id FROM PWAction WHERE stageclosedid='" + stageid + 
    "' AND closedstatus='Lost' AND date BETWEEN '" + fromDate + 
    "'::timestamp AND '" + toDate + "'::timestamp";
    getHelper(req, res, next, qs);
});

/* GET abandoned actions count for a pipeline_stage_id between a time range*/
router.get('/abandoned_actions/:stageid/:fromDate/:toDate', (req, res, next) => {
    const stageid = req.params.stageid;
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    const qs = "SELECT opportunity_id FROM PWAction WHERE stageclosedid='" + stageid + 
    "' AND closedstatus='Abandoned' AND date BETWEEN '" + fromDate + 
    "'::timestamp AND '" + toDate + "'::timestamp";
    getHelper(req, res, next, qs);
});

