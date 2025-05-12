const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmpresaCurso = sequelize.define('Empresa_Curso', {
  Empresa_ID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Empresa',
      key: 'ID'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  Curso_ID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Curso',
      key: 'ID'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'Empresa_Curso',
  timestamps: false
});

module.exports = EmpresaCurso; 