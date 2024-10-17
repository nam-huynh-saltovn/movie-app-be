// Load environment variables from .env file
require("dotenv").config();
var cors = require('cors');
const cron = require('node-cron');
const { autoCreateMovie } = require("./common/scheduleCreateMovie");
const { autoUpdateMovie } = require("./common/scheduleUpdateMovie");

// Import lib
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/connectDB");

// Create an express application
const app = express();

connectDB();

// Set port from environment variables or default to 8080
const port = process.env.PORT || 8080;

app.use(cors())

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

// Configure express to parse URL-encoded data and JSON
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Load and initialize route handlers for various endpoints
require("./routers/movie.router")(app);
require("./routers/year.router")(app);
require("./routers/type.router")(app);
require("./routers/episode.router")(app);
require("./routers/category.router")(app);
require("./routers/country.router")(app);
require("./routers/actor.router")(app);
require("./routers/director.router")(app);
require("./routers/auth.router")(app);
require("./routers/user.router")(app);
require("./routers/role.router")(app);

// Schedule create new movie run at 00:00 and 12:00 every day
cron.schedule('*0 0,12 * * *', async () => {
  try {
    await autoCreateMovie(); // Call your function
  } catch (error) {
      console.error('Error in autoCreateMovie job:', error);
  }
},{
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh" // GMT+7 time zone for Vietnam
});

// Schedule update movie run every day at 12:00 (noon)
cron.schedule('0 12 * * *', async () => {
  try {
    await autoCreateMovie(); // Call your function
    await autoUpdateMovie(); // Call function to update movies has new episode
    console.log('autoUpdateMovie job executed successfully at 12:00 (noon)');
  } catch (error) {
    console.error('Error in auto update new episode job:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh" // GMT+7 time zone for Vietnam
});


// Start the Express server and listen on the specified port
app.listen(port);
