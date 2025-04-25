// Import Sequelize data types
const { DataTypes } = require("sequelize");

// Import sequelize db
const sequelize = require("../util/database");

// Contact Model
const Contact = sequelize.define("contact", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: "Name must be between 1 and 50 characters",
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  subject: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  postDate: { type: DataTypes.DATE, allowNull: false },
  response: { type: DataTypes.STRING, defaultValue: null },
  responseDate: { type: DataTypes.DATE, defaultValue: null },
});

module.exports = Contact;
