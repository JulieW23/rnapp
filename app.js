var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var OAuth = require('oauth').OAuth
var url = require('url');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const pg = require('pg');

var config = require("./config.js");


const connectionString = config.databaseURL;
//const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Pinkbird222@localhost:5432/rapidnovordb';


// ***********************************
var routes = require('./routes/index');
var trello = require('./routes/trello');

var app = express();

/*
/ =================================================================
/     Trello OAuth Setup and Functions
/ =================================================================
*/

const trelloRequestURL = "https://trello.com/1/OAuthGetRequestToken";
const trelloAccessURL = "https://trello.com/1/OAuthGetAccessToken";
const trelloAuthorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
const appName = "rnapp";

const trelloKey = "5878cbde87e11ff40633bf73c28291e0";
const trelloSecret = "c6fa27b49e16e4b339e9253082783e2d8713f80b31bf454bf52d7b1a83ad6a1d";

// Trello redirects the user here after authentication
const trelloLoginCallback = config.trelloLoginCallback + "/trello";
//const trelloLoginCallback = "http://localhost:3000/trello";

// You should {"token": "tokenSecret"} pairs in a real application
// Storage should be more permanent (redis would be a good choice)
const trello_oauth_secrets = {"token": "tokenSecret"};

// oauth call
const oauth = new OAuth(trelloRequestURL, trelloAccessURL, trelloKey, 
	trelloSecret, "1.0A", trelloLoginCallback, "HMAC-SHA1")

function addMonths(date, months){
  	date.setMonth(date.getMonth() + months);
  	return date;
}

var callback_check = 0;
const login = function(req, res) {
  	oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
    	// console.log(`in getOAuthRequestToken - token: ${token}, 
    	//tokenSecret: ${tokenSecret}, resultes ${JSON.stringify(results)}, 
    	//error: ${JSON.stringify(error)}`);
    	trello_oauth_secrets[token] = tokenSecret;
    	callback_check = 1;
    	res.redirect(`${trelloAuthorizeURL}?oauth_token=${token}&name=${appName}`);
  	});
};

