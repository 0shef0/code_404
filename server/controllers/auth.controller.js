const nodemailer = require("nodemailer")
const db = require("../models");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;

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



exports.signup = (req, res) => {
  if(req.body.password === req.body.passwordConfirm) {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    jwtId: RandStr()
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
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
        // user role = 1
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
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ jwtId: user.jwtId }, config.secret, {
        expiresIn: 86400
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
  User.findOne({where: {
    id: req.userId
  }}).then(user => {
    if(!user) {
      return res.status(500).send({message: "user not found"})
    }
    user.jwtId = RandStr()
    user.save()
    res.status(200).send({message: "you've been signed out"})
  }) 
};

exports.passwordReset = async (req, res) => {
  User.findOne({where: {
    id: req.userId
  }}).then(async user => { 
    if(!user) {
      return res.status(500).send({message: "user not found"})
    }
    if(req.body.email != user.email) {
      return res.status(500).send({message: "wrong email"})
    }
    
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(user.jwtId, salt);

    let testAcc = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAcc.user,
        pass: testAcc.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"USOF" <usof@example.com>',
      to: user.email + ", " + user.email,
      subject: "Password reset",
      text: "http://localhost:8080/api/auth/password-reset/" + hash,
      html: 'http://localhost:8080/api/auth/password-reset/' + hash           
    })
    console.log(info)
    res.status(200).send({message: info})
  }) 
}

exports.confirmPassReset = (req, res) => {
  User.findOne({where: {
    id: req.userId
  }}).then(user => { 
    if(!user) {
      return res.status(500).send({message: "user not found"})
    }
    var validToken = bcrypt.compareSync(
      req.params.confirm_token,
      user.jwtId
    );

    if (!validToken) {
      return res.status(500).send({message: "wrong token"});
    }

    user.password = bcrypt.hashSync(req.body.new_password, 8)
    user.save()
    res.status(200).send({message: "password changed"})
  })
}

