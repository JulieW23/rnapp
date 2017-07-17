var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const pg = require('pg');
var url = require('url');
var http = require('http');
var async = require('async');
var request = require('request');
var config = require("../config.js");

var nothing = 1;

var pool = new pg.Pool({
  database: config.databaseName,
  user: config.databaseUser,
  password: config.databasePassword,
  port: config.databasePort,
  host: config.databaseHost
});

// GET options
var options = {
	url: '',
	method: 'GET',
	headers: {
		"Content-Type": "application/json",
		"X-PW-AccessToken": config.pw_api_key,
		"X-PW-Application": "developer_api",
		"X-PW-UserEmail": config.pw_email
	}
}

// POST options
var post_options = {
	url: '',
	method: 'POST',
	headers: {
		"Content-Type": "application/json",
		"X-PW-AccessToken": config.pw_api_key,
		"X-PW-Application": "developer_api",
		"X-PW-UserEmail": config.pw_email
	}
}

function storePipelineStages(){
	options.url = 'https://api.prosperworks.com/developer_api/v1/pipeline_stages';
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var stages = JSON.parse(body);
			//console.log(stages);
			async.eachSeries(stages, function(stage, done){
				pool.query("INSERT INTO PipelineStage VALUES ($1, $2, $3, $4)",
				[stage.id, stage.name, stage.pipeline_id, stage.win_probability], 
				function(err, result){
					if(err){
						//conosle.log("error: " + err);
						nothing = 1;
					}
					done();
				});
			});
		}
	});
}

// STORE LOSE_REASON BEFORE STORE OPPORTUNITIES
// FIX DATABASE WITH REFERENCES TO OTHER TABLES

// function storeOpportunities(){
// 	post_options.url = 'https://api.prosperworks.com/developer_api/v1/opportunities/search';
// 	request(post_options, function(error, response, body){
// 		if(!error && response.statusCOde == 200){
// 			var opportunities = JSON.parse(body);
// 			async.eachSeries(opportunities, function(opportunity, done){
// 				pool.query("INSERT INTO Opportunity VALUES \
// 				($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
// 				[opportunity.id, opportunity.name, opportunity.assignee_id, 
// 				opportunity.company_id, opportunity.company_name, opportunity.details, 
// 				opportunity.loss_reason_id, opportunity.monetary_value, 
// 				opportunity.pipeline_id, opportunity.priority, opportunity.pipeline_stage,
// 				opportunity.status, opportunity.win_probability, opportunity.date_created],
// 				function(err, result){
// 					if(err){
// 						//console.log("error: " + err);
// 						nothing = 1;
// 					}
// 				});
// 			});
// 		}
// 	});
// }

module.exports = {
	storeData: function(){
		// store account
		options.url = 'https://api.prosperworks.com/developer_api/v1/account';
		request(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				var account = JSON.parse(body);
				console.log(account);
				pool.query("INSERT INTO PWAccount VALUES ($1, $2)", 
          		[account.id, account.name], function(err, result){
            		if(err){
              			//console.log("error: " + err);
              			nothing = 1;
            		}
            		// storeMembers();
          		});
			}
		});
		// store members
		options.url = 'https://api.prosperworks.com/developer_api/v1/users';
		request(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				var users = JSON.parse(body);
			 	console.log(users);
			 	async.eachSeries(users, function(user, done){
					pool.query("INSERT INTO PWMember VALUES ($1, $2, $3)", 
					[user.id, user.name, user.email], function(err, result){
						if(err){
							//console.log("error: " + err);
              				nothing = 1;
						}
						done();
					});
				});
			}
		});
		// store companies
		post_options.url = 'https://api.prosperworks.com/developer_api/v1/companies/search';
		request(post_options, function(error, response, body){
			if(!error && response.statusCode == 200){
				var companies = JSON.parse(body);
				//console.log(companies);
				async.eachSeries(companies, function(company, done){
					//console.log(company);
					var address = company.address.street + ", " + company.address.city 
					+ ", " + company.address.state + ", " + company.address. country 
					+ ", " + company.address.postal_code;
					pool.query("INSERT INTO Company VALUES ($1, $2, $3, $4)", 
					[company.id, company.name, address, company.details], 
					function(err, result){
						if(err){
							// console.log("error: " + err);
							nothing = 1;
						}
						done();
					});
				});
			}
		});
		// store pipelines
		options.url = 'https://api.prosperworks.com/developer_api/v1/pipelines';
		request(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				var pipelines = JSON.parse(body);
				//console.log(pipelines);
				async.eachSeries(pipelines, function(pipeline, done){
					//console.log(pipeline);
					var pipeline_stages = [];
					for(i = 0; i < pipeline.stages.length; i++){
						pipeline_stages.push(pipeline.stages[i].id);
					}
					pool.query("INSERT INTO Pipeline VALUES ($1, $2, $3)", 
					[pipeline.id, pipeline.name, pipeline_stages], 
					function(err, result){
						if(err){
							//console.log("error: " + err);
							nothing = 1;
						}
						done();
					});
				}, function(err){
					storePipelineStages();
				});
			}
		});
	} // end of storeData function
} // end of module.exports

