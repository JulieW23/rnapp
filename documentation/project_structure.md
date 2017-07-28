# Project Structure

## app.js
   
   The main file containing server code.
   
## config.js
   Configurations for PostgreSQL, Trello and ProsperWorks.
  
## /models

   This directory contains all the code to create database tables.
   
   * /models/trello.js - creates database tables to store data from Trello.
   
   * /models/prosperworks.js - creates database tables to store data from ProsperWorks.
   
   * /models/system.js - creates table to store system account info. *login system not implemented
   
## /public

   This directory contains all the front end css and javascript code.
   
   * /public/javascripts/trello.js - main javascript for the Trello report page.
   
   * /public/javascripts/trelloController.js - AngularJS controller for the Trello report page.
   
   * /public/javascripts/pw_count_status.js - javascript for counting the number of created/won/lost/abandoned opportunities in ProsperWorks.
   
   * /public/javascripts/pw_time_distribution.js - javascript for calculating the time that opportunities spend in each stage (ProsperWorks).
   
   * /public/javascripts/prosperworksController.js - AngularJS controller for the ProsperWorks page.
   
   * /public/javascripts/shared_scripts.js - shared javascript for the Trello report page and the ProsperWorks page.
   
   * /public/stylesheets/style.css - general styling for the app.
   
   * /public/stylesheets/trello.css - styling for the Trello report page.
   
   * /public/stylesheets/prosperworks.css - styling for the ProsperWorks report page.
   
## /views

   This directory contains all the views (front end html) for this project.
   
   * /views/createAccount.ejs - create an account page *create account feature not implemented
   
   * /views/index.ejs - home page
   
   * /views/login.ejs - login page *login feature not implemented
   
   * /views/trello.ejs - Trello report page
   
   * /views/prosperworks_account.ejs - *not used. Supposed to be the page for connecting to ProsperWorks API to get/update data after the app's own login system has been implemented.
   
   * /views/prosperworks.ejs - ProsperWorks report page
   
   * /views/error.ejs - error page
   
## /routes

   This directory contains all the defined endpoints for database queries and routes for the app.
   
   * /routes/createAccount.js - renders create account page. *create account feature not implemented
   
   * /routes/index.js - renders the home page.
   
   * /routes/login.js - renders te login page. *login feature not implemented
   
   * /routes/trello.js - renders the Trello report page, and also defines endpoints for database queries for Trello data.
   
   * /routes/prosperworks.js - renders the Prosperworks page, and also defines endpoints for database queries for ProsperWorks data.
   
   * /routes/prosperworks_account.js - *not used. Renders the page for connecting to ProsperWorks API to get/update data after the app's own login system has been implemented.
   
## /login

   This directory contains all the login handling, and code for populating the database.
   
   * /login/trello_oauth.js - contains code for Trello login and putting data from Trello into the app's database.
   
   * /login/prosperworks.js - contains code for putting data from ProsperWorks API into the app's database.
   
## /tests
   This directory contains tests for the app. Instructions for running tests are in README.md
   
   * /tests/trello_tests.js - test cases for Trello data calculation. 
   
   * /tests/pw_actions_tests.js - test cases for ProsperWorks data calculation.
   
   * /tests/pw_count_tests.js - test cases for ProsperWorks data calculation.
   
   * /tests/pw_dist_calc_tests.js - test cases for ProsperWorks data calculation.
   
## /bin

   This directory contains server startup scripts. (Express auto-generated, unedited)
