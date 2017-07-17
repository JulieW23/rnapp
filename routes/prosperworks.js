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
