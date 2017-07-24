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

// CAN HAVE JUST ONE SET OF OPTIONS
// JUST CHANGE METHOD TO 'GET'/'POST' WHEN USING IT

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
	options.url = 
	'https://api.prosperworks.com/developer_api/v1/pipeline_stages';
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var stages = JSON.parse(body);
			//console.log(stages);
			async.eachSeries(stages, function(stage, done){
				pool.query("INSERT INTO PipelineStage VALUES ($1, $2, $3, $4)",
				[stage.id, stage.name, stage.pipeline_id, 
				stage.win_probability], function(err, result){
					if(err){
						if (err = 'error: duplicate key value violates \
						unique constraint "pipelinestage_pkey"'){
							pool.query("UPDATE PipelineStage SET name($1), \
							pipeline_id=($2), win_probability=($3) WHERE \
							id=($4)", [stage.name, stage.pipeline_id, 
							stage.win_probability, stage.id], 
							function(err, result){
								if(err){ nothing = 1; }
							});
						}
						//console.log("error: " + err);
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
						if (err = 'error: duplicate key value violates \
						unique constraint "lossreason_pkey"'){
							pool.query("UPDATE LossReason SET name=($1) \
							WHERE id=($2)", [reason.name, reason.id], 
							function(err, result){
								if(err){ nothing = 1; }
							});
						}
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
				opportunity.company_id, opportunity.company_name, 
				opportunity.details, opportunity.loss_reason_id, 
				opportunity.monetary_value, opportunity.pipeline_id, 
				opportunity.priority, opportunity.pipeline_stage_id, 
				opportunity.status, opportunity.win_probability, date_created], 
				function(err, result){
					if(err){
						if (err = 'error: duplicate key value violates \
						unique constraint "opportunity_pkey"'){
							pool.query("UPDATE Opportunity SET name=($1), \
							assignee_id=($2), company_id=($3), \
							company_name=($4), details=($5), \
							loss_reason_id=($6), monetary_value=($7), \
							pipeline_id=($8), priority=($9), \
							pipeline_stage_id=($10), status=($11), \
							win_probability=($12) WHERE id=($13)", 
							[opportunity.name, opportunity.assignee_id, 
							opportunity.company_id, opportunity.company_name, 
							opportunity.details, opportunity.loss_reason_id, 
							opportunity.monetary_value, 
							opportunity.pipeline_id, opportunity.priority, 
							opportunity.pipeline_stage_id, opportunity.status, 
							opportunity.win_probability, opportunity.id], 
							function(err, result){
								if(err){ nothing = 1; }
							});
						}
						//console.log("error: " + err);
						nothing = 1;
					}
					// store an incomplete created opportunity action
					var created_act_id = 'c' + opportunity.id;
					pool.query("INSERT INTO PWAction VALUES \
					($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, \
					NULL, NULL, NULL, NULL, NULL)", [created_act_id, 
					'Created', opportunity.id, 'opportunity', date_created], 
					function(err, result){
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
	options.url = 
	'https://api.prosperworks.com/developer_api/v1/activity_types';
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
	options.url = 
	'https://api.prosperworks.com/developer_api/v1/activity_types';
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
					($1, $2, $3, $4, $5, NULL, $6, $7, NULL, NULL, \
					$8, $9, NULL, NULL, NULL)", 
					[activity.id, activity.type.name, activity.parent.id, 
					activity.parent.type, activity_date, 
					activity.old_value.name, activity.new_value.name, 
					activity.old_value.id, activity.new_value.id], 
					function(err, result){
						if(err){
							//console.log("error: " + err);
							//done();
							nothing = 1;
						}
						done();
					}); // end of insert action query
				}

				// DATA CALCULATION SECTION
				
				else if (activity.type.name == 'Status Change'){
					var query_statement;
					var query_array = [activity.id, activity.type.name, 
					activity.parent.id, activity.parent.type, activity_date, 
					activity.new_value];
					if (activity.old_value == 'Open' || 
					activity.new_value == 'Open'){
						query_statement = 'INSERT INTO PWAction VALUES \
						($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, \
						NULL, NULL, NULL, $6, $7)';
						if (activity.old_value == 'Open'){
							query_array.push('t');
						}
						else{
							query_array.push('f');
						}
					}
					else{
						query_statement = 'INSERT INTO PWAction VALUES \
						($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, \
						NULL, NULL, NULL, $6, NULL)';
					}
					pool.query(query_statement, query_array, 
					function(err, result){
						if(err){
							//console.log("error: " + err);
							///done();
							nothing = 1;
						}
						done();
					}); // end of insert action query
				} // end of else if
				else{
					done();
				}
			}, function(err){
				completeActivities();
			}); // end of async.eachSeries
		} // end of if request for prosperworks activities is successful
	}); // end of get activity request
} // end of storePWActivities()

