module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    // avatar: {
    //   type: Sequelize.BLOB('long')
    // },
    raiting: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    jwtId: {
      type: Sequelize.STRING
    }
  });
  return User;
};
