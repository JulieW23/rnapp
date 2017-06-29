module.exports = {
	// database link
	//databaseURL: 'postgres://postgres:Pinkbird222@localhost:5432/rapidnovordb',
	databaseURL: process.env.DATABASE_URL,
	// trello login callback
	trelloLoginCallback: "https://rnapp.herokuapp.com",

	// replace the two fields below with your own application key and secret
	// from this url:
	// https://trello.com/app-key
	trelloKey: "5878cbde87e11ff40633bf73c28291e0",
	trelloSecret: "c6fa27b49e16e4b339e9253082783e2d8713f80b31bf454bf52d7b1a83ad6a1d"
}