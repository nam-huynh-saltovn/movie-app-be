const { authJwt } = require("../middleware");

module.exports = function (router) {
    // Import the actor controller to handle the logic for each route
    const userController = require("../controllers/user.controller");

    // Define routes
    router.get("/api/v1/user", [authJwt.verifyToken, authJwt.isAdmin], userController.getAll);
    router.get("/api/v1/user/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.getById);
};
