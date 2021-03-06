# rnapp
rnapp is a web application that is integrated with Trello and ProsperWorks APIs. It displays information about your account's activity in order to track productivity. 

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
   
   `make tables` to create all database tables
   
   `npm start` to start the server
 
## [Project Structure](https://github.com/JulieW23/rnapp/blob/master/documentation/project_structure.md)

## [Database Structure](https://github.com/JulieW23/rnapp/blob/master/documentation/database_structure.md)

## [Running Tests](https://github.com/JulieW23/rnapp/blob/master/documentation/running_tests.md)

## [Backend Workflows](https://github.com/JulieW23/rnapp/blob/master/documentation/workflows.md)
