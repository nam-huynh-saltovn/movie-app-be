const { authJwt } = require("../middleware");

module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const directorController = require("../controllers/director.controller");

  // Define routes
  router.get("/api/v1/director", directorController.getAll);
  router.get("/api/v1/director/:id", directorController.getById);
  router.post("/api/v1/director", [authJwt.verifyToken, authJwt.isAdmin], directorController.insert);
};
