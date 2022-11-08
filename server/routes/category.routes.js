const { authJwt } = require("../middleware");
const controller = require("../controllers/category.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/categories",
          [authJwt.verifyToken, authJwt.isAdmin],
          controller.getCategories)
  app.get("/api/categories/:category_id",
          [authJwt.verifyToken, authJwt.isAdmin],
          controller.getCategory)
  app.get("/api/categories/category_id/posts",
          [authJwt.verifyToken, authJwt.isAdmin],
          controller.getPostFromCategory)
  app.post("/api/categories",
          [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
          controller.createCategory)
  app.patch("/api/categories/:category_id",
            [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
            controller.updateCategory)
  app.delete("/api/categories/:category_id",
            [authJwt.verifyToken, authJwt.isAdmin, authJwt.checkAdmin],
            controller.deleteCategory)
}