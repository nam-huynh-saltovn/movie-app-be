module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const categoryController = require("../controllers/category.controller");

  // Define routes
  router.get("/category", categoryController.getAll);
  router.get("/category/:id", categoryController.getById);
  router.post("/category", categoryController.insert);
};
