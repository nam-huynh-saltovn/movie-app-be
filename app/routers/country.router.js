module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const countryController = require("../controllers/country.controller");

  // Define routes
  router.get("/country", countryController.getAll);
  router.get("/country/:id", countryController.getById);
  router.post("/country", countryController.insert);
};
