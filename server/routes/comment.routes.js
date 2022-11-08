const { authJwt } = require("../middleware");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/comments/:comment_id",
            controller.getComment)
  app.get("/api/comments/:comment_id/like", 
            controller.getLikesFromComment)
  app.post("/api/comments/:comment_id/like",
            [authJwt.verifyToken],
            controller.createLike)
  app.patch("/api/comments/:comment_id",
            [authJwt.verifyToken, authJwt.isAdmin],
            controller.updateComment)
  app.delete("/api/comments/:comment_id",
            [authJwt.verifyToken, authJwt.isAdmin],
            controller.deleteComment)
  app.delete("/api/comments/:comment_id/like",
            [authJwt.verifyToken, authJwt.isAdmin],
            controller.deleteLike)
} 