module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const yearController = require("../controllers/year.controller");

  // Define routes
  router.get("/year", yearController.getAll);
  router.get("/year/:id", yearController.getById);
  router.post("/year", yearController.insert);
};
