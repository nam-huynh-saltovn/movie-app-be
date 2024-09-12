module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const typeController = require("../controllers/type.controller");

  // Define routes
  router.get("/type", typeController.getAll);
  router.get("/type/:id", typeController.getById);
  router.post("/type", typeController.insert);
};
