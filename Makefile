tables:
	node models/system.js
	node models/trello.js
	node models/prosperworks.js
test_data:
	node tests/trello_tests.js
	node tests/pw_actions_tests.js
trello_test:
	node tests/trello_tests.js
pw_db_test:
	node tests/pw_actions_tests.js
pw_dist_test:
	node tests/pw_dist_calc_tests.js
pw_count_test:
	node tests/pw_count_tests.js
	