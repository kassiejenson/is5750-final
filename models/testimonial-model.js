// Import Sequelize data types
const { DataTypes } = require("sequelize");

// Import sequelized db
const sequelize = require("../util/database");

// Testimonial Model
const Testimonial = sequelize.define("testimonial", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: DataTypes.STRING(50), allowNull: false },
  title: { type: DataTypes.STRING(100), allowNull: false },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    validate: {
      isImageFile(value) {
        if (!value.match(/\.(jpg|jpeg|png)$/i)) {
          throw new Error("Image must be a .jpg, .jpeg, or .png file");
        }
      }
    }
  }
});

module.exports = Testimonial;
