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

// CAN HAVE JUST ONE SET OF OPTIONS, JUST CHANGE METHOD TO 'GET'/'POST' WHEN USING IT

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

// stores pipeline stages, called by storeData()
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
			}, function(err){
				storeLossReason();
			});
		}
	});
}

// stores loss reason, called by storePipelineStages()
function storeLossReason(){
	options.url = 'https://api.prosperworks.com/developer_api/v1/loss_reasons';
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var reasons = JSON.parse(body);
			async.eachSeries(reasons, function(reason, done){
				pool.query("INSERT INTO LossReason VALUES ($1, $2)", 
				[reason.id, reason.name], function(err, result){
					if(err){
						//console.log("error: " + err);
						nothing = 1;
					}
					done();
				});
			}, function(err){
				storeOpportunities();
			});
		}
	});
}

// stores opportunities, called by storeLossReason()
function storeOpportunities(){
	post_options.url = 
	'https://api.prosperworks.com/developer_api/v1/opportunities/search';
	request(post_options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var opportunities = JSON.parse(body);
			async.eachSeries(opportunities, function(opportunity, done){
				var date_created = 
				new Date(opportunity.date_created * 1000).toISOString();
				pool.query("INSERT INTO Opportunity VALUES \
				($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
				[opportunity.id, opportunity.name, opportunity.assignee_id, 
				opportunity.company_id, opportunity.company_name, opportunity.details, 
				opportunity.loss_reason_id, opportunity.monetary_value, 
				opportunity.pipeline_id, opportunity.priority, 
				opportunity.pipeline_stage_id,opportunity.status, 
				opportunity.win_probability, date_created], function(err, result){
					if(err){
						//console.log("error: " + err);
						nothing = 1;
					}
					// store an incomplete created opportunity action
					var created_act_id = 'c' + opportunity.id;
					pool.query("INSERT INTO PWAction VALUES \
					($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, \
					NULL, NULL)", [created_act_id, 'Created', opportunity.id, 
					'opportunity', date_created], function(err, result){
						if(err){
							//console.log("error: " + err);
							nothing = 1;
						}
						done();
					});
				});
			}, function(err){
				// getActivityTypes();
				getWantedActivityTypes();
			});
		}
	});
}

// testing helper to get activity types, called by storeOpportunities()
function getActivityTypes(){
	options.url = 'https://api.prosperworks.com/developer_api/v1/activity_types';
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var types = JSON.parse(body);
			async.eachSeries(types, function(type, done){
				console.log(type);
				done();
			});
		}
	});
}

// RELEVANT ACTIVITY TYPES: 'Pipeline Stage Changed', 'Property Changed'

// place to store the activity types that are wanted
var wanted = {
	activity_types: []
};

// get wanted activity types, called by storeOpportunities()
function getWantedActivityTypes(){
	// get all activity types in account
	options.url = 'https://api.prosperworks.com/developer_api/v1/activity_types';
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var types = JSON.parse(body);
			// store activity types that are wanted in format: 
			// { "category": "", "id": "" }
			async.eachSeries(types.system, function(type, done){
				if(type.name == 'Pipeline Stage Changed' || 
				type.name == 'Property Changed'){
					var push_value = {
						category: type.category,
						id: type.id
					};
					wanted.activity_types.push(push_value);
				}
				done();
			}, function(err){
				//logActivities();
				storePWActivities();
			});
		}
	});
}

// testing helper to log activities fetched from prosperworks, 
// called by getWantedActivityTypes()
function logActivities(){
	console.log(wanted);
	post_options.url = 
	'https://api.prosperworks.com/developer_api/v1/activities/search';
	post_options.body = JSON.stringify(wanted);
	request(post_options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var activities = JSON.parse(body);
			console.log(activities);
		}
	});
}

// helper function for sorting activities from prosperwork by activity_date
function compareFunction(a, b){
	if(a.activity_date < b.activity_date){
		return -1;
	}
	if (a.activity_date > b.activity_date){
		return 1;
	}
	return 0;
}

