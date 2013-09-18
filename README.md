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
* HAProxy in front of the service nodes for load balancing

Release plan:
-------------
1. Basic node api to respond to GET request with either information about the requested url (JSON payload) or a 404 if the requested resource is not found in the database
2. Add an update endpoint to service to handle a POST with a list of JSON items to be added to the database
3. Add a queue that the update endpoint will add the list items to
4. Add an endpoint to be called by a scheduled task to process adds/deletes in the queue list (unless there's a way to do this in MongoDB)
5. Config for HAProxy to handle load balancing of nodes (optional)
6. Sharding/Replication config/nodes for MongoDB (optional)
