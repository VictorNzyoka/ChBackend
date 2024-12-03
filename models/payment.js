'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate({ User, Group }) {
      // Belongs to User
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Belongs to Group
      this.belongsTo(Group, {
        foreignKey: 'groupId',
        as: 'group',
      });
    }
  }

  Payment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Payment',
  });

  return Payment;
};
