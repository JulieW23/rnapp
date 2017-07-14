# rnapp

## Dependencies
* npm - https://www.npmjs.com/
* Node.js - https://nodejs.org/en/
* PostgreSQL - https://www.postgresql.org/
* All other dependencies are listed in package.json can be installed by running the command `npm install` in the root directory of this project.

## Setup
* Create a database in PostgreSQL named 'rapidnovordb'. This can be done in the PostgreSQL shell with the command `create database rapidnovordb;` 

* Edit config.js
   
   
* In the root directory of the project, run commands

   `npm install` to install dependencies, then 
   
   `node /models/trello.js` to create the database tables, then
   
   `npm start` to start the server
   
## Running Tests
### Trello Tests
The test cases in tests/trello_tests.js test to see if data is correctly calculated and displayed in the app.
* Make sure database tables are created. Database tables for Trello data can be created by running the command 

   `node models/trello.js`

* Insert the data for the test cases with the command

   `node tests/trello_tests.js`

* Start the server with the command

   `npm start`

* The expected calculation results are in the file trello_tests_results.txt

* Go to http://localhost:3000/trello?oauth_token=accesstoken1 to use the app with the inserted test data and compare the displayed information with the expected results.

