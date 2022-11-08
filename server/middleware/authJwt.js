const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
    }
    User.findOne({where: {jwtId: decoded.jwtId}}).then(user => {
    if(user) {
        req.userId = user.id;
        next();
    } else {
        return res.status(401).send({ message: "Unauthorized!" });
    }     
})
});
};

checkAdmin = (req, res, next) => {
  if(req.isAdmin === false) {
     res.status(500).send({message: "Require admin role"})
     return
  } else {
    next()
    return
  }
}

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          req.isAdmin = true
          next();
          return;
        }
      }
      
      req.isAdmin = false
      next();
      return;
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  checkAdmin: checkAdmin
};
module.exports = authJwt;
