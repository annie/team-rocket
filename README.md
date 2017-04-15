## Team Rocket (game name TBD)

Welcome to our ASE project!

Here's a quick guide to our directory structure.

### app/
This directory contains our server-side code that handles routing and storing data in MongoDB. *routes.js* handles serving the correct HTML files to URL endpoints, and responds to other types of HTTP requests. The **models/** directory contains our Mongoose schemas for MongoDB.

### public/
This directory contains the files that are served to the client - HTML, CSS, frontend JS, and static files (like images). It also contains the PixiJS files that we are using as our frontend graphics framework.

### test/
This directory contains all of our Jasmine unit tests.
