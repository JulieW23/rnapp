var config = require("../config.js");
var OAuth = require('oauth').OAuth
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const pg = require('pg');
const {Client, Query} = require('pg');
var url = require('url');
var http = require('http');
var async = require('async');

var addMonths = function(date, months){
	date.setMonth(date.getMonth() + months);
	return date;
}

var trelloRequestURL = "https://trello.com/1/OAuthGetRequestToken";
var trelloAccessURL = "https://trello.com/1/OAuthGetAccessToken";
var trelloAuthorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
var appName = "rnapp";

var trelloKey = config.trelloKey;
var trelloSecret = config.trelloSecret;

var trelloLoginCallback = config.trelloLoginCallback + "/trello";

var trello_oauth_secrets = {trellotoken: "tokenSecret"};

var connectionString = "postgres://" + config.databaseUser + ":" 
  + config.databasePassword + "@" + config.databaseHost + ":" 
  + config.databasePort + "/" + config.databaseName;

var client = new pg.Client(connectionString);

var oauth = new OAuth(trelloRequestURL, trelloAccessURL, 
trelloKey, trelloSecret, "1.0A", trelloLoginCallback, "HMAC-SHA1");

var present = new Date();
var two_years_ago = addMonths(new Date(), -24).toISOString();
// twentyone_months_ago: addMonths(present, -21).toISOString(),
var twenty_months_ago = addMonths(new Date(), -20).toISOString();
// eighteen_months_ago: addMonths(present, -18).toISOString(),
var sixteen_months_ago = addMonths(new Date(), -16).toISOString();
// fifteen_months_ago: addMonths(present, -15).toISOString(),
var one_year_ago = addMonths(new Date(), -12).toISOString();
// nine_months_ago: addMonths(present, -9).toISOString(),
var eight_months_ago = addMonths(new Date(), -8).toISOString();
var six_months_ago = addMonths(new Date(), -6).toISOString();
var four_months_ago = addMonths(new Date(), -4).toISOString();
var one_month_ago = addMonths(new Date(), -1).toISOString();

getActionsHelper = function(filter, boardID, accessToken, accessTokenSecret){
  //console.log("https://api.trello.com/1/batch/?urls=/boards/" + boardID 
  // + "/actions?limit=1000&filter=" + filter + "&since=" + two_years_ago 
  // + "&before" + one_year_ago + ",boards/" + boardID 
  // + "/actions?limit=1000&filter=" + filter + "&since=" + one_year_ago);
  // oauth.getProtectedResource("https://api.trello.com/1/batch/?urls=/boards/" 
  // + boardID + "/actions?limit=1000&filter=" + filter + "&since=" 
  // + two_years_ago + "&before" + one_year_ago + ",boards/" + boardID 
  // + "/actions?limit=1000&filter=" + filter + "&since=" + one_year_ago, 
  //   "GET", accessToken, accessTokenSecret, function(error, data, response){

  oauth.getProtectedResource("https://api.trello.com/1/boards/" 
  + boardID + "/actions?limit=1000&filter=" + filter, "GET", accessToken, 
  accessTokenSecret, function(error, data, response){
    //console.log('actions since ' + since + 'until ' + before);
    // console.log('GET ACTIONS');
    var actions = JSON.parse(data);
    var action_nothing = 1;
    for (i=0; i < actions.length; i++){
      if(actions[i].type == 'createCard'){
        // console.log('card created: "' + actions[i].data.card.name 
        // + '" in list: "' + actions[i].data.list.name + '" at time: ' 
        // + actions[i].date);
        client.query("INSERT INTO Action VALUES \
        ($1, $2, $3, $4, $5, NULL, NULL, NULL, $6, NULL, NULL, NULL, NULL)", 
        [actions[i].id, actions[i].data.card.id, actions[i].date, 
        actions[i].type, actions[i].data.list.name, 
        actions[i].data.list.id], function(err, result){
          if(err){
            // console.log("error: " + err);
            action_nothing = 1;
          }
        });
      }
      else if(actions[i].type == 'updateCard'){
        if(actions[i].data.old.closed!=null){
          client.query("INSERT INTO Action VALUES \
          ($1, $2, $3, $4, NULL, NULL, NULL, $5, NULL, NULL, NULL, $6, $7)", 
          [actions[i].id, actions[i].data.card.id, actions[i].date, 
          actions[i].type, actions[i].data.list.name, actions[i].data.list.id, 
          actions[i].data.card.closed], function(err, result){
            if(err){
              //console.log("error: " + err);
              action_nothing = 1;
            }
          });
        }
        else {
          //console.log('card moved: "' + actions[i].data.card.name 
          // + '" from: "' + actions[i].data.listBefore.name + '" to: "' 
          // + actions[i].data.listAfter.name + '"');
          client.query("INSERT INTO Action VALUES \
          ($1, $2, $3, $4, NULL, $5, $6, NULL, NULL, $7, $8, NULL, NULL)", 
          [actions[i].id, actions[i].data.card.id, actions[i].date, 
          actions[i].type, actions[i].data.listBefore.name, 
          actions[i].data.listAfter.name, actions[i].data.listBefore.id, 
          actions[i].data.listAfter.id], function(err, result){
            if(err){
              //console.log("error: " + err);
              action_nothing = 1;
            }
          });
        }
      }
    }
  });
};

