const { authJwt } = require("../middleware")
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/password-reset",
            [authJwt.verifyToken],
            controller.passwordReset)

  app.post("/api/auth/password-reset/:confirm_token",
            [authJwt.verifyToken],
            controller.confirmPassReset)

  app.post("/api/auth/login", controller.signin);

  app.post("/api/auth/logout",
            [authJwt.verifyToken],
            controller.logout);
};
