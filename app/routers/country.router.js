const { authJwt } = require("../middleware");

module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const countryController = require("../controllers/country.controller");

  // Define routes
  router.get("/api/v1/country", countryController.getAll);
  router.get("/api/v1/country/:id", countryController.getById);
  router.post("/api/v1/country", [authJwt.verifyToken, authJwt.isAdmin], countryController.insert);
};