// store activities, called by getWantedActivityTypes()
function storePWActivities(){
	//console.log(wanted);
	// get (post search for) the activities
	post_options.url = 
	'https://api.prosperworks.com/developer_api/v1/activities/search';
	post_options.body = JSON.stringify(wanted);
	request(post_options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var activities = JSON.parse(body);
			// sort activities by activity_date
			activities.sort(compareFunction);
			// store the activities
			async.eachSeries(activities, function(activity, done){
				var activity_date = 
				new Date(activity.activity_date * 1000).toISOString();
				if (activity.type.name == "Stage Change"){
					pool.query("INSERT INTO PWAction VALUES \
					($1, $2, $3, $4, $5, NULL, $6, $7, NULL, NULL, $8, $9, NULL, NULL)", 
					[activity.id, activity.type.name, activity.parent.id, 
					activity.parent.type, activity_date, activity.old_value.name, 
					activity.new_value.name, activity.old_value.id, 
					activity.new_value.id], function(err, result){
						if(err){
							//console.log("error: " + err);
							done();
						}
						else{
							// check if this is the first time that the opportunity moved
							pool.query("SELECT * FROM PWAction WHERE \
							opportunity_id=($1) order by date", 
							[activity.parent.id], function(err, result){
								if(err){
									//console.log("error: " + err);
									nothing = 1;
								}
								// if it is the first time that this opportunity moved
								if (result.rows.length == 2 && result.rows[0].type == 'Created'){
									// we can now deduce which stage the opportunity
									// was created in, so we can complete the 'Created' 
									// action for this opportunity
									pool.query("UPDATE PWAction SET stagecreated=($1), \
									stagecreatedid=($2) where opportunity_id=($3) \
									and type='Created'", [activity.old_value.name, 
									activity.old_value.id, activity.parent.id], 
									function(err, result){
										if(err){
											//console.log("error: " + err);
											nothing = 1;
										}
										done();
									});
								}
								else{
									done();
								}
							}); // end of select query
						}
					}); // end of insert action query
				}
				// NEED TO KEEP RECORD OF ALL STATUS CHANGES
				// BUT THIS WILL AFFECT THE ASSUMPTION THAT ROWS ARE ALWAYS
				// ALTERNATING BETWEEN ENTERING AND EXITING IN THE
				// DATA CALCULATION SECTION
				
				// else if (activity.type.name == 'Status Change'){
				// 	pool.query("INSERT INTO PWAction VALUES \
				// 	($1, $2, $3, $4, $5, NULL, NULL, NULL, $6, NULL, NULL, NULL, $7, $8)", 
				// 	[activity.id, activity.type.name, activity.parent.id, 
				// 	activity.parent.type, activity_date, ??????], function(err, result){
				// 		if(err){
				// 			//console.log("error: " + err);
				// 			done();
				// 		}
				// 		else{
				// 			// check if this is the first time that the opportunity moved
				// 			pool.query("SELECT * FROM PWAction WHERE \
				// 			opportunity_id=($1) order by date", 
				// 			[activity.parent.id], function(err, result){
				// 				if(err){
				// 					//console.log("error: " + err);
				// 					nothing = 1;
				// 				}
				// 				// if it is the first time that this opportunity moved
				// 				if (result.rows.length == 2 && result.rows[0].type == 'Created'){
				// 					// we can now deduce which stage the opportunity
				// 					// was created in, so we can complete the 'Created' 
				// 					// action for this opportunity
				// 					pool.query("UPDATE PWAction SET stagecreated=($1), \
				// 					stagecreatedid=($2) where opportunity_id=($3) \
				// 					and type='Created'", [activity.old_value.name, 
				// 					activity.old_value.id, activity.parent.id], 
				// 					function(err, result){
				// 						if(err){
				// 							//console.log("error: " + err);
				// 							nothing = 1;
				// 						}
				// 						done();
				// 					});
				// 				}
				// 				else{
				// 					done();
				// 				}
				// 			}); // end of select query
				// 		}
				// 	}); // end of insert action query
				// } // end of else if
				else{
					done();
				}
			}); // end of async.eachSeries
		} // end of if request for prosperworks activities is successful
	}); // end of get activity request
} // end of storePWActivities()


module.exports = {
	// function that stores account, members, companies and pipelines asynchronously,
	// and then calls other functions to store other data in a specific order
	// (because of database table definitions, some columns of later tables reference 
	// previous table columns, so the previous table's data must be stored first)
	storeData: function(){
		// store account
		options.url = 'https://api.prosperworks.com/developer_api/v1/account';
		request(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				var account = JSON.parse(body);
				//console.log(account);
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
			 	//console.log(users);
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
		post_options.url = 
		'https://api.prosperworks.com/developer_api/v1/companies/search';
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
