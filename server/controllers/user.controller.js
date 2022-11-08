const db = require("../models");
var bcrypt = require("bcryptjs");
const { comment } = require("../models");
const Users = db.user;
const Roles = db.role;
const Post = db.post
const Comment = db.comment
const Like = db.like

const Op = db.Sequelize.Op;
var saltRounds = 10 

function RandStr () {
  var res = ''
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var length = chars.length
  for (var i = 0; i < 100; i++) {
      res = chars.charAt(Math.floor(Math.random() * length))
  }
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(res, salt);
  return hash
}

exports.public = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.allUsers = (req, res) => {
  Users.findAll().then(user => {
    res.status(200).send(user)
})
}

exports.userById = (req, res) => {
  Users.findOne({where: {
    id: req.params.user_id
  }}).then(user => {
    if(!user) {
      return res.status(500).send({message: "user not found"})
    }
    res.status(200).send(user)
  })
}

// exports.avatar = (req, res) => {
//   res.status(200).send("user")
// }

exports.updateUserData = (req, res) => {
  Users.findOne({where: {
    id: req.params.user_id
  }}).then(user => {
    if(!user) {
      return res.status(500).send({message: "user not found"})
    }
    if (user.id != req.userId) {
      if(req.isAdmin === false) {
        return res.status(500).send({message: "access denied"})
      }
    }
    if(req.body.username) {
      Users.findOne({where: {
        username: req.body.username
      }}).then(userCheckName => {
        if(!userCheckName){
          user.username = req.body.username
          user.save()
        } else if(user.id === userCheckName.id ){
          user.username = req.body.username
          user.save()
        } else {
          return res.status(500).send({message: "username is already exist"})
        }
        if(req.body.email) {
          Users.findOne({where: {
            email: req.body.email
          }}).then(userCheckEmail => {
            if(!userCheckEmail) {
              user.email = req.body.email
              user.save()
            } else if(user.id === userCheckEmail.id ){
              user.email = req.body.email
              user.save()
            } else {
              return res.status(500).send({message: "email is already exist"})
            }
          }) 
        }
      })
    }
    user.save()
    res.status(200).send(user)
  })
}

exports.createUser = (req, res) => {
  if(req.body.password === req.body.passwordConfirm) {
    Users.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      jwtId: RandStr()
    })
      .then(user => {
        if (req.body.roles) {
          Roles.findAll({
            where: {
              name: {
                [Op.or]: req.body.roles
              }
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User registered successfully!" });
            });
          });
        } else {
          user.setRoles([1]).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.send({message: "Passwords don't match"})
  }
}

exports.delete = (req, res) => {
  Users.findOne({where: {
    id: req.params.user_id
  }}).then(user => {
    if(!user){
      return res.status(500).send({message: "user not found"})
    }
    Comment.destroy({
      where: {
        userId: req.params.user_id
      }
    })
    const posts = Post.findAll({where: {
      userId: req.params.user_id
    }, include: {
        model: Comment,
        as: "comments"
    }})
    posts.map(elem => {
      elem.comments.forEach(comment => {
        Like.destroy({
          where: {
            commentId: comment.id
          }
        })
      })
      Comment.destroy({where: {
        postId: elem.id
      }})
      Like.destroy({where: {
        postId: elem.id
      }})
    })
    Post.destroy({where: {
      userId: req.params.user_id
    }})
    Users.destroy({
      where: {
        id: req.params.user_id
      }
    })
    res.status(200).send({message: "deleted"})
  })
}

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};