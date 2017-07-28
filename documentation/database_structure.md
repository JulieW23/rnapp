# Database Structure

## /models/trello.js
### Board Table
Table for storing Trello board information. Each row is the information for one Trello board.

Columns name | Description | Details
--- | --- | ---
id | primary key of this table, the id is the id that is assigned to the board by Trello| <ul><li>string, maximum 25 character</li><li>cannot be NULL</li></ul>
name | name of the Trello board | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
shortURL | URL to the board on Trello | <ul><li>string, maximum 40 characters</li><li>cannot be NULL</li></ul>
memberships | an array storing the id of users that have access to this board | <ul><li>array of strings</li></ul>

### List Table
Table for storing Trello list information. Each row is the information for one Trello list.

Column name | Description | Details
--- | --- | ---
id | primary key of this table, the id is the id that is assigned to the list by Trello | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li></ul>
idBoard | the id of the board that this list belongs to | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li><li>references Board(id)</li></ul>
name | name of the Trello list | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
closed | whether or not the list is archived | <ul><li>boolean, default: false</li></ul>
memberships | an array storing the id of users that have access to this list | <ul><li>array of strings</li></ul>
   
### Card Table
Table for storing Trello card information. Each row is the information for one Trello card.

Column name | Description | Details 
--- | --- | ---
id | primary key of this table, the id is the id that is assigned to the card by Trello | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li></ul>
name | name of the Trello card | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
description | description of the card | <ul><li>string, maximum 1000 characters</li></ul>
due | the due date of the Trello card, if there is one | <ul><li>timestamp, ISO 8601 format</li></ul>
dueComplete | whether or not the card has been completed (set to complete on Trello) | <ul><li>boolean, default: false</li></ul>
idBoard | id of the board that this card belongs to | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li><li>references Board(id)</li></ul>
idList | id of the list that this card belongs to | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li><li>references List(id)</li></ul>
shortURL | URL to the card on Trello | <ul><li>string, maximum 40 characters</li><li>cannot be NULL</li></ul>
closed | whether or not this card is archived | <ul><li>boolean, default: false</li></ul>
memberships | an array storing the id of users that have access to this card | <ul><li>array of strings</li></ul>

### Member Table
Table for storing Trello user information. Each row is the information for one Trello user.

Columns Name | Description | Details
--- | --- | ---
id | primary key of this table, the id is the id that is assigned to the user by Trello | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li></ul>
name | name of the user | <ul><li>string, maximum 50 characters</li></ul>
accessToken | when a user authorizes the app to access data from their Trello account, an accessToken is generated. Since the app's own account/login system has not yet been implemented, the app currently uses this accessToken to maintain privacy so that users of the app can only see Trello information that they have access to. | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>

### Action Table
Table for storing actions (creating, moving, and archiving cards). Each row is one action.

Column Name | Description | Details
--- | --- | ---
id | primary key of this table, the id is the id that is assigned to the action by Trello | <ul><li>string, maximum 25 characters</li><li>cannot be NULL</li></ul>
idCard | id of the card that this action is related to | <ul><li>string, maximum 25 characters</li></ul>
date | date and time of the action | <ul><li>timestamp, ISO 8601 format</li></ul>
type | type of the action | <ul><li>'createCard' is an action where a card is created</li><li>'updateCard' is an action where a card has been moved/archived/unarchived</li></ul>
createdInList | if this action is a card being created, this column will have the name of the list that the card was created in. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
listBefore | if this action is a card being moved, this column will have the name of the list that the card is being moved out of. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
listAfter | if this action is a card being moved, this column will have the name of the list that the card is being moved into. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
closedInList | if this action is a card being archived/unarchived, this column will have the name of the list that the card was archived/unarchived in. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
createdInListId | the id of the list in the createdInList column | <ul><li>string, maximum 25 characters</li></ul>
listBeforeId | the id of the list in the listBefore column | <ul><li>string, maximum 25 characters</li></ul>
listAfterId | the id of the list in the listAfter column | <ul><li>string, maximum 25 characters</li></ul>
closedInListId | the id of the list in the closedInList column | <ul><li>string, maximum 25 characters</li></ul>
boardBeforeId | if the action is a card being moved to a different board, this column will have the id of the board that the card is being moved out of. Otherwise, this column will be empty. | <ul><li>string, maximum 25 characters</li></ul>
boardAfterId | if the action is a card being moved to a different board, this column will have the id of the board that the card is being moved into. Otherwise, this column will be empty. | <ul><li>string, maximum 25 characters</li></ul>
closed | if the action is a card being archived/unarchived, this column will be 't' if the card is being archived, and 'f' if the card is being unarchived. Otherwise, this column will be empty. | <ul><li>boolean</li></ul>

## /models/prosperworks.js
### PWAccount Table
Table for storing ProsperWorks account information. Each row is the information for one account. 

Column Name | Description | Details
--- | --- | ---
id | the id of the account, assigned by ProsperWorks | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the account | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
   
### PWMember Table
Table for storing ProsperWorks members information. Each row is the information for one member.

Column Name | Description | Details
--- | --- | ---
id | the id of the member, assigned by ProsperWorks | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the member's name | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
email | the member's email | <ul><li>string, maximum 200 characters</li></ul>
   
### Company Table
Table for storing ProsperWorks company information. Each row is the information for one company.

Column Name | Description | Details
--- | --- | ---
id | the id of the company, assigned by ProsperWorks | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the company | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
address | the company's address | <ul><li>string, maximum 500 characters</li></ul>
details | the company's details | <ul><li>string, maximum 1500 characters</li></ul>

