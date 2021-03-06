const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const Reaction = require("./Reaction");
const User = require("./User");

Payment = sequelize.define("payment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  sum: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    get() {
      const stringValue = this.getDataValue("sum");
      return parseInt(stringValue, 10);
    }
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,    
    defaultValue: function() {
      return Date.now()
    }
  }
});

// Comment.belongsTo(User); //belongs to campaign
// Comment.hasMany(Reaction, {onDelete: "cascade"});

module.exports = Payment;