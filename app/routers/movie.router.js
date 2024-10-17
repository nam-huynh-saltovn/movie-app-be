const { autoUpdateMovie } = require("../common/scheduleUpdateMovie");
const { authJwt } = require("../middleware");
module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const movieController = require("../controllers/movie.controller");

  // Define routes
  router.get("/api/v1/movie", movieController.getAll);                           // get all movie
  router.get("/api/v1/movie/id/:id", movieController.getById);                   // get by id
  router.get("/api/v1/movie/slug/:slug", movieController.getBySlug);             // get by slug
  router.get("/api/v1/movie/type/:typeSlug", movieController.getByType);         // get by type
  router.get("/api/v1/movie/category/:catSlug", movieController.getByCategory);  // get by Category
  router.get("/api/v1/movie/country/:ctrSlug", movieController.getByCountry);    // get by Country
  router.get("/api/v1/movie/year/:year", movieController.getByYear);             // get by year
  router.get("/api/v1/latest-movie", movieController.getLatestMovies);           // get latest movie
  router.get("/api/v1/movie/search", movieController.searchByNameOrSlug);        // search by name || slug
  router.get("/api/v1/movie/filter", movieController.filterMovie);               // filter movie movie
  router.get("/api/v1/movie/test", autoUpdateMovie);                             // filter movie movie


  router.post("/api/v1/movie", [authJwt.verifyToken, authJwt.isAdmin], movieController.insert);            // create movie
  router.post("/api/v1/movie-api", [authJwt.verifyToken, authJwt.isAdmin], movieController.insertByApi);   // create by api

  router.put("/api/v1/movie", [authJwt.verifyToken, authJwt.isAdmin], movieController.update);             // update movie

  router.delete("/api/v1/movie/:id", [authJwt.verifyToken, authJwt.isAdmin], movieController.delete);      // delete movie
};
