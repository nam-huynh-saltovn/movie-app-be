const { authJwt } = require("../middleware");

module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const yearController = require("../controllers/year.controller");

  // Define routes
  router.get("/api/v1/year", yearController.getAll);
  router.get("/api/v1/year/:id", yearController.getById);
  router.post("/api/v1/year", [authJwt.verifyToken, authJwt.isAdmin], yearController.insert);
};
