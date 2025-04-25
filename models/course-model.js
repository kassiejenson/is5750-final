// Import Sequelize data types
const { DataTypes } = require("sequelize");

// Import sequelized db
const sequelize = require("../util/database");

// Import slugify
const slugify = require("slugify");

// Course Model
const Course = sequelize.define("course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: "Title must be between 1 and 50 characters"
      }
    },
    set(value) {
      this.setDataValue("title", value);
      this.setDataValue("slug", slugify(value, { lower: true, trim: true }));
    },
  },
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
  summary: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DECIMAL, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  registrants: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  trainer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slug: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Course;
