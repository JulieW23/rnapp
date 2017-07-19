# Project Structure

## app.js
   
   The main file containing server code.
   It also contains the code for retrieving data from Trello etc. and storing the data into the app's own database.
  
## /models

   This directory contains all the code to create database tables.
   
   /models/trello.js - creates database tables to store data from Trello.
   
   /models/prosperworks.js - creates database tables to store data from ProsperWorks.
   
## /public

   This directory contains all the front end css and javascript code.
   
   /public/javascripts/trello.js - main javascript for the Trello report page.
   
   /public/javascripts/trelloController.js - AngularJS controller for the Trello report page.
   
   /public/javascripts/prosperworks.js - main javascript for the ProsperWorks page.
   
   /public/javascripts/prosperworksController.js - AngularJS controller for the ProsperWorks page.
   
   /public/javascripts/shared_scripts.js - shared javascript for the Trello report page and the ProsperWorks page.
   
   /public/stylesheets/style.css - general styling for the app.
   
   /public/stylesheets/trello.css - styling for the Trello report page.
   
## /views

   This directory contains all the views (front end html) for this project.
   
   /views/index.ejs - home page
   
   /views/trello.ejs - Trello report page
   
   /views/prosperworks.ejs - ProsperWorks page
   
   /views/error.ejs - error page
   
## /routes

   This directory contains all the defined endpoints for database queries and routes for the app.
   
   /routes/index.js - renders the home page.
   
   /routes/trello.js - renders the Trello report page, and also defines endpoints for database queries for Trello data.
   
   /routes/prosperworks.js - renders the Prosperworks page, and also defines endpoints for database queries for ProsperWorks data.
   
## /login

   This directory contains all the login handling, and code for populating the database.
   
   /login/trello_oauth.js - contains code for Trello login and putting data from Trello into the app's database.
   
   /login/prosperworks.js - contains code for putting data from ProsperWorks into the app's database.
   
## /tests
   This directory contains tests for the app.
   
   /tests/trello_tests.js - test cases for data calculation.
   
   * After creating the database tables (by running "node models/trello.js), the data for the test cases can be inserted into the database by running the command "node tests/trello_tests.js". 
   
   * The expected calculation results are in the file trello_tests_results.txt
   
   * Go to http://localhost:3000/trello?oauth_token=accesstoken1 to use the app with the inserted test data.
   
## /bin

   This directory contains server startup scripts. (Express auto-generated, unedited)
