'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Group, Payment }) {
      // Many-to-Many: Users ↔ Groups
      this.belongsToMany(Group, {
        through: 'UserGroups',
        foreignKey: 'userId',
        otherKey: 'groupId',
        as: 'groups',
      });

      // One-to-Many: Users ↔ Payments
      this.hasMany(Payment, {
        foreignKey: 'userId',
        as: 'payments',
      });
    }
  }

  User.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('User', 'GroupAdmin', 'MainAdmin'),
      defaultValue: 'User',
    },
    status: {
      type: DataTypes.ENUM('accepted', 'ignored'),
      defaultValue: 'accepted',
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
    modelName: 'User',
  });

  return User;
};
