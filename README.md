URL lookup service:
-------------------

Respond to GET requests where the caller passes in a URL and the service responds with some information about that URL. 
The GET requests look like this:

GET /urlinfo/1/{hostname_and_port}/{original_path_and_query_string}

The caller wants to know if it is safe to access that URL or not. 
These lookups are blocking users from accessing the URL until the caller receives a response from the service.

Considerations:
---------------
* The size of the URL list could grow infinitely
* The number of requests may exceed the capacity of this VM
* How to update the service with new URLs? Updates may be as much as 5 thousand URLs a day with updates arriving every 10 minutes. 

Technology Choices:
--------------------
* Node.js (v0.10.18) + Express (3.x) for service api
  * https://github.com/caolan/nodeunit for Unit Testing
* MongoDB for database (replication, sharding for future scaling considerations) - Mongoose 3.x for ORM interface to MongoDB

* (proposal/future consideration) HAProxy in front of the service nodes for load balancing

Testing:
--------
* using nodeunit (https://github.com/caolan/nodeunit)
* tests reside the test folder

Release plan:
-------------
v1.0 
Basic node api to respond to GET request with either information about the requested url (JSON payload) or a 404 if the requested resource is not found in the database. 
Found here: https://github.com/duthied/url-blacklist/tree/1.0

v1.1
Improve organization and structure + a unit test for the model. 
Found here: https://github.com/duthied/url-blacklist/releases/tag/1.1

v1.2 
A minor update (in hindsight this should have been v1.1.1) that changes the return value when a requested resource is not found from 404 to an emtpy JSON array. 
Found here: https://github.com/duthied/url-blacklist/releases/tag/1.2

v1.3 
Add an update endpoint to service to handle a POST with a list of JSON items to be added to the database.

v1.4 (proposal/future consideration)
Add a queue that the update endpoint will add the list items to.

v1.5 (proposal/future consideration)
Add an endpoint to be called by a scheduled task to process adds/deletes in the queue list (unless there's a way to do this in MongoDB).

v1.6 (proposal/future consideration)
Config for HAProxy to handle load balancing of nodes (optional).

v1.7 (proposal/future consideration)
Sharding/Replication config/nodes for MongoDB (optional).
