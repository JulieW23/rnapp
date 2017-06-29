var express = require('express');
var router = express.Router();
// const pg = require('pg');
// const path = require('path');
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Pinkbird222@localhost:5432/rapidnovordb';

module.exports = router;

router.head('/', function(req, res) {
  	res.sendStatus(200);
});