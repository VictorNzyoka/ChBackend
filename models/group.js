'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate({ User, Payment }) {
      // Many-to-Many: Groups ↔ Users
      this.belongsToMany(User, {
        through: 'UserGroups',
        foreignKey: 'groupId',
        otherKey: 'userId',
        as: 'users',
      });

      // One-to-Many: Groups ↔ Payments
      this.hasMany(Payment, {
        foreignKey: 'groupId',
        as: 'payments',
      });
    }
  }

  Group.init({
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
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Group',
  });

  return Group;
};
