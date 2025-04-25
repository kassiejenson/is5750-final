const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "",  // database
  "",  // username
  "",  // password
  {
    dialect: "mysql",
    host: "is-5750.ckm1cfmd3i4j.us-west-2.rds.amazonaws.com",
    logging: false
  }
);

module.exports = sequelize;
