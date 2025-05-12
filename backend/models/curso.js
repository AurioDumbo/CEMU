const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  Nome: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  Faculdade_ID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'Faculdade',
      key: 'ID'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'Curso',
  timestamps: false
});

module.exports = Curso; 