// completes activities in our database that are missing pipeline_stage_id
// called by storePSActivities()
function completeActivities(){
	// store all actions for all opportunities after all the missing
	// locations have been filled in
	var all_actions = [];
	// total number of opportunities in the database, used to check 
	// whether all missing locations have been filled in so that 
	// the database can be updated 
	var num_opportunities;
	// get all opportunities from database
	pool.query("SELECT id, pipeline_stage_id FROM Opportunity", 
	function(err, result){
		num_opportunities = result.rows.length;
		// for each opportunity
		async.eachSeries(result.rows, function(opportunity, done){
			// get all actions for this opportunity ordered by date
			pool.query("SELECT * FROM PWAction WHERE opportunity_id=($1) \
			order by date", [opportunity.id], function(err1, result1){
				if(err){
					nothing=1;
				}

				var actions = [];
				// store all the actions in var actions[]
				async.eachSeries(result1.rows, function(action, done1){
					actions.push(action);
					done1();
					// the following code fills in all of the missing 
					// locations in var actions[]
				}, function(err1){
					// keeps track of the current state in the automata
					var state;
					// put var actions[] through the automata
					// view automata figure here:
					// https://docs.google.com/drawings/d/1yZhhx8YAf4SFJMBt63Npn1v9o00IoAK8Y55h56gFUlI/edit?usp=sharing
					for(i = 0; i < actions.length; i++){

						if(actions[i].type == 'Created'){
							state = 'c1';
						}

						else if (state == 'c1' && 
						actions[i].type == 'Status Change'){
							state = 'c2';
						}

						else if (state == 'c1' && 
						actions[i].type == 'Stage Change'){
							state = 'c3';
							actions[i-1].stagecreated = actions[i].stagebefore;
							actions[i-1].stagecreatedid = 
							actions[i].stagebeforeid;
						}

						else if (state == 'c2' &&
						actions[i].type == 'Stage Change'){
							state = 'c3';
							for (j = 0; j < i; j++){
								if (actions[j].type == 'Created'){
									actions[j].stagecreated = 
									actions[i].stagebefore;
									actions[j].stagecreatedid = 
									actions[i].stagebeforeid;
								}
								else if (actions[j].type == 'Status Change'){
									actions[j].stageclosed = 
									actions[i].stagebefore;
									actions[j].stageclosedid = 
									actions[i].stagebeforeid;
								}
							}
						}

						else if (state == 'c3' && 
						actions[i].type == 'Status Change'){
							state = 'c4';
							actions[i].stageclosed = actions[i-1].stageafter;
							actions[i].stageclosedid = 
							actions[i-1].stageafterid;
						}

						else if (state == 'c4' && 
						actions[i].type == 'Status Change'){
							state = 'c4';
							actions[i].stageclosed = actions[i-1].stageclosed;
							actions[i].stageclosedid = 
							actions[i-1].stageclosedid;
						}

						else if (state == 'c4' &&
						actions[i].type == 'Stage Change'){
							state = 'c3';
						}
					}
					if(state == 'c1' || state == 'c2'){
						var curr_location = opportunity.pipeline_stage_id;
						for (k = 0; k < actions.length; k++){
							if (actions[k].type == 'Created'){
								actions[k].stagecreatedid = curr_location;
							}
							else if (actions[k].type == 'Status Change'){
								actions[k].stageclosedid = curr_location;
							}
						}
					}
					// put var actions[] into var all_actions[], which will be
					// used to update the database records
					all_actions.push(actions);
					// update database records
					if (all_actions.length == num_opportunities){
						async.eachSeries(all_actions, 
						function(action_list, done2){
							async.eachSeries(action_list, 
							function(action1, done3){
								if (action1.type == 'Created'){
									pool.query("UPDATE PWAction SET \
									stagecreated=($1), stagecreatedid=($2) \
									WHERE id=($3)", [action1.stagecreated, 
									action1.stagecreatedid, action1.id], 
									function(err, res){
										if(err){ 
											// console.log(err);
											nothing = 1; 
										}
										done3();
									});
								}
								else if (action1.type == 'Status Change'){
									pool.query("UPDATE PWAction SET \
									stageclosed=($1), stageclosedid=($2) \
									WHERE id=($3)", [action1.stageclosed, 
									action1.stageclosedid, action1.id], 
									function(err, res){
										if(err){ 
											nothing = 1;
											// console.log(err);
										}
										done3();
									});
								}
								else{ done3(); }
							}, function(err){ done2(); });
						});
					} // end of updating database (if)
				}); // end of filling in missing locations (async each action)
			}); // end of get all actions for a specific opportunity from db
			done();
		}); // end of for each opportunity (async)
	}); // end of get all opportunities from database
} // end of completeActivities()


