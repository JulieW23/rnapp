# rnapp

## Dependencies
* npm - https://www.npmjs.com/
* Node.js - https://nodejs.org/en/
* PostgreSQL - https://www.postgresql.org/
* All other dependencies are listed in package.json can be installed by running the command `npm install` in the root directory of this project.

## Setup
* Create a database in PostgreSQL named 'rapidnovordb'. This can be done in the PostgreSQL shell with the command `create database rapidnovordb;` 
* Edit the URL in files with your PostgreSQL information:

   app.js line 14
   
   /routes/trello.js line 6
   
   /models/trello.js line 2
   
   Format: `postgres://[someuser]:[somepassword]@[somehost]:[someport]/rapidnovordb`
   
* In the root directory of the project, run commands

   `npm install` to install dependencies, then 
   
   `node /models/trello.js` to create the database tables, then
   
   `npm start` to start the server
   
* You should be able to access the app at http://localhost:3000/
