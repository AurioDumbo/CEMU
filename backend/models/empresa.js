const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  NIF: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  Nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Provincia: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  Telefone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    unique: true
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  Status: {
    type: DataTypes.ENUM('Ativo', 'Inativo', 'Pendente'),
    defaultValue: 'Pendente'
  }
}, {
  tableName: 'Empresa',
  timestamps: false
});

module.exports = Empresa; 