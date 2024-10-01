module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const episodeController = require("../controllers/episode.controller");

  // Define routes
  router.get("/api/v1/episode", episodeController.getAll);
  router.get("/api/v1/episode/:id", episodeController.getById);
  router.get("/api/v1/episode/mv/:movId", episodeController.getByMovieId);
  router.get("/api/v1/episode/mv/all/:movId", episodeController.getAllByMovieId);

  router.post("/api/v1/episode", episodeController.insert);

  router.put("/api/v1/episode", episodeController.update);
  router.put("/api/v1/episode/sort-oder/:id", episodeController.updateSortOrder);

  router.delete("/api/v1/episode/:id", episodeController.delete);
};
