const { authJwt } = require("../middleware");

module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const categoryController = require("../controllers/category.controller");

  // Define routes
  router.get("/api/v1/category", categoryController.getAll);
  router.get("/api/v1/category/:id", categoryController.getById);
  router.post("/api/v1/category", [authJwt.verifyToken, authJwt.isAdmin], categoryController.insert);
};
