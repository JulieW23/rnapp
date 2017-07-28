# Workflows
## Trello
### Trello Login + Storing Data Workflow

Home page -> User clicking Trello link -> 

calls endpoint /trelloLogin (handled in app.js) -> 


calls /login/trello_oauth.js login() to display the Trello authorization page -> user clicking 'Allow' ->

callback goes to endpoint /trello (handled in app.js) -> 

calls /login/trello_oauth.js callback() which will get data from Trello API and store in app's database -> 

render trello report page (views/trello.ejs)

### Trello Board Selection Workflow

Angular js controller /public/javascripts/trelloController.js gets all the boards, lists and cards that the user has access to from the app's database and displays them -> 

user selects board -> angular controller detects the change -> 

calls /public/javascripts/trello.js boardSelected() to display tabs

### Trello tabs
User clicks a tab -> 

/public/javascripts/shared_scripts.js openTab() will display the correct tab

### Trello Active Items Tab
Displays the relevant cards, handled by trello.ejs and /public/javascripts/trelloController.js

If 'Card History' is clicked -> 

calls /public/javascripts/trello.js getHistory()

### Trello Closed Items Tab
Similar to Active Items Tab.

### Trello List Graphs Tab, Distribution Graphs Tab, Card Table
User submits a date range -> calls /public/javascripts/trello.js generateFigure() -> 

calls /public/shared_scripts.js getTimeRange() to process the time range, then generateFigure() queries relevant data from the
app's database, calculates data ->

calls /public/javascripts/shared_scripts.js calcAverage() -> 

figure is generated.

## ProsperWorks
### ProsperWorks Login
Edit config.js with your api_key and email. ProsperWorks will take data from the account you used to generate the api_key.

Home page -> user clicking on ProsperWorks link -> 

calls endpoint /prosperworks (handled in /routes/prosperworks.js) -> 

calls /login/prosperworks.js storeData() to get data from ProsperWorks API and store it in the app's database -> 

renders ProsperWorks report page (/views/prosperworks.ejs)

### ProsperWorks Pipeline Selection 

Angular js controller /public/javascripts/prosperworksController.js gets all the pipelines, stages and opportunities and displays them ->

user selects pipeline -> angular controller detects the change -> 

calls /public/javascripts/pw_count_status.js pipelineSelected() to display tabs

### ProsperWorks Tabs
User clicks a tab -> 

/public/javascripts/shared_scripts.js openTab() will display the correct tab

### ProsperWorks Time Distribution Tab
User submits a date range -> calls /public/javascripts/pw_time_distribution.js opTimeDistribution() ->

calls /public/shared_scripts.js getTimeRange() to process the time range, then opTimeDistribution() queries relevant data from the
app's database, calculates data -> 

calls /public/javascripts/shared_scripts.js calcAverage() -> 

figure is generated.

### ProsperWorks Opportunity Status Data Tab
User submits a date range -> calls /public/javascripts/pw_count_status.js opActivity() -> 

calls public/shared_scripts.js getTimeRange() to process time range, then opTimeDistribution() queries relevant data from the 
app's database -> 

calls /public/javascripts/pw_count_status.js countHelper() to count data -> 

counted data is displayed.

### ProsperWorks Opportunity Status Data Tab View Details
User clicks view details button -> calls /public/javascripts/pw_count_status.js opActivityDetails() -> 

details are calculated and displayed.

Switching between count and values on the graph will call the event listener in /public/javascripts/pw_count_status.js to display 
the requested graph.
