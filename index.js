// Load environment variables from .env file
require("dotenv").config();
var cors = require('cors');

// Import lib
const express = require("express");
const bodyParser = require("body-parser");

// Create an express application
const app = express();

// Set port from environment variables or default to 8080
const port = process.env.PORT || 8080;

app.use(cors())
 app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

// Configure express to parse URL-encoded data and JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load and initialize route handlers for various endpoints
require("./app/routers/movie.router")(app);
require("./app/routers/year.router")(app);
require("./app/routers/type.router")(app);
require("./app/routers/episode.router")(app);
require("./app/routers/category.router")(app);
require("./app/routers/country.router")(app);
require("./app/routers/actor.router")(app);
require("./app/routers/director.router")(app);

// Start the Express server and listen on the specified port
app.listen(port);
