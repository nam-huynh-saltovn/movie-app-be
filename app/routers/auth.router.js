const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");

module.exports = function (router) {
    const authController = require("../controllers/auth.controller");
  
    // Define routes
    router.post("/api/v1/auth/signup", [ verifySignUp.checkDuplicateUsername, verifySignUp.checkRolesExisted ], authController.signup);
    router.post("/api/v1/auth/signin", authController.signin);
    router.post("/api/v1/auth/signout", authJwt.verifyToken, authController.signout);
};
  