module.exports = {
	callback_check: 0,

	login: function(req, res) {
    this.callback_check = 1;
		oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
			// console.log(`in getOAuthRequestToken - token: ${token}, 
			// tokenSecret: ${tokenSecret}, resultes ${JSON.stringify(results)}, 
			// error: ${JSON.stringify(error)}`);
			trello_oauth_secrets.trellotoken = tokenSecret;
			
			console.log(res);
			res.redirect(`${trelloAuthorizeURL}?oauth_token=${token}&name=${appName}`);
		});
	},

	callback: function(request, response) {
		this.callback_check = 2;
		const query = url.parse(request.url, true).query;
    console.log(query);
		const token = query.oauth_token;
		const tokenSecret = trello_oauth_secrets.trellotoken;
		const verifier = query.oauth_verifier;
		oauth.getOAuthAccessToken(token, tokenSecret, verifier, 
		function(error, accessToken, accessTokenSecret, results){
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
      	const checkuser = client.query(new Query(
          "SELECT count(*) FROM Member WHERE id=($1)", [user.id]));
      	checkuser.on('row', (row) => {
        		if (row.count == 0){
            		client.query("INSERT INTO Member VALUES($1, $2)", 
            		[user.id, user.fullName]);
        		}
      	});
      	// checkuser.on('end', (end) => { 
       //    done();
       //  });
  		});

  		// get boards
  		oauth.getProtectedResource("https://api.trello.com/1/members/me/boards", 
      "GET", accessToken, accessTokenSecret, function(error, data, response){
    		// console.log('GET BOARDS');
    		var boards = JSON.parse(data);
    		var board_nothing = 1;
    		for (i = 0; i < boards.length; i++) {
          // console.log(boards[i]);
          var memberships = [];
          for (j = 0; j < boards[i].memberships.length; j++){
            memberships.push(boards[i].memberships[j].idMember);
            // console.log(memberships);
          }

    			client.query("INSERT INTO Board VALUES ($1, $2, $3, $4)", 
    			[boards[i].id, boards[i].name, boards[i].shortUrl, memberships], 
          function(err, result){
    				if (err){
          		// console.log("error: " + err);
    					board_nothing=1;
    				}
    			});

          // get actions
          getActionsHelper("createCard", boards[i].id, accessToken, 
            accessTokenSecret);
          getActionsHelper("updateCard:idList", boards[i].id, accessToken, 
            accessTokenSecret);
          getActionsHelper("updateCard:closed", boards[i].id, accessToken, 
            accessTokenSecret);

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
          		+ lists[i].id + "/cards?since=" + two_years_ago, "GET", 
          		accessToken, accessTokenSecret, function(error, data, response){
            		// console.log('GET UNARCHIVED CARDS');
            		var cards = JSON.parse(data);
            		var card_nothing = 1;
            		for(i=0; i < cards.length; i++){
                  // console.log("card name:" + cards[i].name);
              		if (cards[i].due == null){
                    client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                		[cards[i].id, cards[i].name, cards[i].desc, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){  
                  		if(err){
                    		// console.log("error: " + err);
                    		card_nothing = 1;
                  		}
                		});
              		}
              		else {
                    client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                		[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){   
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
          		+ lists[i].id + "/cards?filter=closed&since=" + two_years_ago, 
          		"GET", accessToken, accessTokenSecret, 
          		function(error, data, response){
            		// console.log('GET ARCHIVED CARDS');
                // console.log(data);
            		var cards = JSON.parse(data);
            		var card_nothing = 1;
            		for(i=0; i < cards.length; i++){
                  //console.log("card name:" + cards[i].name);
              		if (cards[i].due == null){
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                		[cards[i].id, cards[i].name, cards[i].desc, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){  
                  		if(err){
                    		// console.log("error: " + err);
                    		card_nothing = 1;
                  		}
                		});
              		}
              		else {
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                		[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){  
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
          		+ lists[i].id + "/cards?since=" + two_years_ago, "GET", 
              accessToken, accessTokenSecret, function(error, data, response){
            		// console.log('GET UNARCHIVED CARDS');
            		var cards = JSON.parse(data);
            		var card_nothing = 1;
            		for(i=0; i < cards.length; i++){
                	//console.log("card name:" + cards[i].name);
              		if (cards[i].due == null){
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                		[cards[i].id, cards[i].name, cards[i].desc, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){    
                  		if(err){
                    		// console.log("error: " + err);
                    		card_nothing = 1;
                  		}
                		});
              		}
              		else {
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                		[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){  
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
          		+ lists[i].id + "/cards?filter=closed&since=" + two_years_ago, "GET", 
          		accessToken, accessTokenSecret, function(error, data, response){
            		// console.log('GET ARCHIVED CARDS');
            		var cards = JSON.parse(data);
            		var card_nothing = 1;
            		for(i=0; i < cards.length; i++){
                	//console.log("card name:" + cards[i].name);
              		if (cards[i].due == null){
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, NULL, $4, $5, $6, NULL, $7, $8)", 
                		[cards[i].id, cards[i].name, cards[i].desc, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){    
                  		if(err){
                    		// console.log("error: " + err);
                    		card_nothing = 1;
                  		}
                		});
              		}
              		else {
                		client.query("INSERT INTO Card VALUES \
                    ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)", 
                		[cards[i].id, cards[i].name, cards[i].desc, cards[i].due, 
                    cards[i].dueComplete, cards[i].idBoard, cards[i].idList, 
                    cards[i].shortUrl, cards[i].closed], function(err, result){  
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
	}
}
