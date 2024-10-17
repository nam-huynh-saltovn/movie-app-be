const { authJwt } = require("../middleware");

module.exports = function (router) {
    // Import the actor controller to handle the logic for each route
    const actorController = require("../controllers/actor.controller");

    // Define routes
    router.get("/api/v1/actor", actorController.getAll);
    router.get("/api/v1/actor/:id", actorController.getById);
    router.post("/api/v1/actor", [authJwt.verifyToken, authJwt.isAdmin], actorController.insert);
};
