module.exports = {
	// database link
	//databaseURL: 'postgres://postgres:Pinkbird222@localhost:5432/rapidnovordb',
	databaseName: 'rapidnovordb',
	databaseUser: 'postgres',
	databasePassword: 'Pinkbird222',
	databasePort: 5432,
	databaseHost: 'localhost',
	// trello login callback
	//trelloLoginCallback: "https://rnapp.herokuapp.com",
	trelloLoginCallback: "http://localhost:3000",

	/* =========================================================
	// Trello
	============================================================ */
	// replace the two fields below with your own application key and secret
	// from this url:
	// https://trello.com/app-key
	trelloKey: "5878cbde87e11ff40633bf73c28291e0",
	trelloSecret: "c6fa27b49e16e4b339e9253082783e2d8713f80b31bf454bf52d7b1a83ad6a1d",

	/* =========================================================
	// ProsperWorks
	============================================================ */
	// instructions on how to generate api key here:
	// https://www.prosperworks.com/developer_api/token_generation
	pw_api_key: "e537e1eae298dfd1efd19cf758383dc2",
	pw_email: "tacobunnies23@gmail.com"
}
