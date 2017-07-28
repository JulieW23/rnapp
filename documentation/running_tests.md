# Running Tests

For all tests, make sure that all database tables are already created. (Create database tables with command `make tables`)

## Trello Tests
The test cases in tests/trello_tests.js test to see if data is correctly calculated and displayed in the app.

* Insert the data for the test cases with the command

   `make trello_test`

* Start the server with the command

   `npm start`

* The expected calculation results are in the file trello_tests_results.txt

* Go to http://localhost:3000/trello?oauth_token=accesstoken1 to use the app with the inserted test data and compare the displayed information with the expected results.

## ProsperWorks Tests

### tests/pw_actions_tests.js

The test cases in tests/pw_actions_tests.js test to see if the action rows in the database have been correctly completed (stage where each opportunity is created and stage where an opportunity has it's status changed). 

* Insert the data for the test cases with command
   `make pw_db_test`
   
* Start the server with the command

   `npm start`
   
 * The expected results are in the file pw_actions_results.txt
 
 * From the psql command line, type in the query in line 1 of pw_actions_results.txt, and compare results.

### tests/pw_dist_calc_tests.js

The test cases in tests/pw_dist_calc_tests.js test to see whether the opportunity time distribution data is correctly calculated and displayed in the app.

* Make sure database tables are created.

* Insert the data for the test cases with command
   `make pw_dist_test`
   
* Start the server with the command
   `npm start`
   
* The expected results are in the file pw_dist_calc_results.txt

* Navigate to the ProsperWorks page on the app, select pipeline1, click the time distribution tab and submit time range from 2016-01-01 to the present date. Compare with expected results.

### tests/pw_count_tests.js

The test cases in tests/pw_count_tests.js test to see whether the number of created/won/lost/abandoned opportunities are counted and displayed correctly. 

* Make sure database tables are created.

* Insert the data for the test cases with command
   `make pw_count_test`
   
* Start the server with command
   `npm start`
   
* The expected results are in the file pw_count_results.txt

* Navigate to the ProsperWorks page on the app, select pipeline1, click the created and closed data tab and submit time range 2017-07-05 to present date. Compare with expected results.
