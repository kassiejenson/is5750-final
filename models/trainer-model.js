// Import Sequelize data types
const { DataTypes } = require("sequelize");

// Import sequelized db
const sequelize = require("../util/database");

// Trainer Model
const Trainer = sequelize.define("trainer", {
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
        msg: "Name must be between 1 and 50 characters"
      }
    } },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isImageFile(value) {
        if (!value.match(/\.(jpg|jpeg|png)$/i)) {
          throw new Error("Image must be a .jpg, .jpeg, or .png file");
        }
      }
    }
  },
  expertise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Trainer;
