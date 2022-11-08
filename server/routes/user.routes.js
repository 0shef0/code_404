const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.public);

  app.get("/api/users", controller.allUsers)

  app.get("/api/users/:user_id", controller.userById)

  app.post("/api/users",
          [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
          controller.createUser)

  app.delete("/api/users/:user_id",
  [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
            controller.delete)

  app.patch("/api/users/:user_id",
            [authJwt.verifyToken, authJwt.isAdmin],
            controller.updateUserData)

  app.get("/api/test/user",
          [authJwt.verifyToken],
          controller.userBoard
  );

  app.get("/api/test/admin",
          [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
          controller.adminBoard
  );
};
