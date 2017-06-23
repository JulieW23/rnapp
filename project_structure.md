# Project Structure

## app.js
   
   The main file containing server code.
   It also contains the code for retrieving data from Trello etc. and storing the data into the app's own database.
  
## /models

   This directory contains all the code to create database tables.
   
   /models/trello.js - creates database tables to store data from trello.
   
## /public

   This directory contains all the front end css and javascript code.
   
   /public/javascripts/trello.js - main javascript for the Trello report page.
   
   /public/javascripts/trelloController.js - AngularJS controller for the Trello report page.
   
   /public/stylesheets/style.css - general styling for the app.
   
   /public/stylesheets/trello.css - styling for the Trello report page.
   
## /views

   This directory contains all the views (front end html) for this project.
   
   /views/index.ejs - home page
   
   /views/trello.ejs - Trello report page
   
   /views/error.ejs - error page
   
## /routes

   This directory contains all the defined endpoints for database queries and routes for the app.
   
   /routes/index.js - renders the home page
   
   /routes/trello.js - renders the Trello report page, and also defines endpoints for database queries for Trello data.
   
## /bin

   This directory contains server startup scripts. (Express auto-generated, unedited)