module.exports = {
	// function that stores account, members, companies and pipelines 
	// asynchronously,and then calls other functions to store other data in a 
	// specific order (because of database table definitions, some columns of 
	// later tables reference previous table columns, so the previous table's 
	// data must be stored first)
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
            			// if record already exists ,update it
            			if (err = 'error: duplicate key value violates unique \
            			constraint "pwaccount_pkey"'){
            				pool.query("UPDATE PWAccount SET name=($1)", 
            				[account.name], function(err, result){
            					if(err){ nothing = 1; }
            				});
            			}
              			//console.log("error: " + err);
              			nothing = 1;
            		}
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
							// update
							if (err = 'error: duplicate key value violates \
							unique constraint "pwmember_pkey"'){
								pool.query("UPDATE PWMember SET name=($1), \
								email=($2) WHERE id=($3)", 
								[user.name, user.email, user.id], 
								function(err, result){
									if(err){ nothing = 1; }
								});
							}
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
					var address = company.address.street + ", " 
					+ company.address.city + ", " + company.address.state 
					+ ", " + company.address. country + ", " 
					+ company.address.postal_code;
					pool.query("INSERT INTO Company VALUES ($1, $2, $3, $4)", 
					[company.id, company.name, address, company.details], 
					function(err, result){
						if(err){
							if (err = 'error: duplicate key value violates \
							unique constraint "company_pkey"'){
								pool.query("UPDATE Company SET name=($1), \
								address=($2), details=($3) WHERE id=($4)", 
								[company.name, address, company.details, 
								company.id], function(err, result){
									if(err){ nothing = 1; }
								});
							}
							//console.log("error: " + err);
							nothing = 1;
						}
						done();
					});
				});
			}
		});
		// store pipelines
		options.url = 
		'https://api.prosperworks.com/developer_api/v1/pipelines';
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
							if (err = 'error: duplicate key value violates \
							unique constraint "pipeline_pkey"'){
								pool.query("UPDATE Pipeline SET name=($1), \
								stages=($2) WHERE id=($3)", [pipeline.name, 
								pipeline_stages, pipeline.id], 
								function(err, result){
									if(err){ nothing = 1; }
								});
							}
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
