module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const actorController = require("../controllers/actor.controller");

  // Define routes
  router.get("/actor", actorController.getAll);
  router.get("/actor/:id", actorController.getById);
  router.post("/actor", actorController.insert);
};
