module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const episodeController = require("../controllers/episode.controller");

  // Define routes
  router.get("/episode", episodeController.getAll);
  router.get("/episode/:id", episodeController.getById);
  router.get("/episode/mv/:movId", episodeController.getByMovieId);

  router.post("/episode", episodeController.insert);

  router.put("/episode", episodeController.update);

  router.delete("/episode/:id", episodeController.delete);
};