### Pipeline Table
Table for storing ProsperWorks pipeline information. Each row is the information for one pipeline.

Column Name | Description | Details
--- | --- | ---
id | the id of the pipeline, assigned by ProsperWorks | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the pipeline | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
stages | an array containing the id of the stages in this pipeline | <ul><li>array of strings</li></ul>

### PipelineStage Table
Table for storing ProsperWorks pipeline stage information. Each row is the information for one stage.

Column Name | Description | Details
--- | --- | ---
id | the id of the stage, assigned by ProsperWorks | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the stage | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
pipeline_id | the id of the pipeline that this stage belongs to | <ul><li>string, maximum 50 characters</li><li>references Pipeline(id)</li></ul>
win_probability | the probability of a win in this stage | <ul><li>integer</li></ul>

### Loss Reason Table
Table for storing ProsperWorks loss reason information. Each row is the information for one less reason.

Column Name | Description | Details
--- | --- | ---
id | the id of the loss reason | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the loss reason | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>

### Opportunity Table
Table for storing ProsperWorks opportunity information. Each row is the information for one opportunity.

Column Name | Description | Details
--- | --- | ---
id | the id of the opportunity | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
name | the name of the opportunity | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
assignee_id | the id of the member assigned to this opportunity | <ul><li>string, maximum 50 characters</li><li>references PWMember(id)</li></ul>
company_id | the id of the company that this opportunity is attached to | <ul><li>string, maximum 50 characters</li></ul>
company_name | the name of the company that this opportunity is attached to | <ul><li>string, maximum 100 characters</li></ul>
details | the details of this opportunity | <ul><li>string, maximum 1000 characters</li></ul>
loss_reason_id | if this opportunity is lost, this column will contain the id of the loss reason. Otherwise, this column will be empty. | <ul><li>string, maximum 50 characters</li></ul>
monetary_value | the monetary value of this opportunity | <ul><li>string, maximum 50 characters</li></ul>
pipeline_id | the id of the pipeline that this opportunity belongs to | <ul><li>string, maximum 40 characters</li><li>references Pipeline(id)</li></ul>
priority | the priority of the opportunity | <ul><li>Is one of these values: 'None', 'Low', 'Medium', 'High'</li></ul>
pipeline_stage_id | the id of the pipeline stage that this opportunity belongs to | <ul><li>string, maximum 50 characters</li><li>references PipelineStage(id)</li></ul>
status | the status of the card | <ul><li>Is one of these values: 'Open', 'Won', 'Lost', 'Abandned</li></ul>
win_probability | the probability of winning this opportunity | <ul><li>integer</li></ul>
date_created | the date that this opportunity was created | <ul><li>timestamp, ISO 8601 format</li></ul>
   
### PWAction Table
Column Name | Description | Details
--- | --- | ---
id | the id of the action, assigned to the opportunity. if the action is a create action, the character 'c' is added to the front | <ul><li>string, maximum 50 characters</li><li>cannot be NULL</li></ul>
type | the type of the action | <ul><li>Is one of these values: 'Stage Change', 'Status Change', 'Created'</li></ul>
opportunity_id | the id of the opportunity that this action is related to | <ul><li>string, maximum 50 characters</li></ul>
parent_resource | the name of the resource that this action is related to | <ul><li>string, maximum 50 characters</li></ul>
date | the date of the action | <ul><li>timestamp, ISO 8601 format</li></ul>
stageCreated | if the action is creating an opportunity, this column is the name of the stage that the opportunity was created in. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
stageBefore | if the action is moving an opportunity, this column is the name of the stage that the opportunity is moving out of. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
stageAfter | if the action is moving an opportunity, this column is the name of the stage that the opportunity is moving into. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
stageClosed | if the action is closing an opportunity, this column is the name of the stage that the opportunity was closed in. Otherwise, this column will be empty. | <ul><li>string, maximum 100 characters</li></ul>
stageCreatedId | the id of the stage in the stageCreated column | <ul><li>string, maximum 50 characters</li></ul>
stageBeforeId | the id of the stage in the stageBefore column | <ul><li>string, maximum 50 characters</li></ul>
stageAfterId | the id of the stage in the stageAfter column | <ul><li>string, maximum 50 characters</li></ul>
stageClosedId | the id of the stage in the stageClosed column | <ul><li>string, maximum 50 characters</li></ul>
closedStatus | if the action is changing the status of an opportunity, this column is the new status of the oppportunity. Otherwise. this column will be empty| Is one of these values: 'Open', 'Won', 'Lost', 'Abandoned'
closed | if the action is strictly closing or reopening an opportunity , this column is 't' if the opportunity is being closed, and 'f' if the opportunity is being opened. | <ul><li>boolean</li></ul>

## /models/system.js
### SystemAccount Table
Table for storing this app's own login/account info. Each row is the account information for one user.

*Creating account + login features are not yet implemented, so this table is not currently used.

Columns name | Description | Details
--- | --- | ---
id | primary key of this table, auto generated by system | <ul><li>string, maximum 50 character</li><li>cannot be NULL</li></ul>
email | email address of the user | <ul><li>string, maximum 100 characters</li><li>cannot be NULL</li></ul>
password | the user's password | <ul><li>string, maximum 30 characters</li><li>cannot be NULL</li></ul>
firstname | first name of the user | <ul><li>string, maximum 20 characters</li><li> cannot be NULL</li></ul>
lastname | last name of the user | <ul><li> last name of the user</li><li>cannot be NULL</li></ul>
