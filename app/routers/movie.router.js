module.exports = function (router) {
  // Import the actor controller to handle the logic for each route
  const movieController = require("../controllers/movie.controller");

  // Define routes
  router.get("/movie", movieController.getAll);                           // get all movie
  router.get("/movie/id/:id", movieController.getById);                   // get by id
  router.get("/movie/slug/:slug", movieController.getBySlug);             // get by slug
  router.get("/movie/type/:typeSlug", movieController.getByType);         // get by type
  router.get("/movie/category/:catSlug", movieController.getByCategory);  // get by Category
  router.get("/movie/country/:ctrSlug", movieController.getByCountry);    // get by Country
  router.get("/movie/year/:year", movieController.getByYear);             // get by year
  router.get("/latest-movie", movieController.getLatestMovies);           // get latest movie
  router.get("/movie/search", movieController.searchByNameOrSlug);        // search by name || slug
  router.get("/movie/filter", movieController.filterMovie);               // filter movie movie

  router.post("/movie", movieController.insert);                          // create movie
  router.post("/movie-api", movieController.insertByApi);                 // create by api

  router.put("/movie", movieController.update);                           // update movie

  router.delete("/movie/:id", movieController.delete);                    // delete movie
};
