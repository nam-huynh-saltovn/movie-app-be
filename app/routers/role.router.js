const { authJwt } = require("../middleware");

module.exports = function (router) {
    // Import the actor controller to handle the logic for each route
    const roleController = require("../controllers/role.controller");

    // Define routes
    router.get("/api/v1/role", [authJwt.verifyToken, authJwt.isAdmin], roleController.getAll);
    router.get("/api/v1/role/:id", [authJwt.verifyToken, authJwt.isAdmin], roleController.getById);
    router.post("/api/v1/role", roleController.insert);
};
