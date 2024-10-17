const { authJwt } = require("../middleware");

module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const typeController = require("../controllers/type.controller");

  // Define routes
  router.get("/api/v1/type", typeController.getAll);
  router.get("/api/v1/type/:id", typeController.getById);
  router.post("/api/v1/type", [authJwt.verifyToken, authJwt.isAdmin], typeController.insert);
};