var callback = function(request, response) {
  	const client = new pg.Client(connectionString);
  	// get current time
  	var present = new Date();
  	var six_months_ago = addMonths(present, -6).toISOString();
    var three_months_ago = addMonths(present, -3).toISOString();

  	callback_check = 2;
  	const query = url.parse(request.url, true).query;
  	const token = query.oauth_token;
  	const tokenSecret = trello_oauth_secrets[token];
  	const verifier = query.oauth_verifier;
  	oauth.getOAuthAccessToken(token, tokenSecret, verifier, 
  	function(error, accessToken, accessTokenSecret, results){
    	// In a real app, the accessToken and accessTokenSecret should be stored
    	// console.log(`in getOAuthAccessToken - accessToken: ${accessToken}, 
    	//accessTokenSecret: ${accessTokenSecret}, error: ${error}`);
    	client.connect();
    
    	// get user
    	oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", 
    	accessToken, accessTokenSecret, function(error, data, response){
        	// console.log(`in getProtectedResource - accessToken: ${accessToken}, 
        	// accessTokenSecret: ${accessTokenSecret}`);
        	// console.log('GET USER');
        	var user = JSON.parse(data);
        	const checkuser = client.query("SELECT count(*) FROM Member WHERE id=($1)", 
        	[user.id]);
        	checkuser.on('row', (row) => {
          		if (row.count == 0){
              		client.query("INSERT INTO Member VALUES($1, $2)", 
              		[user.id, user.fullName]);
          		}
        	});
        	// checkuser.on('end', (end) => { client.end(); });
    	});

    	// get boards
    	oauth.getProtectedResource("https://api.trello.com/1/members/me/boards", "GET", 
    	accessToken, accessTokenSecret, function(error, data, response){
      		// console.log('GET BOARDS');
      		var boards = JSON.parse(data);
      		var board_nothing = 1;
      		for (i = 0; i < boards.length; i++) {
      			client.query("INSERT INTO Board VALUES ($1, $2, $3)", 
      			[boards[i].id, boards[i].name, boards[i].shortUrl], function(err, result){
      				if (err){
            			// console.log("error: " + err);
      					board_nothing=1;
      				}
      			});
        		// get actions for the first 3 months 
        		oauth.getProtectedResource("https://api.trello.com/1/boards/" 
        		+ boards[i].id + 
        		"/actions?filter=updateCard:idList,updateCard:closed,createCard&since=" 
        		+ six_months_ago + '&before=' + three_months_ago, "GET", accessToken, accessTokenSecret, 
        		function(error, data, response){
          			// console.log('GET ACTIONS');
          			var actions = JSON.parse(data);
          			var action_nothing = 1;
          			for (i=0; i < actions.length; i++){
            			if(actions[i].type == 'createCard'){
              				client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, $5, NULL, NULL, NULL, $6, NULL, NULL, NULL, NULL)", 
              				[actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, actions[i].data.list.name, 
              				actions[i].data.list.id], function(err, result){
                				if(err){
                  					//console.log("error: " + err);
                  					action_nothing = 1;
                				}
              				});
            			}
            			else if(actions[i].type == 'updateCard'){
              				if(actions[i].data.old.closed!=null){
                				client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, NULL, NULL, NULL, $5, NULL, NULL, NULL, $6, $7)", 
                				[actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, actions[i].data.list.name, 
                				actions[i].data.list.id, actions[i].data.card.closed], function(err, result){
                  					if(err){
                    					// console.log("error: " + err);
                    					action_nothing = 1;
                  					}
                				});
              				}
              				else {
                				client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, NULL, $5, $6, NULL, NULL, $7, $8, NULL, NULL)", 
                				[actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, 
                				actions[i].data.listBefore.name, actions[i].data.listAfter.name, actions[i].data.listBefore.id, 
                				actions[i].data.listAfter.id], function(err, result){
                  					if(err){
                    					// console.log("error: " + err);
                    					action_nothing = 1;
                  					}
                				});
              				}
            			}
          			}
        		});
            // get actions for the next 3 months until present
            oauth.getProtectedResource("https://api.trello.com/1/boards/" 
            + boards[i].id + 
            "/actions?filter=updateCard:idList,updateCard:closed,createCard&since=" 
            + three_months_ago, "GET", accessToken, accessTokenSecret, 
            function(error, data, response){
                // console.log('GET ACTIONS');
                var actions = JSON.parse(data);
                var action_nothing = 1;
                for (i=0; i < actions.length; i++){
                  if(actions[i].type == 'createCard'){
                      client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, $5, NULL, NULL, NULL, $6, NULL, NULL, NULL, NULL)", 
                      [actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, actions[i].data.list.name, 
                      actions[i].data.list.id], function(err, result){
                        if(err){
                            //console.log("error: " + err);
                            action_nothing = 1;
                        }
                      });
                  }
                  else if(actions[i].type == 'updateCard'){
                      if(actions[i].data.old.closed!=null){
                        client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, NULL, NULL, NULL, $5, NULL, NULL, NULL, $6, $7)", 
                        [actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, actions[i].data.list.name, 
                        actions[i].data.list.id, actions[i].data.card.closed], function(err, result){
                            if(err){
                              // console.log("error: " + err);
                              action_nothing = 1;
                            }
                        });
                      }
                      else {
                        client.query("INSERT INTO Action VALUES ($1, $2, $3, $4, NULL, $5, $6, NULL, NULL, $7, $8, NULL, NULL)", 
                        [actions[i].id, actions[i].data.card.id, actions[i].date, actions[i].type, 
                        actions[i].data.listBefore.name, actions[i].data.listAfter.name, actions[i].data.listBefore.id, 
                        actions[i].data.listAfter.id], function(err, result){
                            if(err){
                              // console.log("error: " + err);
                              action_nothing = 1;
                            }
                        });
                      }
                  }
                }
            });
        		// get unarchived lists
        		oauth.getProtectedResource("https://api.trello.com/1/boards/" 
        		+ boards[i].id + "/lists", "GET", accessToken, accessTokenSecret, 
        		function(error, data, response){
          			// console.log('GET UNARCHIVED LISTS');
          			var lists = JSON.parse(data);
          			var list_nothing = 1;
          			for(i=0; i < lists.length; i++){
            			client.query("INSERT INTO List VALUES ($1, $2, $3, $4)", 
            			[lists[i].id, lists[i].idBoard, lists[i].name, lists[i].closed], 
            			function(err, result){ 
              				if(err){
                				// console.log("error: " + err);
                				list_nothing = 1;
              				}
            			});
            			// get unarchived cards for each list
            			oauth.getProtectedResource("https://api.trello.com/1/lists/" 
            			+ lists[i].id + "/cards?since=" + six_months_ago, "GET", 
            			accessToken, accessTokenSecret, function(error, data, response){
              				// console.log('GET UNARCHIVED CARDS');
              				var cards = JSON.parse(data);
              				var card_nothing = 1;
              				for(i=0; i < cards.length; i++){
                				if (cards[i].due == null){
                        			client.query("INSERT INTO Card VALUES ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){  
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
                				else {
                        			client.query("INSERT INTO Card VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){   
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
              				}
            			});
            			// get archived cards
            			oauth.getProtectedResource("https://api.trello.com/1/lists/" 
            			+ lists[i].id + "/cards?filter=closed&since=" + six_months_ago, 
            			"GET", accessToken, accessTokenSecret, 
            			function(error, data, response){
              				// console.log('GET ARCHIVED CARDS');
              				var cards = JSON.parse(data);
              				var card_nothing = 1;
              				for(i=0; i < cards.length; i++){
                				if (cards[i].due == null){
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){  
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
                				else {
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){  
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
              				}
            			});
          			}
        		});
        		// get archived lists
        		oauth.getProtectedResource("https://api.trello.com/1/boards/" 
        		+ boards[i].id + "/lists?filter=closed", "GET", 
        		accessToken, accessTokenSecret, function(error, data, response){
          			// console.log('GET ARCHIVED LISTS');
          			var lists = JSON.parse(data);
          			var list_nothing = 1;
          			for(i=0; i < lists.length; i++){
            			client.query("INSERT INTO List VALUES ($1, $2, $3, $4)", 
            			[lists[i].id, lists[i].idBoard, lists[i].name, lists[i].closed], 
            			function(err, result){  
              				if(err){
                				// console.log("error: " + err);
                				list_nothing = 1;
              				}
            			});
            			// get unarchived cards for each list
            			oauth.getProtectedResource("https://api.trello.com/1/lists/" 
            			+ lists[i].id + "/cards", "GET", accessToken, accessTokenSecret, 
            			function(error, data, response){
              				// console.log('GET UNARCHIVED CARDS');
              				var cards = JSON.parse(data);
              				var card_nothing = 1;
              				for(i=0; i < cards.length; i++){
                				if (cards[i].due == null){
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){    
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
                				else {
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){  
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
              				}
            			});
            			// get archived cards
            			oauth.getProtectedResource("https://api.trello.com/1/lists/" 
            			+ lists[i].id + "/cards?filter=closed", "GET", 
            			accessToken, accessTokenSecret, function(error, data, response){
              				// console.log('GET ARCHIVED CARDS');
              				var cards = JSON.parse(data);
              				var card_nothing = 1;
              				for(i=0; i < cards.length; i++){
                				if (cards[i].due == null){
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){    
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
                				else {
                  					client.query("INSERT INTO Card VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                  					[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, cards[i].dueComplete, cards[i].idBoard, 
                  					cards[i].idList, cards[i].shortUrl, cards[i].closed], function(err, result){  
                    					if(err){
                      						// console.log("error: " + err);
                      						card_nothing = 1;
                    					}
                  					});
                				}
              				}
            			});
          			}
        		});
       		}
    	});
    
  	});
  	// client.end();
};

app.get("/trelloLogin", function(request, response) {
  	console.log('GET trelloLogin');
  	login(request, response);
});

app.get("/trello", function(request, response) {
  	if (callback_check == 1){
  		console.log('GET trello callback');
  		callback(request, response);
  	}
  	response.render('trello', { title: 'Trello Report' });
});

// =================================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ***********************************
app.use('/', routes);
app.use('/trello', trello);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	var err = new Error('Not Found');
  	err.status = 404;
  	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  	app.use(function(err, req, res, next) {
    	res.status(err.status || 500);
    	res.render('error', {
      		message: err.message,
      		error: err
    	});
  	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
  	res.render('error', {
    	message: err.message,
    	error: {}
  	});
});


module.exports = app;
