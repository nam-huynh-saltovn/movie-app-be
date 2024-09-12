module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const directorController = require("../controllers/director.controller");

  // Define routes
  router.get("/director", directorController.getAll);
  router.get("/director/:id", directorController.getById);
  router.post("/director", directorController.insert);
};
