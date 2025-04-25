const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Event = sequelize.define("event", {
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
    }
  },
  summary: { 
    type: DataTypes.STRING(350),
    allowNull: false,
    validate: {
      len: {
        args: [1, 350],
        msg: "Summary must be between 1 and 350 characters"
      }
    }
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
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
});

module.exports = Event;